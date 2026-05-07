import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { token, games } from '../services/api'
import styles from './LudoPlay.module.css'

// Points per finishing position
const POINTS_MAP = { 1: 100, 2: 75, 3: 50, 4: 25 }

/**
 * Submit game results to:
 *  1. /api/ludo-leaderboard  (Vercel proxy → leaderboard table)
 *  2. BattleX game results API  (updates player stats / game-history)
 */
async function submitResults({ matchId, results, totalPlayers, authToken, gameId }) {
  const playedAt = new Date().toISOString()

  // ── 1. Ludo leaderboard (no auth required, but forward token if available) ──
  try {
    const headers = { 'Content-Type': 'application/json' }
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`

    const lbRes = await fetch('/api/ludo-leaderboard', {
      method: 'POST',
      headers,
      body: JSON.stringify({ matchId, results, totalPlayers }),
    })
    const lbJson = await lbRes.json().catch(() => ({}))
    console.log('[LudoPlay] Leaderboard saved:', lbJson)
  } catch (err) {
    console.warn('[LudoPlay] Leaderboard post failed:', err.message)
  }

  // ── 2. BattleX game-history (requires auth) ───────────────────────────────
  if (!authToken) {
    console.log('[LudoPlay] No auth token — skipping BattleX stats update')
    return
  }

  if (!gameId) {
    console.log('[LudoPlay] No BattleX gameId — skipping game results API')
    return
  }

  try {
    const bxResults = results.map((r) => ({
      playerId: r.playerId || null,
      playerName: r.playerName,
      position: r.position,
      score: POINTS_MAP[r.position] || 10,
      pointsEarned: POINTS_MAP[r.position] || 10,
      outcome: r.position === 1 ? 'Win' : 'Loss',
      gameType: 'Ludo',
      durationMs: r.durationMs || 0,
      playedAt,
    }))

    await games.submitResult(gameId, { results: bxResults, completedAt: playedAt })
    console.log('[LudoPlay] BattleX game results submitted')
  } catch (err) {
    console.warn('[LudoPlay] BattleX results post failed:', err.message)
  }
}

export default function LudoPlay() {
  const { user } = useAuth()
  const submittedRef = useRef(false)

  const handleMessage = useCallback(async (event) => {
    // Only handle messages from the same origin (our ludo iframe)
    if (event.origin !== window.location.origin) return

    const data = event.data
    if (!data || data.type !== 'LUDO_GAME_OVER') return
    if (submittedRef.current) return
    submittedRef.current = true

    console.log('[LudoPlay] Game over received:', data)

    const { matchId, results, totalPlayers, gameId } = data

    if (!matchId || !Array.isArray(results) || results.length === 0) {
      console.warn('[LudoPlay] Invalid game-over payload')
      return
    }

    await submitResults({
      matchId,
      results,
      totalPlayers: totalPlayers || results.length,
      authToken: token.get(),
      gameId: gameId || null,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // Reset on each mount so replay works
  useEffect(() => {
    submittedRef.current = false
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <Link to="/games/ludo" className={styles.backBtn}>← Back</Link>
        <div className={styles.gameInfo}>
          <span className={styles.gameIcon}>🎲</span>
          <span className={styles.gameName}>Ludo</span>
          <span className={styles.badge}>Board</span>
          <span className={styles.badge}>⭐ 4.8</span>
          <span className={styles.badgeFree}>FREE</span>
        </div>
        <div className={styles.spacer} />
        {user && (
          <span className={styles.badge} style={{ color: '#10b981' }}>
            🟢 {user.displayName || user.username}
          </span>
        )}
      </div>
      <iframe
        src="/games/ludo/index.html"
        className={styles.gameFrame}
        title="Ludo"
        allow="fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  )
}
