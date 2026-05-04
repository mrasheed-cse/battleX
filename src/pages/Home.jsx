import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GAMES, PLATFORM_STATS, NEWS, TOURNAMENTS } from '../data'
import GameCard from '../components/GameCard'
import styles from './Home.module.css'

// ── Hero Carousel ─────────────────────────────────────────────────────────────
function Hero() {
  const [idx, setIdx] = useState(0)
  const navigate = useNavigate()
  const featured = GAMES.filter(g => g.playable)
  const game = featured[idx]

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % featured.length), 5500)
    return () => clearInterval(t)
  }, [featured.length])

  return (
    <section className={styles.hero} style={{ '--hero-bg': game.bg, '--hero-accent': game.accent }}>
      {/* BG */}
      <div className={styles.heroBg} />
      <div className={styles.heroVignette} />

      {/* Particles */}
      <div className={styles.particles} aria-hidden="true">
        {[...Array(18)].map((_, i) => (
          <span key={i} className={styles.particle}
            style={{
              left: `${5 + Math.random() * 90}%`,
              top:  `${5 + Math.random() * 90}%`,
              animationDelay: `${(i * 0.4).toFixed(1)}s`,
              animationDuration: `${2.5 + (i % 3)}s`,
              width:  i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
            }}
          />
        ))}
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className={styles.heroInner}>
          {/* Text */}
          <div className={styles.heroContent} key={game.id}>
            <div className={styles.heroBadges}>
              <span className="badge" style={{ background: game.accent, color: '#000', fontWeight: 900 }}>
                {game.tag}
              </span>
              <span className={styles.heroGenre}>{game.genre}</span>
            </div>

            <h1 className={styles.heroTitle}>{game.title}</h1>
            <p className={styles.heroDesc}>{game.description}</p>

            <div className={styles.heroMeta}>
              <div>
                <div className={styles.heroMetaLabel}>Rating</div>
                <div className={styles.heroMetaVal}>⭐ {game.rating}</div>
              </div>
              <div>
                <div className={styles.heroMetaLabel}>Players</div>
                <div className={styles.heroMetaVal}>{game.players}</div>
              </div>
              <div>
                <div className={styles.heroMetaLabel}>Genre</div>
                <div className={styles.heroMetaVal}>{game.genre}</div>
              </div>
            </div>

            <div className={styles.heroCTAs}>
              <button className="btn btn-primary btn-lg" onClick={() => { if (game.gameUrl && game.gameUrl.endsWith('.html')) { window.location.href = game.gameUrl } else { navigate(`/games/${game.slug}/play`) } }}>{game.free ? '▶ Play Free' : '▶ Play Now'}</button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/games')}>Browse Library</button>
            </div>
          </div>

          {/* Big emoji decoration */}
          <div className={styles.heroEmoji} aria-hidden="true">{game.emoji}</div>
        </div>
      </div>

      {/* Slide dots */}
      <div className={styles.heroDots} aria-label="Carousel navigation">
        {featured.map((g, i) => (
          <button
            key={g.id}
            className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Show ${g.title}`}
          />
        ))}
      </div>
    </section>
  )
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <div className={styles.statsBar}>
      <div className="container">
        <div className={styles.statsGrid}>
          {PLATFORM_STATS.map((s, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statVal}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Featured games ────────────────────────────────────────────────────────────
function FeaturedGames() {
  const navigate = useNavigate()
  return (
    <section className="section">
      <div className="container">
        <div className={styles.sectionHead}>
          <div>
            <div className="section-label">Featured</div>
            <h2 className="section-title">Top Games Right Now</h2>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/games')}>
            View All Games →
          </button>
        </div>
        <div className={styles.gamesGrid}>
          {GAMES.filter(g => g.playable).map(g => <GameCard key={g.id} game={g} />)}
        </div>
      </div>
    </section>
  )
}

// ── Live Tournament highlight ─────────────────────────────────────────────────
function TournamentHighlight() {
  const navigate = useNavigate()
  const live = TOURNAMENTS.find(t => t.status === 'LIVE')
  if (!live) return null

  const pct = Math.round((live.filled / live.slots) * 100)

  return (
    <section className={styles.tournamentBanner}>
      <div className="container">
        <div className={styles.tBannerInner}>
          <div className={styles.tLiveDot} aria-hidden="true" />
          <div className={styles.tBannerContent}>
            <div className={styles.tBannerLabel}>🏆 LIVE TOURNAMENT</div>
            <h3 className={styles.tBannerTitle}>{live.name}</h3>
            <p className={styles.tBannerSub}>{live.description}</p>
            <div className={styles.tBannerMeta}>
              <span>💰 {live.prize}</span>
              <span>👥 {live.filled}/{live.slots} players</span>
              <span>📅 Ends {live.endDate}</span>
            </div>
          </div>
          <div className={styles.tBannerActions}>
            <div className={styles.tBannerPrize}>{live.prize}</div>
            <button className="btn btn-primary" onClick={() => navigate('/tournaments')}>
              Watch Live
            </button>
          </div>
        </div>
        <div className="progress-track" style={{ marginTop: 16 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: '#ef4444' }} />
        </div>
      </div>
    </section>
  )
}

// ── News ──────────────────────────────────────────────────────────────────────
function NewsSection() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className={styles.sectionHead}>
          <div>
            <div className="section-label">Latest</div>
            <h2 className="section-title">News & Updates</h2>
          </div>
        </div>
        <div className={styles.newsGrid}>
          {NEWS.map(n => (
            <article key={n.id} className={`card ${styles.newsCard}`}>
              <span className="badge" style={{ background: n.accent + '25', color: n.accent, border: `1px solid ${n.accent}40` }}>
                {n.category}
              </span>
              <h4 className={styles.newsTitle}>{n.title}</h4>
              <p className={styles.newsExcerpt}>{n.excerpt}</p>
              <div className={styles.newsMeta}>
                <span>{n.date}</span>
                <span>{n.readTime} read</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner({ onSignup }) {
  return (
    <section className={styles.ctaBanner}>
      <div className="container">
        <div className={styles.ctaInner}>
          <div>
            <h2 className={styles.ctaTitle}>Ready to Dominate?</h2>
            <p className={styles.ctaSub}>Join 12.4 million players. Start free, upgrade when you're ready.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={onSignup}>Create Free Account</button>
            <button className="btn btn-ghost btn-lg">View Pricing</button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home({ onSignup }) {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedGames />
      <TournamentHighlight />
      <NewsSection />
      <CTABanner onSignup={onSignup} />
    </>
  )
}
