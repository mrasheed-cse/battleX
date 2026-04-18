/**
 * Table Tennis Leaderboard Page
 * Route: /games/table-tennis/leaderboard
 *
 * Columns: Rank | Player | Opponent | Score | Result | Time Played | Games Played | Date
 * Filters: Period (All Time / This Week / Today) + Opponent Type (All / vs CPU / vs Player)
 */
import { useState, useEffect, useCallback } from 'react'
import { Link }                              from 'react-router-dom'
import styles from './TableTennisLeaderboard.module.css'

const API = '/api/table-tennis-leaderboard'

const PERIODS = [
  { value: 'alltime', label: '🏆 All Time'  },
  { value: 'weekly',  label: '📅 This Week' },
  { value: 'daily',   label: '⚡ Today'     },
]

const OPPONENTS = [
  { value: 'all',    label: '👥 All'        },
  { value: 'cpu',    label: '🤖 vs CPU'     },
  { value: 'online', label: '🌐 vs Player'  },
]

function formatDuration(ms) {
  if (!ms || ms <= 0) return '—'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

export default function TableTennisLeaderboard() {
  const [period,   setPeriod]   = useState('alltime')
  const [opponent, setOpponent] = useState('all')
  const [entries,  setEntries]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = `${API}?period=${period}&opponent=${opponent}&limit=100`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setEntries(json.entries || [])
    } catch (e) {
      setError('Failed to load leaderboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [period, opponent])

  useEffect(() => { fetchData() }, [fetchData])

  // Stats summary
  const totalGames = entries.length
  const totalWins  = entries.filter(e => e.won).length
  const totalTime  = entries.reduce((a, e) => a + (e.duration_ms || 0), 0)

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link to="/games" className={styles.breadLink}>Games</Link>
            <span className={styles.breadSep}>›</span>
            <Link to="/games/table-tennis" className={styles.breadLink}>Table Tennis</Link>
            <span className={styles.breadSep}>›</span>
            <span>Leaderboard</span>
          </div>
          <h1 className={styles.title}>🏓 Table Tennis Leaderboard</h1>
          <p className={styles.subtitle}>Track your matches, time played and rankings</p>
        </div>
      </div>

      <div className="container">

        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{totalGames}</span>
            <span className={styles.statLabel}>Total Matches</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{totalWins}</span>
            <span className={styles.statLabel}>Wins</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{formatDuration(totalTime)}</span>
            <span className={styles.statLabel}>Time Played</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>
              {totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0}%
            </span>
            <span className={styles.statLabel}>Win Rate</span>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Period</span>
            <div className={styles.filterBtns}>
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  className={`${styles.filterBtn} ${period === p.value ? styles.filterBtnActive : ''}`}
                  onClick={() => setPeriod(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Opponent</span>
            <div className={styles.filterBtns}>
              {OPPONENTS.map(o => (
                <button
                  key={o.value}
                  className={`${styles.filterBtn} ${opponent === o.value ? styles.filterBtnActive : ''}`}
                  onClick={() => setOpponent(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <button className={styles.refreshBtn} onClick={fetchData} disabled={loading}>
            {loading ? '⟳' : '↺'} Refresh
          </button>
        </div>

        {/* Table */}
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <span>Loading matches...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🏓</div>
            <div className={styles.emptyTitle}>No matches yet</div>
            <div className={styles.emptyText}>Play Table Tennis to appear on the leaderboard!</div>
            <Link to="/games/table-tennis/play" className="btn btn-primary">Play Now</Link>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thRank}>#</th>
                  <th className={styles.thPlayer}>Player</th>
                  <th className={styles.thOpponent}>Opponent</th>
                  <th className={styles.thScore}>Score</th>
                  <th className={styles.thResult}>Result</th>
                  <th className={styles.thTime}>Time Played</th>
                  <th className={styles.thGames}>Games</th>
                  <th className={styles.thDate}>Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.id} className={`${styles.row} ${e.won ? styles.rowWin : styles.rowLoss}`}>
                    <td className={styles.tdRank}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </td>
                    <td className={styles.tdPlayer}>
                      <span className={styles.playerName}>{e.player_name}</span>
                    </td>
                    <td className={styles.tdOpponent}>
                      <span className={styles.opponentBadge}
                        data-type={e.opponent_type}>
                        {e.opponent_type === 'cpu' ? '🤖' : '🌐'} {e.opponent_name}
                      </span>
                    </td>
                    <td className={styles.tdScore}>
                      <span className={styles.scoreVal}>
                        <span className={styles.scoreP}>{e.player_score}</span>
                        <span className={styles.scoreSep}>—</span>
                        <span className={styles.scoreA}>{e.opponent_score}</span>
                      </span>
                    </td>
                    <td className={styles.tdResult}>
                      <span className={`${styles.resultBadge} ${e.won ? styles.win : styles.loss}`}>
                        {e.won ? '✅ Win' : '❌ Loss'}
                      </span>
                    </td>
                    <td className={styles.tdTime}>{formatDuration(e.duration_ms)}</td>
                    <td className={styles.tdGames}>{e.times_played}</td>
                    <td className={styles.tdDate}>{formatDate(e.submitted_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Play button */}
        <div className={styles.playWrap}>
          <Link to="/games/table-tennis/play" className="btn btn-primary btn-lg">
            🏓 Play Table Tennis
          </Link>
          <Link to="/games/table-tennis" className="btn btn-ghost btn-lg">
            ← Game Info
          </Link>
        </div>

      </div>
    </div>
  )
}
