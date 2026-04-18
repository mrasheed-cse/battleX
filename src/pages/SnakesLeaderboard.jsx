/**
 * Snakes & Ladders Leaderboard
 * Route: /games/snakes-and-ladders/leaderboard
 *
 * Details view : Match ID, player positions, name, score, time
 * Summary view : Player name, games played, total score, total time, total points
 */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './SnakesLeaderboard.module.css'

const API = '/api/snl-leaderboard'

const PERIODS = [
  { value: 'alltime', label: '🏆 All Time'  },
  { value: 'weekly',  label: '📅 This Week' },
  { value: 'daily',   label: '⚡ Today'     },
]

const POSITION_POINTS = { 1:100, 2:90, 3:80, 4:70, 5:60, 6:50 }
const POSITION_MEDAL  = { 1:'🥇', 2:'🥈', 3:'🥉' }
const POSITION_LABEL  = { 1:'1st', 2:'2nd', 3:'3rd', 4:'4th', 5:'5th', 6:'6th' }

function fmtTime(ms) {
  if (!ms || ms <= 0) return '—'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h > 0)  return `${h}h ${m % 60}m`
  if (m > 0)  return `${m}m ${s % 60}s`
  return `${s}s`
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'2-digit' })
}

function shortId(id) {
  return id ? id.slice(0, 8).toUpperCase() : '—'
}

// ── Details view ──────────────────────────────────────────────────────────────
function DetailsView({ entries }) {
  // Group by match_id
  const matches = {}
  entries.forEach(e => {
    const mid = e.match_id || 'unknown'
    if (!matches[mid]) matches[mid] = {
      matchId:    mid,
      matchCode:  e.snl_matches?.match_code || mid.slice(0,8),
      playedAt:   e.snl_matches?.played_at  || e.submitted_at,
      players:    []
    }
    matches[mid].players.push(e)
  })

  const matchList = Object.values(matches)
    .sort((a,b) => new Date(b.playedAt) - new Date(a.playedAt))

  if (matchList.length === 0)
    return <div className={styles.empty}><div className={styles.emptyIcon}>🐍</div><div className={styles.emptyTitle}>No matches yet</div></div>

  return (
    <div className={styles.matchList}>
      {matchList.map(m => (
        <div key={m.matchId} className={styles.matchCard}>
          <div className={styles.matchHeader}>
            <div className={styles.matchId}>
              <span className={styles.matchIdLabel}>Match</span>
              <span className={styles.matchIdCode}>{shortId(m.matchId)}</span>
            </div>
            <div className={styles.matchMeta}>
              <span>{m.players.length} players</span>
              <span className={styles.matchDate}>{fmtDate(m.playedAt)}</span>
            </div>
          </div>
          <table className={styles.matchTable}>
            <thead>
              <tr>
                <th>Position</th>
                <th>Player</th>
                <th>Score</th>
                <th>Points</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {m.players
                .sort((a,b) => a.position - b.position)
                .map(p => (
                <tr key={p.id} className={p.position === 1 ? styles.winnerRow : ''}>
                  <td>
                    <span className={styles.positionBadge} data-pos={p.position}>
                      {POSITION_MEDAL[p.position] || ''} {POSITION_LABEL[p.position] || p.position}
                    </span>
                  </td>
                  <td className={styles.playerName}>{p.player_name}</td>
                  <td className={styles.scoreVal}>{p.score}</td>
                  <td>
                    <span className={styles.pointsBadge}>{POSITION_POINTS[p.position] || 50} pts</span>
                  </td>
                  <td className={styles.timeVal}>{fmtTime(p.duration_ms)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

// ── Summary view ──────────────────────────────────────────────────────────────
function SummaryView({ entries }) {
  if (entries.length === 0)
    return <div className={styles.empty}><div className={styles.emptyIcon}>🐍</div><div className={styles.emptyTitle}>No data yet</div></div>

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thRank}>#</th>
            <th>Player</th>
            <th className={styles.thCenter}>Games</th>
            <th className={styles.thCenter}>Total Score</th>
            <th className={styles.thCenter}>Total Time</th>
            <th className={styles.thCenter}>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.player_name} className={styles.row}>
              <td className={styles.tdRank}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </td>
              <td className={styles.tdPlayer}>{e.player_name}</td>
              <td className={styles.tdCenter}>{e.times_played}</td>
              <td className={styles.tdCenter}>{e.total_score}</td>
              <td className={styles.tdCenter}>{fmtTime(e.total_time_ms)}</td>
              <td className={styles.tdCenter}>
                <span className={styles.totalPoints}>{e.total_points}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SnakesLeaderboard() {
  const [view,    setView]    = useState('summary')
  const [period,  setPeriod]  = useState('alltime')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`${API}?view=${view}&period=${period}&limit=100`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setEntries(json.entries || [])
    } catch(e) {
      setError('Failed to load. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [view, period])

  useEffect(() => { fetchData() }, [fetchData])

  // Summary stats
  const totalGames   = view === 'summary' ? entries.reduce((a,e) => a + e.times_played, 0) : entries.length
  const topPlayer    = entries[0]?.player_name || '—'
  const totalPoints  = view === 'summary' ? entries.reduce((a,e) => a + e.total_points, 0) : 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link to="/games" className={styles.breadLink}>Games</Link>
            <span className={styles.breadSep}>›</span>
            <Link to="/games/snakes-and-ladders" className={styles.breadLink}>Snakes & Ladders</Link>
            <span className={styles.breadSep}>›</span>
            <span>Leaderboard</span>
          </div>
          <h1 className={styles.title}>🐍 Snakes & Ladders Leaderboard</h1>
          <p className={styles.subtitle}>Match results, rankings and player stats</p>
        </div>
      </div>

      <div className="container">
        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{totalGames}</span>
            <span className={styles.statLabel}>Total Games</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{entries.length}</span>
            <span className={styles.statLabel}>Players</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{topPlayer}</span>
            <span className={styles.statLabel}>Top Player</span>
          </div>
          {view === 'summary' && (
            <div className={styles.statItem}>
              <span className={styles.statVal}>{totalPoints}</span>
              <span className={styles.statLabel}>Points Earned</span>
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className={styles.controls}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${view === 'summary' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('summary')}
            >📊 Summary</button>
            <button
              className={`${styles.viewBtn} ${view === 'details' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('details')}
            >📋 Match Details</button>
          </div>

          <div className={styles.periodBtns}>
            {PERIODS.map(p => (
              <button
                key={p.value}
                className={`${styles.periodBtn} ${period === p.value ? styles.periodBtnActive : ''}`}
                onClick={() => setPeriod(p.value)}
              >{p.label}</button>
            ))}
          </div>

          <button className={styles.refreshBtn} onClick={fetchData} disabled={loading}>
            {loading ? '⟳' : '↺'} Refresh
          </button>
        </div>

        {/* Points legend */}
        {view === 'summary' && (
          <div className={styles.pointsLegend}>
            {Object.entries(POSITION_POINTS).map(([pos, pts]) => (
              <div key={pos} className={styles.legendItem}>
                <span className={styles.legendPos}>{POSITION_LABEL[pos]}</span>
                <span className={styles.legendPts}>{pts} pts</span>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <span>Loading...</span>
          </div>
        ) : view === 'details' ? (
          <DetailsView entries={entries} />
        ) : (
          <SummaryView entries={entries} />
        )}

        <div className={styles.playWrap}>
          <Link to="/games/snakes-and-ladders/play" className="btn btn-primary btn-lg">🐍 Play Now</Link>
          <Link to="/games/snakes-and-ladders" className="btn btn-ghost btn-lg">← Game Info</Link>
        </div>
      </div>
    </div>
  )
}
