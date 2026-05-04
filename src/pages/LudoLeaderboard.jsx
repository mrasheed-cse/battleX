import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './LudoLeaderboard.module.css'

const API = '/api/ludo-leaderboard'

const PERIODS = [
  { value:'alltime', label:'All Time'  },
  { value:'weekly',  label:'This Week' },
  { value:'daily',   label:'Today'     },
]
const POS_MEDAL  = { 1:'🥇', 2:'🥈', 3:'🥉', 4:'4th' }
const POS_LABEL  = { 1:'1st Place', 2:'2nd Place', 3:'3rd Place', 4:'4th Place' }
const POS_SHORT  = { 1:'1st', 2:'2nd', 3:'3rd', 4:'4th' }
const POS_PTS    = { 1:100, 2:75, 3:50, 4:25 }
const COL_HEX    = { red:'#e53935', blue:'#1e88e5', green:'#43a047', yellow:'#f9a825' }
const COL_BG     = { red:'rgba(229,57,53,0.15)', blue:'rgba(30,136,229,0.15)', green:'rgba(67,160,71,0.15)', yellow:'rgba(249,168,37,0.15)' }

const fmtMs = ms => {
  if (!ms || ms <= 0) return '—'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

const fmtDateTime = iso => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })
    + ' · ' + d.toLocaleTimeString('en-US',{ hour:'2-digit', minute:'2-digit' })
}

const fmtDateShort = iso =>
  iso ? new Date(iso).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'2-digit' }) : '—'

const shortId = id => id ? id.slice(-8).toUpperCase() : '—'

// ─────────────────────────────────────────────────────────────────────────────
// Match Detail Modal
// ─────────────────────────────────────────────────────────────────────────────
function MatchModal({ match, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const winner = match.players.find(p => p.position === 1)

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <span className={styles.modalMatchId}>Match #{shortId(match.match_id)}</span>
            <button className={styles.modalClose} onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalMeta}>
            <span>🕐 {fmtDateTime(match.played_at)}</span>
            <span>👥 {match.players.length} Players</span>
            {match.duration_ms > 0 && <span>⏱ Total: {fmtMs(match.duration_ms)}</span>}
          </div>
        </div>

        {/* Winner banner */}
        {winner && (
          <div className={styles.winnerBanner} style={{ borderColor: COL_HEX[winner.color] || '#ffd700' }}>
            <span className={styles.winnerCrown}>👑</span>
            <div>
              <div className={styles.winnerName}>{winner.player_name}</div>
              <div className={styles.winnerSub}>Winner · {fmtMs(winner.duration_ms)}</div>
            </div>
            <div className={styles.winnerPts}>{winner.points || 100} pts</div>
          </div>
        )}

        {/* Players table */}
        <div className={styles.modalTableWrap}>
          <table className={styles.modalTable}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Color</th>
                <th>Time to Finish</th>
                <th>Points Earned</th>
                <th>Match ID</th>
              </tr>
            </thead>
            <tbody>
              {match.players.map(p => (
                <tr key={p.id} className={p.position === 1 ? styles.modalWinRow : ''}>
                  <td>
                    <div className={styles.rankCell}>
                      <span className={styles.rankMedal}>
                        {p.position <= 3 ? POS_MEDAL[p.position] : ''}
                      </span>
                      <span className={styles.rankText}>{POS_SHORT[p.position] || p.position}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.modalPlayerName}>{p.player_name}</span>
                  </td>
                  <td>
                    <span className={styles.colorPill}
                      style={{ background: COL_BG[p.color]||'rgba(255,255,255,0.1)', borderColor: COL_HEX[p.color]||'#888' }}>
                      <span className={styles.colorDot} style={{ background: COL_HEX[p.color]||'#888' }}/>
                      {p.color || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={styles.timeCell}>{fmtMs(p.duration_ms)}</span>
                  </td>
                  <td>
                    <span className={styles.ptsCell}
                      style={{ color: p.position===1?'#ffd700':p.position===2?'#c0c0c0':p.position===3?'#cd7f32':'#90caf9' }}>
                      +{p.points || POS_PTS[p.position] || 10}
                    </span>
                  </td>
                  <td>
                    <span className={styles.matchIdSmall}>{shortId(p.match_id)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Podium visual */}
        <div className={styles.podium}>
          {[2,1,3].map(pos => {
            const p = match.players.find(pl => pl.position === pos)
            if (!p) return null
            return (
              <div key={pos} className={`${styles.podiumSlot} ${styles['podiumPos'+pos]}`}>
                <div className={styles.podiumName}>{p.player_name}</div>
                <div className={styles.podiumBlock}
                  style={{ background: COL_HEX[p.color]||'#555' }}>
                  <span className={styles.podiumMedal}>{POS_MEDAL[pos]}</span>
                  <span className={styles.podiumTime}>{fmtMs(p.duration_ms)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Match Row (in list)
// ─────────────────────────────────────────────────────────────────────────────
function MatchRow({ match, highlight, onSelect }) {
  const winner = match.players.find(p => p.position === 1)
  const isHighlighted = highlight && match.players.some(p =>
    p.player_name.toLowerCase().includes(highlight.toLowerCase())
  )

  return (
    <div className={`${styles.matchRow} ${isHighlighted ? styles.matchRowHL : ''}`}
      onClick={() => onSelect(match)}>

      <div className={styles.mrLeft}>
        <span className={styles.mrMatchId}>#{shortId(match.match_id)}</span>
        <div className={styles.mrPlayers}>
          {match.players.map(p => (
            <span key={p.id} className={styles.mrPlayerChip}
              style={{
                background: COL_BG[p.color]||'rgba(255,255,255,0.07)',
                borderColor: COL_HEX[p.color]||'rgba(255,255,255,0.15)',
                fontWeight: p.position===1 ? 800 : 500,
              }}>
              {p.position <= 3
                ? <span className={styles.mrMedal}>{POS_MEDAL[p.position]}</span>
                : <span className={styles.mrPos}>4</span>
              }
              {p.player_name}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.mrRight}>
        {winner && (
          <div className={styles.mrWinner}>
            <span className={styles.mrWinnerLabel}>Winner</span>
            <span className={styles.mrWinnerName}>{winner.player_name}</span>
          </div>
        )}
        {match.duration_ms > 0 && (
          <span className={styles.mrDur}>⏱ {fmtMs(match.duration_ms)}</span>
        )}
        <span className={styles.mrDate}>{fmtDateShort(match.played_at)}</span>
        <span className={styles.mrArrow}>→</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Rankings Table
// ─────────────────────────────────────────────────────────────────────────────
function RankingsTable({ rankings, highlight }) {
  if (!rankings.length)
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🎲</div>
        <p className={styles.emptyTitle}>No rankings yet</p>
        <p className={styles.emptySub}>Play some games to appear here!</p>
      </div>
    )

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th className={styles.tc}>Matches</th>
            <th className={styles.tc}>Wins</th>
            <th className={styles.tc}>Win %</th>
            <th className={styles.tc}>Podiums</th>
            <th className={styles.tc}>Best</th>
            <th className={styles.tc}>Avg Time</th>
            <th className={styles.tc}>Points</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((r, i) => {
            const isHL = highlight && r.player_name.toLowerCase().includes(highlight.toLowerCase())
            return (
              <tr key={r.player_name}
                className={`${styles.trow} ${isHL ? styles.hlRow : ''} ${i < 3 ? styles.topRow : ''}`}>
                <td className={styles.tdRank}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className={styles.rankNum}>{i+1}</span>}
                </td>
                <td className={styles.tdName}>
                  <span className={styles.playerNameText}>{r.player_name}</span>
                  {isHL && <span className={styles.youBadge}>● Match</span>}
                </td>
                <td className={styles.tc}>{r.matches}</td>
                <td className={styles.tc}><span className={styles.winVal}>{r.wins}</span></td>
                <td className={styles.tc}>
                  <div className={styles.winBar}>
                    <div className={styles.winBarFill} style={{ width:`${r.win_rate}%` }}/>
                    <span className={styles.winBarText}>{r.win_rate}%</span>
                  </div>
                </td>
                <td className={styles.tc}>{r.podiums}</td>
                <td className={styles.tc}>
                  <span className={styles.bestPos}>{POS_SHORT[r.best_position] || r.best_position}</span>
                </td>
                <td className={styles.tc}><span className={styles.timeVal}>{fmtMs(r.avg_time_ms)}</span></td>
                <td className={styles.tc}>
                  <span className={styles.ptsBadge}>{r.total_points}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function LudoLeaderboard() {
  const [view,       setView]       = useState('matches')
  const [period,     setPeriod]     = useState('alltime')
  const [search,     setSearch]     = useState('')
  const [query,      setQuery]      = useState('')
  const [matches,    setMatches]    = useState([])
  const [rankings,   setRankings]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [selected,   setSelected]   = useState(null)
  const debounceRef = useRef(null)

  const handleSearch = e => {
    const v = e.target.value
    setSearch(v)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setQuery(v.trim()), 400)
  }

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      // Always fetch both views at once
      const [mRes, rRes] = await Promise.all([
        fetch(`${API}?view=matches&period=${period}&limit=100${query ? `&search=${encodeURIComponent(query)}` : ''}`),
        fetch(`${API}?view=rankings&period=${period}&limit=100${query ? `&search=${encodeURIComponent(query)}` : ''}`),
      ])
      if (!mRes.ok || !rRes.ok) throw new Error('Fetch failed')
      const [mJson, rJson] = await Promise.all([mRes.json(), rRes.json()])
      setMatches(mJson.matches   || [])
      setRankings(rJson.rankings || [])
    } catch(e) {
      setError('Failed to load. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [period, query])

  useEffect(() => { fetchData() }, [fetchData])

  const totalGames   = matches.length
  const totalPlayers = rankings.length
  const topPlayer    = rankings[0]?.player_name || '—'
  const topPoints    = rankings[0]?.total_points || 0

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link to="/games" className={styles.breadLink}>Games</Link>
            <span className={styles.sep}>›</span>
            <Link to="/games/ludo" className={styles.breadLink}>Ludo</Link>
            <span className={styles.sep}>›</span>
            <span>Leaderboard</span>
          </div>
          <div className={styles.heroRow}>
            <div className={styles.heroIcon}>🎲</div>
            <div>
              <h1 className={styles.heroTitle}>Ludo Leaderboard</h1>
              <p className={styles.heroSub}>Match history, player rankings &amp; detailed stats</p>
            </div>
            <Link to="/games/ludo/play" className={styles.playNowBtn}>▶ Play Now</Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* ── Stats ── */}
        <div className={styles.statsGrid}>
          {[
            { icon:'🎮', val: totalGames,   label:'Total Matches' },
            { icon:'👥', val: totalPlayers, label:'Players'       },
            { icon:'🏆', val: topPlayer,    label:'Top Player'    },
            { icon:'⭐', val: topPoints,    label:'Top Points'    },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search player name..."
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <button className={styles.clearBtn}
              onClick={() => { setSearch(''); setQuery('') }}>✕</button>
          )}
        </div>
        {query && !loading && (
          <div className={styles.searchHint}>
            Showing results for <strong>"{query}"</strong>
            {view === 'matches'
              ? ` — ${matches.length} match${matches.length !== 1 ? 'es' : ''}`
              : ` — ${rankings.length} player${rankings.length !== 1 ? 's' : ''}`
            }
          </div>
        )}

        {/* ── Tabs + Period ── */}
        <div className={styles.toolbar}>
          <div className={styles.tabGroup}>
            {[
              { v:'matches',  icon:'📋', label:'Match History' },
              { v:'rankings', icon:'📊', label:'Rankings'      },
            ].map(t => (
              <button key={t.v}
                className={`${styles.tab} ${view===t.v?styles.tabActive:''}`}
                onClick={() => setView(t.v)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className={styles.rightControls}>
            <div className={styles.periodGroup}>
              {PERIODS.map(p => (
                <button key={p.value}
                  className={`${styles.periodBtn} ${period===p.value?styles.periodActive:''}`}
                  onClick={() => setPeriod(p.value)}>
                  {p.label}
                </button>
              ))}
            </div>
            <button className={styles.refreshBtn} onClick={fetchData} disabled={loading}>
              <span style={{display:'inline-block',animation:loading?'spin 0.8s linear infinite':'none'}}>↺</span>
            </button>
          </div>
        </div>

        {/* ── Points key ── */}
        {view === 'rankings' && (
          <div className={styles.ptsKey}>
            <span className={styles.ptsKeyLabel}>Points system:</span>
            {Object.entries(POS_PTS).map(([pos, pts]) => (
              <span key={pos} className={styles.ptsKeyItem}>
                {POS_MEDAL[pos]} {pts} pts
              </span>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {error ? (
          <div className={styles.errorBox}>⚠ {error} <button onClick={fetchData}>Retry</button></div>
        ) : loading ? (
          <div className={styles.loadWrap}>
            <div className={styles.spinner}/>
            <span>Loading data...</span>
          </div>
        ) : view === 'matches' ? (
          matches.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🎲</div>
              <p className={styles.emptyTitle}>No matches found</p>
              <p className={styles.emptySub}>{query ? 'Try a different search.' : 'Play a game to see history here!'}</p>
            </div>
          ) : (
            <div className={styles.matchList}>
              <div className={styles.matchListHeader}>
                <span>{matches.length} match{matches.length!==1?'es':''}</span>
                <span className={styles.clickHint}>Click any match for details</span>
              </div>
              {matches.map(m => (
                <MatchRow key={m.match_id} match={m} highlight={query} onSelect={setSelected} />
              ))}
            </div>
          )
        ) : (
          <RankingsTable rankings={rankings} highlight={query} />
        )}

        {/* ── CTA ── */}
        <div className={styles.cta}>
          <Link to="/games/ludo/play" className="btn btn-primary btn-lg">🎲 Play Now</Link>
          <Link to="/games/ludo" className="btn btn-ghost btn-lg">← Game Info</Link>
        </div>
      </div>

      {/* ── Match Detail Modal ── */}
      {selected && <MatchModal match={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
