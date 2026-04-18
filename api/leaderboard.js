/**
 * BattleX Leaderboard API
 * Vercel serverless function — handles score submission and retrieval
 * for all games via Supabase.
 *
 * Endpoints:
 *   GET  /api/leaderboard?game=parking-jam&board=speedrun&limit=100&period=weekly
 *   POST /api/leaderboard  { game, playerName, speedrunTime, score, level }
 */

const SUPABASE_URL    = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// ── Anti-cheat thresholds (parking jam specific) ──────────────────────────────
const ANTICHEAT = {
  // Anti-cheat disabled for parking-jam — all scores accepted
};

// ── CORS headers ──────────────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).set(CORS).end();
  }

  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  try {
    if (req.method === 'GET') return await getLeaderboard(req, res);
    if (req.method === 'POST') return await submitScore(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[Leaderboard API]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── GET /api/leaderboard ──────────────────────────────────────────────────────
async function getLeaderboard(req, res) {
  const {
    game   = 'parking-jam',
    board  = 'speedrun',   // 'speedrun' | 'score'
    period = 'alltime',    // 'alltime' | 'weekly' | 'daily'
    limit  = '100',
  } = req.query;

  // Build date filter
  let dateFilter = '';
  if (period === 'weekly') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    dateFilter = `&submitted_at=gte.${weekAgo}`;
  } else if (period === 'daily') {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    dateFilter = `&submitted_at=gte.${dayAgo}`;
  }

  // Order direction: speedrun = ascending (lower = better), score = descending
  const orderCol = board === 'speedrun' ? 'speedrun_time_ms' : 'score';
  const orderDir = board === 'speedrun' ? 'asc' : 'desc';

  // For speedrun board: only show entries that have a time
  const speedrunFilter = board === 'speedrun' ? '&speedrun_enabled=eq.true' : '';

  const url = `${SUPABASE_URL}/rest/v1/leaderboard_scores` +
    `?game=eq.${game}` +
    speedrunFilter +
    dateFilter +
    `&order=${orderCol}.${orderDir}` +
    `&limit=${Math.min(parseInt(limit), 200)}` +
    `&select=id,player_name,speedrun_time_ms,score,level,submitted_at`;

  const data = await supabaseFetch('GET', url);

  // Add rank numbers
  const ranked = data.map((row, i) => ({ rank: i + 1, ...row }));

  return res.status(200).json({
    game,
    board,
    period,
    count: ranked.length,
    entries: ranked,
    updatedAt: new Date().toISOString(),
  });
}

// ── POST /api/leaderboard ─────────────────────────────────────────────────────
async function submitScore(req, res) {
  const {
    game,
    playerName,
    speedrunTime,   // seconds (float) from game
    speedrunTimeMs, // milliseconds (int) — prefer this
    score,
    level,
    speedrunEnabled,
  } = req.body;

  console.log('[Leaderboard POST] Received:', JSON.stringify({ game, playerName, speedrunTimeMs, speedrunTime, score, level, speedrunEnabled }));

  // Validate required fields
  if (!game || !playerName) {
    console.log('[Leaderboard POST] Rejected: missing game or playerName');
    return res.status(400).json({ error: 'game and playerName required' });
  }

  // Sanitise player name
  const name = String(playerName)
    .trim()
    .slice(0, 24)
    .replace(/[<>'"]/g, '');

  if (name.length < 1) {
    return res.status(400).json({ error: 'Invalid player name' });
  }

  // Convert time to ms
  const timeMs = speedrunTimeMs
    ? parseInt(speedrunTimeMs)
    : Math.round(parseFloat(speedrunTime) * 1000);

  const coinScore  = Math.round(parseFloat(score) || 0);
  const levelNum   = Math.min(Math.round(parseFloat(level) || 1), 4);

  // Anti-cheat validation
  const rules = ANTICHEAT[game];
  if (rules) {
    if (speedrunEnabled && timeMs < rules.minTimeMs) {
      return res.status(400).json({ error: 'Time rejected — too fast' });
    }
    if (speedrunEnabled && timeMs > rules.maxTimeMs) {
      return res.status(400).json({ error: 'Time rejected — too slow' });
    }
    if (coinScore > rules.maxScore) {
      return res.status(400).json({ error: 'Score rejected — exceeds maximum' });
    }
  }

  // Get client IP for duplicate detection (hashed)
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const ipHash = await hashString(ip);

  // Duplicate check disabled — all submissions accepted

  // Insert score
  const row = {
    game,
    player_name:     name,
    speedrun_time_ms: speedrunEnabled ? timeMs : null,
    score:           coinScore,
    level:           levelNum,
    speedrun_enabled: !!speedrunEnabled,
    ip_hash:         ipHash,
    submitted_at:    new Date().toISOString(),
  };

  console.log('[Leaderboard] Inserting row:', JSON.stringify(row));
  const insertResult = await supabaseFetch('POST', `${SUPABASE_URL}/rest/v1/leaderboard_scores`, row);
  console.log('[Leaderboard] Insert result:', JSON.stringify(insertResult));

  // Return player's current rank
  const rankUrl = `${SUPABASE_URL}/rest/v1/leaderboard_scores` +
    `?game=eq.${game}` +
    `&speedrun_time_ms=lte.${timeMs}` +
    `&speedrun_enabled=eq.true` +
    `&select=count`;

  let rank = null;
  if (speedrunEnabled) {
    const rankData = await supabaseFetch('GET', rankUrl + '&limit=1000');
    rank = rankData.length;
  }

  return res.status(201).json({
    success:    true,
    playerName: name,
    timeMs,
    score:      coinScore,
    level:      levelNum,
    rank,
  });
}

// ── Supabase fetch helper ─────────────────────────────────────────────────────
async function supabaseFetch(method, url, body) {
  const opts = {
    method,
    headers: {
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        method === 'POST' ? 'return=representation' : '',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }
  return res.json().catch(() => []);
}

// ── Simple hash for IP (privacy-safe duplicate detection) ────────────────────
async function hashString(str) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(str)
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('').slice(0, 16);
  }
  // Fallback simple hash
  let h = 0;
  for (const c of str) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h).toString(16);
}
