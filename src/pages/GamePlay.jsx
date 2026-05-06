import { recordGameResults } from '../services/api'
/**
 * BattleX GamePlay Page
 * Renders the game iframe and handles:
 *  - AdMob ads on Android (native plugin)
 *  - AdSense ads on web (overlay system)
 *  - Score submission to Supabase
 *  - Leaderboard link
 *  - Fullscreen toggle
 */
import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { GAMES } from '../data'
import styles from './GamePlay.module.css'
import adManager, {
  ADMOB_ENABLED,
  ADSENSE_ENABLED,
  ADMOB,
  ADSENSE,
  RULES as AD_RULES,
  isNativeApp,
  getAdPlatform,
  loadAdSenseScript,
  pushAdSenseSlot,
  showBanner,
  hideBanner,
  showInterstitial,
} from '../services/adManager'

// ─── Web AdSense interstitial overlay ────────────────────────────────────────
// Only rendered on web — AdMob handles Android natively
function WebAdOverlay({ slug, onClose }) {
  const [countdown, setCountdown] = useState(AD_RULES.skipSeconds)
  const slotId = ADSENSE.UNITS[slug]?.interstitial

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  useEffect(() => { pushAdSenseSlot() }, [])

  return (
    <div className={styles.interstitialOverlay}>
      <div className={styles.interstitialCard}>

        <div className={styles.interstitialHeader}>
          <span className={styles.interstitialLabel}>Advertisement</span>
          {countdown > 0
            ? <span className={styles.interstitialCountdown}>Skip in {countdown}s</span>
            : <button className={styles.interstitialSkip} onClick={onClose}>✕ Skip Ad</button>
          }
        </div>

        {ADSENSE_ENABLED && slotId ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: 280 }}
            data-ad-client={ADSENSE.PUBLISHER_ID}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className={styles.adPlaceholder}>
            <div className={styles.adPlaceholderIcon}>📢</div>
            <div className={styles.adPlaceholderText}>Advertisement</div>
            <div className={styles.adPlaceholderSub}>
              {isNativeApp()
                ? 'AdMob ad will appear here after setup'
                : 'AdSense ad will appear here after account approval'}
            </div>
          </div>
        )}

        <div className={styles.interstitialFooter}>
          <span>Ads keep BattleX free 🎮</span>
          {countdown === 0 && (
            <button className={styles.continueBtn} onClick={onClose}>Continue →</button>
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Web AdSense banner (below game iframe) ───────────────────────────────────
function WebBannerAd({ slug }) {
  const slotId = ADSENSE.UNITS[slug]?.banner
  useEffect(() => { pushAdSenseSlot() }, [])

  if (!ADSENSE_ENABLED || !slotId || isNativeApp()) return null

  return (
    <div className={styles.bannerAd}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE.PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ─── Score notification ───────────────────────────────────────────────────────
function ScoreNotification({ data, gameSlug, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 8000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={styles.scoreNotif}>
      <div className={styles.scoreNotifInner}>
        <span className={styles.scoreNotifIcon}>🏆</span>
        <div className={styles.scoreNotifContent}>
          <div className={styles.scoreNotifTitle}>Score Submitted!</div>
          <div className={styles.scoreNotifBody}>
            <strong>{data.playerName}</strong>
            {data.score   != null && ` · 🪙 ${data.score}`}
            {data.speedrunTime    && ` · ⏱ ${(data.speedrunTime / 1000).toFixed(1)}s`}
            {data.rank            && ` · Rank #${data.rank}`}
          </div>
        </div>
        <div className={styles.scoreNotifActions}>
          <Link to={`/games/${gameSlug}/leaderboard`} className={styles.scoreNotifBtn}>
            View Board
          </Link>
          <button onClick={onDismiss} className={styles.scoreNotifClose}>✕</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GamePlay() {
  const { slug } = useParams()
  const navigate  = useNavigate()
  const game      = GAMES.find(g => g.slug === slug)
  const iframeRef = useRef(null)

  const [loaded,     setLoaded]     = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showWebAd,  setShowWebAd]  = useState(false)   // web overlay only
  const [scoreNotif, setScoreNotif] = useState(null)

  const lastAdTime  = useRef(0)
  const platform    = getAdPlatform()   // 'admob' | 'adsense' | 'none'

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // ── Load AdSense script on web ────────────────────────────────────────────
  useEffect(() => { loadAdSenseScript() }, [])

  // ── Show native AdMob banner on Android when game loads ───────────────────
  useEffect(() => {
    if (loaded && isNativeApp() && ADMOB_ENABLED && game?.slug) {
      showBanner(game.slug)
    }
    return () => {
      // Hide banner when leaving the game page
      if (isNativeApp()) hideBanner()
    }
  }, [loaded, game?.slug])

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    const el = document.getElementById('game-container')
    if (!document.fullscreenElement) el?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }
  useEffect(() => {
    const h = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  // ── Signal iframe that ads are ready ─────────────────────────────────────
  const notifyIframeReady = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'BATTLEX_ADS_READY' }, '*'
    )
  }, [])

  // ── Close web ad and resume ───────────────────────────────────────────────
  const handleWebAdClose = useCallback(() => {
    setShowWebAd(false)
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'BATTLEX_AD_COMPLETE' }, '*'
    )
  }, [])

  // ── Android hardware back button (defined after handleWebAdClose) ────────
  useEffect(() => {
    if (!isNativeApp()) return
    let listener = null
    const setupBack = async () => {
      try {
        const { App } = await import('@capacitor/app')
        listener = await App.addListener('backButton', () => {
          if (showWebAd) { handleWebAdClose(); return; }
          navigate(`/games/${game?.slug}`)
        })
      } catch {}
    }
    setupBack()
    return () => { listener?.remove?.() }
  }, [game?.slug, showWebAd, handleWebAdClose, navigate])

  // ── Central ad trigger — works for both platforms ─────────────────────────
  const triggerAd = useCallback(async (gameSlug, adType = 'interstitial') => {
    const now = Date.now()
    if (adType !== 'rewarded' && now - lastAdTime.current < AD_RULES.minInterstitialGapMs) {
      // Too soon — skip and resume game immediately
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'BATTLEX_AD_COMPLETE', rewarded: false }, '*'
      )
      return
    }
    lastAdTime.current = now

    if (isNativeApp() && ADMOB_ENABLED) {
      // Android: show real AdMob ad natively
      await showInterstitial(gameSlug)
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'BATTLEX_AD_COMPLETE', rewarded: true }, '*'
      )
    } else {
      // Web: show our custom overlay with AdSense slot
      setShowWebAd(true)
      // handleWebAdClose() will send BATTLEX_AD_COMPLETE when user closes
    }
  }, [])

  // ── Handle all postMessages from game iframes ─────────────────────────────
  const handleMessage = useCallback(async (event) => {
    const { data } = event
    if (!data?.type) return

    // Ad request from any game
    if (data.type === 'BATTLEX_SHOW_AD') {
      await triggerAd(data.game || game?.slug, data.adType || 'interstitial')
      return
    }

    // Hide banner request
    if (data.type === 'BATTLEX_HIDE_BANNER') {
      if (isNativeApp()) hideBanner()
      return
    }

    // Parking Jam score submission
    if (data.type === 'PARKING_JAM_SCORE') {
      try {
        const res = await fetch('/api/leaderboard', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game:            'parking-jam',
            playerName:      data.playerName,
            speedrunTimeMs:  data.speedrunTimeMs,
            speedrunTime:    data.speedrunTime,
            score:           data.score,
            level:           data.level,
            speedrunEnabled: true,
          }),
        })
        const result = await res.json()
        console.log('[BattleX] Score submit result:', result)
        if (result.success) {
          setScoreNotif({
            playerName:   data.playerName,
            score:        data.score,
            speedrunTime: data.speedrunTimeMs,
            rank:         result.rank,
          })
        }
      } catch (e) {
        console.warn('[BattleX] Score submit failed:', e)
      }
      return
    }

    // Parking Jam level complete — direct interstitial trigger
    if (data.type === 'PARKING_JAM_LEVEL_COMPLETE') {
      if ((data.level || 0) >= 2) await triggerAd('parking-jam')
      return
    }

    // Table Tennis score submission
    if (data.type === 'TABLE_TENNIS_SCORE') {
      try {
        const token = localStorage.getItem('token')
        const headers = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetch('/api/table-tennis-leaderboard', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            playerName:    data.playerName    || localStorage.getItem('username') || 'Player',
            opponentName:  data.opponentName  || 'CPU',
            opponentType:  data.opponentType  || 'cpu',
            playerScore:   data.playerScore   || 0,
            opponentScore: data.opponentScore || 0,
            won:           Boolean(data.won),
            durationMs:    data.durationMs    || 0,
            timesPlayed:   data.timesPlayed   || 1,
            totalPoints:   data.totalPoints   || 0,
          }),
        })
        const result = await res.json()
        console.log('[BattleX] TT score result:', result)
        if (result.success || result.ok) {
          setScoreNotif({
            playerName: data.playerName,
            score:      data.playerScore,
            rank:       null,
          })
          // Record game in Player Service for dashboard stats
          const storedUser = localStorage.getItem('bx_user')
          const bxUser = storedUser ? JSON.parse(storedUser) : null
          if (bxUser?.userId || bxUser?.username) {
            recordGameResults([{
              userId:        bxUser.userId    || null,
              username:      bxUser.username  || data.playerName,
              gameType:      'TableTennis',
              outcome:       data.won ? 'Win' : 'Loss',
              score:         data.playerScore || 0,
              pointsEarned:  data.totalPoints || 0,
              moneyEarned:   0,
              opponentCount: 1,
            }]).catch(e => console.warn('[BattleX] record-game failed:', e.message))
          }
        }
      } catch (e) {
        console.warn('[BattleX] TT score submit failed:', e)
      }
      return
    }
    // SNL match complete — score already submitted by game directly
    if (data.type === 'SNL_MATCH_COMPLETE') {
      // Score submitted directly from game to API — just show notification
      return
    }

    // Navigate to a BattleX page (from in-game overlay button)
    if (data.type === 'BATTLEX_NAVIGATE') {
      if (data.url) window.location.href = data.url
      return
    }
  }, [game?.slug, triggerAd])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!game) return (
    <div className={styles.notFound}>
      <div className={styles.notFoundIcon}>🎮</div>
      <h2>Game Not Found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/games')}>Browse Games</button>
    </div>
  )

  // Redirect native games (no iframe) to their own page
  if (game.playable && (game.gameUrl === null || game.gameUrl === undefined)) {
    return <Navigate to={`/games/${game.slug}/play`} replace />
  }

  if (!game.playable || !game.gameUrl) return (
    <div className={styles.notFound}>
      <div className={styles.notFoundIcon}>{game.emoji}</div>
      <h2>{game.title}</h2>
      <p>This game is coming soon!</p>
      <button className="btn btn-primary" onClick={() => navigate(`/games/${game.slug}`)}>Back</button>
    </div>
  )

  return (
    <div className={styles.page}>

      {/* Web interstitial overlay — hidden on Android (AdMob handles natively) */}
      {showWebAd && !isNativeApp() && (
        <WebAdOverlay slug={game.slug} onClose={handleWebAdClose} />
      )}

      {/* Score notification */}
      {scoreNotif && (
        <ScoreNotification
          data={scoreNotif}
          gameSlug={game.slug}
          onDismiss={() => setScoreNotif(null)}
        />
      )}

      {/* Top bar */}
      <div className={styles.topBar} style={{ '--game-accent': game.accent }}>
        <div className={styles.topBarLeft}>
          <button className={styles.backBtn} onClick={() => navigate(`/games/${game.slug}`)}>← Back</button>
          <div className={styles.gameInfo}>
            <span className={styles.gameEmoji}>{game.emoji}</span>
            <div>
              <div className={styles.gameTitle}>{game.title}</div>
              <div className={styles.gameMeta}>
                <span className={styles.genrePill}>{game.genre}</span>
                <span className={styles.ratingPill}>⭐ {game.rating}</span>
                {game.free && <span className={styles.freePill}>FREE</span>}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.topBarRight}>
          {!isNativeApp() && (
            <button className={styles.iconBtn} onClick={toggleFullscreen} title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              ⛶
            </button>
          )}
        </div>
      </div>

      {/* Game iframe */}
      <div className={styles.gameWrapper} id="game-container">
        {!loaded && (
          <div className={styles.loadingScreen} style={{ background: game.bg }}>
            <div className={styles.loadingEmoji}>{game.emoji}</div>
            <div className={styles.loadingTitle}>{game.title}</div>
            <div className={styles.spinner} style={{ borderTopColor: game.accent }} />
            <div className={styles.loadingText}>Loading game...</div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={game.gameUrl}
          title={game.title}
          className={`${styles.gameFrame} ${loaded ? styles.gameFrameVisible : ''}`}
          onLoad={() => { setLoaded(true); notifyIframeReady() }}
          allow="fullscreen; autoplay; clipboard-write"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
        />
      </div>

      {/* Web banner ad below game — hidden on Android (AdMob banner is native) */}
      <WebBannerAd slug={game.slug} />

      {/* Details shown on /games/:slug page, not here */}

    </div>
  )
}
