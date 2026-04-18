/**
 * BattleX ↔ Parking Jam Bridge v5
 * - Suppresses GDevelop watermark + auth
 * - Sends score to BattleX Supabase
 * - Shows in-game leaderboard overlay after submit
 */
(function () {
  'use strict';

  var scoreSubmitted = false;
  var lastAdLevel = 0;
  var _playerName = '';

  // ── 1. Clean GDevelop DOM elements ───────────────────────────────────────
  function cleanDOM() {
    ['#watermark','#watermark-link','#watermark-background'].forEach(function(s) {
      document.querySelectorAll(s).forEach(function(el) { el.remove(); });
    });
    document.querySelectorAll('iframe[src*="gd.games"],iframe[src*="gdevelop"]')
      .forEach(function(el) { el.remove(); });
  }
  cleanDOM();
  setInterval(cleanDOM, 400);

  // ── 2. Override gdjs.playerAuthentication ────────────────────────────────
  function suppressAuth() {
    if (!window.gdjs || !window.gdjs.playerAuthentication) return;
    var pa = window.gdjs.playerAuthentication;
    pa.displayAuthenticationBanner = function() {};
    pa.openAuthenticationWindow    = function() { return { promise: Promise.resolve({ status: 'dismissed' }) }; };
    pa.isAuthenticated             = function() { return false; };
  }
  suppressAuth();
  setInterval(suppressAuth, 300);

  // ── 3. Override GDevelop leaderboard ─────────────────────────────────────
  function suppressLeaderboard() {
    if (!window.gdjs || !window.gdjs.evtTools || !window.gdjs.evtTools.leaderboards) return;
    var lb = window.gdjs.evtTools.leaderboards;
    lb.displayLeaderboard       = function() { return Promise.resolve(); };
    lb.closeLeaderboardView     = function() {};
    lb.saveConnectedPlayerScore = function() { return { then: function() {} }; };
    lb.isSaving                 = function() { return false; };
    lb.hasBeenSaved             = function() { return false; };
  }
  suppressLeaderboard();
  setInterval(suppressLeaderboard, 300);

  // ── 4. Get game variables ─────────────────────────────────────────────────
  function getGameVars() {
    try {
      var g = window.gdjs && window.gdjs.__currentGame;
      if (!g) return null;
      var v = g.getVariables();
      return {
        speedrunTime:    v.getFromIndex(0).getAsNumber(),
        currentLevel:    v.getFromIndex(1).getAsNumber(),
        score:           v.getFromIndex(2).getAsNumber(),
        speedrunEnabled: v.getFromIndex(3).getAsBoolean(),
      };
    } catch(e) { return null; }
  }

  // ── 5. Send score to BattleX ──────────────────────────────────────────────
  function sendScore(playerName) {
    if (scoreSubmitted) return;
    var v = getGameVars();
    if (!v) return;
    scoreSubmitted = true;
    _playerName = (playerName || 'Anonymous').trim().slice(0, 24);

    var payload = {
      type:            'PARKING_JAM_SCORE',
      game:            'parking-jam',
      playerName:      _playerName,
      speedrunTimeMs:  Math.round(v.speedrunTime * 1000),
      speedrunTime:    v.speedrunTime,
      score:           Math.round(v.score),
      level:           Math.round(v.currentLevel),
      speedrunEnabled: true,
    };

    /* Method 1: postMessage to parent (works when inside iframe) */
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, '*');
    }

    /* Method 2: Direct API call using absolute URL */
    var apiBase = 'https://battle-x.vercel.app';
    console.log('[BattleX] Submitting score for:', _playerName, 'time:', payload.speedrunTimeMs);
    fetch(apiBase + '/api/leaderboard', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game:            'parking-jam',
        playerName:      _playerName,
        speedrunTimeMs:  payload.speedrunTimeMs,
        speedrunTime:    payload.speedrunTime,
        score:           payload.score,
        level:           payload.level,
        speedrunEnabled: true,
      }),
    })
    .then(function(r) {
      console.log('[BattleX] API response status:', r.status);
      return r.json();
    })
    .then(function(result) {
      console.log('[BattleX] Score saved:', JSON.stringify(result));
    })
    .catch(function(err) {
      console.warn('[BattleX] Score save failed:', err.message || err);
    });

    setTimeout(function() { scoreSubmitted = false; }, 5000);
  }

  // ── 6. Ad requests ────────────────────────────────────────────────────────
  function requestAd(adType) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'BATTLEX_SHOW_AD', adType: adType, game: 'parking-jam' }, '*');
    }
  }

  // ── 7. Show leaderboard overlay inside the game ───────────────────────────
  function showLeaderboard(playerName) {
    var existing = document.getElementById('bx-leaderboard-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'bx-leaderboard-overlay';
    overlay.innerHTML = `
      <style>
        #bx-leaderboard-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: rgba(0,0,0,0.92);
          display: flex; flex-direction: column;
          align-items: center;
          font-family: 'LuckiestGuy-Regular', 'Arial Black', sans-serif;
          overflow-y: auto;
          padding: 20px 12px 40px;
          box-sizing: border-box;
        }
        #bx-lb-card {
          width: 100%; max-width: 480px;
          background: linear-gradient(145deg, #0d0d1a, #1a1040);
          border: 1px solid rgba(168,85,247,0.35);
          border-radius: 18px;
          padding: 24px 20px;
        }
        #bx-lb-title {
          text-align: center;
          font-size: 26px; font-weight: 900;
          color: #fff; letter-spacing: 2px;
          margin-bottom: 4px;
        }
        #bx-lb-sub {
          text-align: center; font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 3px; text-transform: uppercase;
          margin-bottom: 18px;
        }
        .bx-lb-filters {
          display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .bx-lb-btn {
          flex: 1; padding: 8px 6px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px; color: rgba(255,255,255,0.55);
          font-family: inherit; font-size: 11px;
          font-weight: 700; letter-spacing: 1px;
          cursor: pointer; transition: all 0.15s;
          text-transform: uppercase;
        }
        .bx-lb-btn.active {
          background: rgba(168,85,247,0.2);
          border-color: #a855f7; color: #d8b4fe;
        }
        #bx-lb-table {
          width: 100%; border-collapse: collapse;
          font-size: 13px;
        }
        #bx-lb-table th {
          padding: 8px 6px; text-align: left;
          font-size: 10px; letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        #bx-lb-table td {
          padding: 10px 6px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.85);
        }
        .bx-lb-row-mine td { background: rgba(168,85,247,0.12); color: #d8b4fe; }
        .bx-lb-rank { text-align: center; font-size: 15px; }
        .bx-lb-time { text-align: right; color: rgba(255,255,255,0.55); font-size: 12px; }
        #bx-lb-loading {
          text-align: center; padding: 30px;
          color: rgba(255,255,255,0.4); font-size: 13px;
        }
        #bx-play-again {
          width: 100%; margin-top: 18px; padding: 15px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border: none; border-radius: 12px;
          color: white; font-family: inherit;
          font-size: 18px; font-weight: 900;
          letter-spacing: 2px; cursor: pointer;
          transition: transform 0.15s;
        }
        #bx-play-again:hover { transform: scale(1.03); }
        #bx-play-again:active { transform: scale(0.97); }
      </style>
      <div id="bx-lb-card">
        <div id="bx-lb-title">🏆 LEADERBOARD</div>
        <div id="bx-lb-sub">Parking Jam</div>
        <div class="bx-lb-filters" id="bx-board-tabs">
          <button class="bx-lb-btn" data-board="speedrun">⏱ Speedrun</button>
          <button class="bx-lb-btn active" data-board="score">🪙 Score</button>
        </div>
        <div class="bx-lb-filters" id="bx-period-tabs">
          <button class="bx-lb-btn active" data-period="alltime">All Time</button>
          <button class="bx-lb-btn" data-period="weekly">This Week</button>
          <button class="bx-lb-btn" data-period="daily">Today</button>
        </div>
        <div id="bx-lb-loading">Loading...</div>
        <table id="bx-lb-table" style="display:none">
          <thead>
            <tr>
              <th style="text-align:center">#</th>
              <th>Player</th>
              <th style="text-align:right">Time</th>
            </tr>
          </thead>
          <tbody id="bx-lb-body"></tbody>
        </table>
        <button id="bx-play-again">↺ PLAY AGAIN</button>
      </div>
    `;

    var container = document.body;
    container.appendChild(overlay);

    // Board + period tabs
    var period = 'alltime';
    var board  = 'score';

    overlay.querySelectorAll('.bx-lb-btn[data-board]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        overlay.querySelectorAll('.bx-lb-btn[data-board]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        board = btn.dataset.board;
        loadLeaderboard(period, board);
      });
    });

    overlay.querySelectorAll('.bx-lb-btn[data-period]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        overlay.querySelectorAll('.bx-lb-btn[data-period]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        period = btn.dataset.period;
        loadLeaderboard(period, board);
      });
    });

    // Play again
    overlay.querySelector('#bx-play-again').addEventListener('click', function() {
      overlay.remove();
      try {
        var g = window.gdjs && window.gdjs.__currentGame;
        if (g) {
          g.getSceneStack().getCurrentScene().getVariables().getFromIndex(0).setBoolean(false);
          gdjs.evtTools.runtimeScene.replaceScene(
            g.getSceneStack().getCurrentScene(), 'Title Screen', false
          );
        }
      } catch(e) {}
    });

    // Load leaderboard data
    function loadLeaderboard(p, b) {
      b = b || 'speedrun';
      var loading = overlay.querySelector('#bx-lb-loading');
      var table = overlay.querySelector('#bx-lb-table');
      var tbody = overlay.querySelector('#bx-lb-body');
      loading.style.display = 'block';
      loading.textContent = 'Loading...';
      table.style.display = 'none';

      var url = '/api/leaderboard?game=parking-jam&board=' + b + '&period=' + p + '&limit=50';
      fetch(url).then(function(r) { return r.json(); }).then(function(data) {
        loading.style.display = 'none';
        table.style.display = 'table';
        tbody.innerHTML = '';
        var entries = data.entries || [];
        if (entries.length === 0) {
          loading.style.display = 'block';
          loading.textContent = 'No entries yet';
          table.style.display = 'none';
          return;
        }
        entries.forEach(function(e, i) {
          var isMe = (e.player_name || '').toLowerCase() === (playerName || _playerName || '').toLowerCase();
          var tr = document.createElement('tr');
          if (isMe) tr.className = 'bx-lb-row-mine';
          var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
          var val = b === 'speedrun'
            ? (e.speedrun_time_ms ? (e.speedrun_time_ms / 1000).toFixed(2) + 's' : '—')
            : (e.score || 0) + ' pts';
          tr.innerHTML = '<td class="bx-lb-rank">' + medal + '</td>' +
            '<td>' + (isMe ? '⭐ ' : '') + (e.player_name || '?') + '</td>' +
            '<td class="bx-lb-time">' + val + '</td>';
          tbody.appendChild(tr);
        });
      }).catch(function() {
        loading.style.display = 'block';
        loading.textContent = 'Could not load leaderboard.';
        table.style.display = 'none';
      });
    }

    loadLeaderboard('alltime', 'score');
  }

  // ── 8. Watch for level completion → ad ───────────────────────────────────
  setInterval(function() {
    try {
      var g = window.gdjs && window.gdjs.__currentGame;
      if (!g) return;
      var scene = g.getSceneStack().getCurrentScene();
      if (!scene || scene.getName() !== 'Leaderboard') return;
      var v = getGameVars();
      if (!v) return;
      var lvl = Math.round(v.currentLevel);
      if (lvl >= 2 && lvl !== lastAdLevel) {
        lastAdLevel = lvl;
        requestAd('interstitial');
      }
    } catch(e) {}
  }, 1000);

  // ── Expose to code2.js ────────────────────────────────────────────────────
  window.__battlex = {
    sendScore:       sendScore,
    showLeaderboard: showLeaderboard,
    getGameVars:     getGameVars,
    requestAd:       requestAd,
  };

})();
