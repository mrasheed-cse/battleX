/**
 * Parking Jam Leaderboard Page
 * Route: /games/parking-jam/leaderboard
 *
 * Shows Speedrun and Score leaderboards from Supabase.
 * Receives scores from the game iframe via postMessage.
 */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './ParkingJamLeaderboard.module.css'

const API_BASE = '/api/leaderboard?game=parking-jam'
const PERIODS  = [
  { value: 'alltime', label: '🏆 All Time' },
  { value: 'weekly',  label: '📅 This Week' },
  { value: 'daily',   label: '⚡ Today' },
]

export default function ParkingJamLeaderboard() {
  const [board,   setBoard]   = useState('speedrun')  // 'speedrun' | 'score'
  const [period,  setPeriod]  = useState('alltime')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [newScore, setNewScore] = useState(null)  // highlight newly submitted score

  // ── Listen for score submission from game iframe ──────────────────────────
  useEffect(() => {
    const handler = async (event) => {
      if (event.data?.type !== 'PARKING_JAM_SCORE') return

      const { playerName, speedrunTime, score, level, speedrunEnabled } = event.data

      try {
        const res = await fetch('/api/leaderboard', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game: 'parking-jam',
            playerName,
            speedrunTime,
            score,
            level,
            speedrunEnabled,
          }),
        })
        const data = await res.json()
        if (data.success) {
          setNewScore({ playerName, rank: data.rank, timeMs: data.timeMs, score: data.score })
          fetchLeaderboard()  // refresh the board
        }
      } catch (err) {
        console.error('Score submission failed:', err)
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // ── Fetch leaderboard data ────────────────────────────────────────────────
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`${API_BASE}&board=${board}&period=${period}&limit=100`)
      const data = await res.json()
      setEntries(data.entries || [])
    } catch {
      setError('Could not load leaderboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [board, period])

  useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

  // ── Format time ───────────────────────────────────────────────────────────
  const formatTime = (ms) => {
    if (!ms) return '—'
    const secs = (ms / 1000).toFixed(2)
    return `${secs}s`
  }

  // ── Medal for top 3 ───────────────────────────────────────────────────────
  const medal = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/games/parking-jam" className={styles.back}>← Back to Game</Link>
        <h1 className={styles.title}>🚗 Parking Jam Leaderboard</h1>
        <p className={styles.subtitle}>Top players across all 4 levels</p>
      </div>

      {/* New score notification */}
      {newScore && (
        <div className={styles.newScore}>
          🎉 Score submitted! <strong>{newScore.playerName}</strong>
          {newScore.rank && ` — Rank #${newScore.rank}`}
          <button onClick={() => setNewScore(null)} className={styles.dismiss}>✕</button>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        {/* Board toggle */}
        <div className={styles.toggle}>
          <button
            className={board === 'speedrun' ? styles.active : ''}
            onClick={() => setBoard('speedrun')}
          >
            ⏱ Speedrun
          </button>
          <button
            className={board === 'score' ? styles.active : ''}
            onClick={() => setBoard('score')}
          >
            🪙 High Score
          </button>
        </div>

        {/* Period filter */}
        <div className={styles.periods}>
          {PERIODS.map(p => (
            <button
              key={p.value}
              className={period === p.value ? styles.active : ''}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button onClick={fetchLeaderboard} className={styles.refresh} title="Refresh">
          🔄
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            Loading scores...
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && entries.length === 0 && (
          <div className={styles.empty}>
            No scores yet for this period.<br />
            <Link to="/games/parking-jam/play">Be the first to play! →</Link>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                {board === 'speedrun' && <th>Time</th>}
                <th>Score</th>
                <th>Level</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr
                  key={e.id}
                  className={`
                    ${e.rank <= 3 ? styles.topThree : ''}
                    ${newScore?.playerName === e.player_name ? styles.highlight : ''}
                  `}
                >
                  <td className={styles.rank}>{medal(e.rank)}</td>
                  <td className={styles.name}>{e.player_name}</td>
                  {board === 'speedrun' && (
                    <td className={styles.time}>{formatTime(e.speedrun_time_ms)}</td>
                  )}
                  <td className={styles.score}>🪙 {e.score}</td>
                  <td className={styles.level}>Lvl {e.level}</td>
                  <td className={styles.date}>
                    {new Date(e.submitted_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <Link to="/games/parking-jam/play" className={styles.playBtn}>
          🎮 Play Now & Claim Your Spot
        </Link>
      </div>
    </div>
  )
}
