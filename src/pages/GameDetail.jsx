import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { GAMES, LEADERBOARD } from '../data'
import { useToast } from '../context/ToastContext'
import styles from './GameDetail.module.css'

const TAG_COLORS = { HOT: '#ef4444', FREE: '#10b981', NEW: '#a855f7' }

function StarRating({ rating, large }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: large ? 20 : 14, letterSpacing: 2 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: 'var(--text-muted)', fontSize: large ? 16 : 12, marginLeft: 6 }}>
        {rating}
      </span>
    </span>
  )
}

const MOCK_REVIEWS = [
  { id: 1, user: 'NightFury_X',   rating: 5, text: 'Absolutely incredible. Best game on the platform by a mile. The visual design alone is worth it.',         date: 'Mar 20, 2026', avatar: '🦊' },
  { id: 2, user: 'ShadowViper',   rating: 4, text: 'Really solid gameplay, runs smooth on all devices. Minor bugs in multiplayer but overall very impressive.', date: 'Mar 18, 2026', avatar: '🐍' },
  { id: 3, user: 'QuantumByte',   rating: 5, text: 'I\'ve been playing this daily for 3 weeks. The leaderboard system keeps it competitive. Highly recommend.', date: 'Mar 15, 2026', avatar: '⚡' },
  { id: 4, user: 'VoidHunter99',  rating: 4, text: 'Great game, could use more levels but what\'s here is polished and fun. Will keep checking for updates.',   date: 'Mar 12, 2026', avatar: '🎯' },
]

export default function GameDetail() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const toast      = useToast()
  const game       = GAMES.find(g => g.slug === slug)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeTab, setActiveTab]   = useState('overview')
  const [realBoard, setRealBoard]   = useState([])
  const [boardLoading, setBoardLoading] = useState(false)

  // Fetch real leaderboard from Supabase for playable games
  useEffect(() => {
    if (activeTab !== 'leaderboard' || !game?.playable) return
    setBoardLoading(true)
    fetch(`/api/leaderboard?game=${game.slug}&board=speedrun&period=alltime&limit=8`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.entries) setRealBoard(data.entries) })
      .catch(() => {})
      .finally(() => setBoardLoading(false))
  }, [activeTab, game?.slug, game?.playable])

  if (!game) {
    return (
      <div className={styles.notFound}>
        <div>🎮</div>
        <h2>Game Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/games')}>Browse Games</button>
      </div>
    )
  }

  const relatedGames = GAMES.filter(g => g.genre === game.genre && g.id !== game.id).slice(0, 3)

  const handleWishlist = () => {
    setWishlisted(w => !w)
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => toast.success('Link copied to clipboard!'))
  }

  return (
    <div className={styles.page}>

      {/* ── Hero banner ── */}
      <div className={styles.hero} style={{ '--game-bg': game.bg, '--game-accent': game.accent }}>
        <div className={styles.heroBg} />
        <div className={styles.heroVignette} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.heroInner}>

            {/* Thumbnail box */}
            <div className={styles.thumbBox}>
              {game.thumbImg
                ? <img src={game.thumbImg} alt={game.title} className={styles.thumbImg} />
                : <span className={styles.thumbEmoji}>{game.emoji}</span>
              }
            </div>

            {/* Info */}
            <div className={styles.heroInfo}>
              {/* Breadcrumb */}
              <div className={styles.breadcrumb}>
                <Link to="/games" className={styles.breadLink}>Games</Link>
                <span className={styles.breadSep}>›</span>
                <span>{game.genre}</span>
                <span className={styles.breadSep}>›</span>
                <span>{game.title}</span>
              </div>

              <div className={styles.badges}>
                <span className="badge" style={{ background: TAG_COLORS[game.tag], color: '#fff' }}>{game.tag}</span>
                {game.isNew && <span className="badge" style={{ background: '#a855f7', color: '#fff' }}>NEW</span>}
                <span className={styles.genrePill}>{game.genre}</span>
              </div>

              <h1 className={styles.heroTitle}>{game.title}</h1>
              <p className={styles.heroDesc}>{game.description}</p>

              <div className={styles.heroMeta}>
                <div className={styles.metaItem}>
                  <StarRating rating={game.rating} large />
                  <span className={styles.reviewCount}>{game.reviews?.toLocaleString()} reviews</span>
                </div>
                <div className={styles.metaDivider} />
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>👥</span>
                  <span>{game.players} players</span>
                </div>
                <div className={styles.metaDivider} />
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>🏷</span>
                  <span>{game.free ? 'Free to Play' : 'Premium'}</span>
                </div>
              </div>

              <div className={styles.heroActions}>
                {game.playable
                  ? <button className="btn btn-primary btn-lg"
                      style={{ background: game.accent, boxShadow: `0 0 30px ${game.accent}60` }}
                      onClick={() => navigate(`/games/${game.slug}/play`)}>
                      ▶ Play Now
                    </button>
                  : <button className="btn btn-primary btn-lg"
                      style={{ background: game.accent }}
                      onClick={() => toast.info('This game is coming soon!')}>
                      ▶ Coming Soon
                    </button>
                }
                <button
                  className={`btn ${wishlisted ? 'btn-primary' : 'btn-ghost'}`}
                  style={wishlisted ? { background: '#ef4444' } : {}}
                  onClick={handleWishlist}
                >
                  {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
                </button>
                <button className="btn btn-ghost" onClick={handleShare}>
                  ↗ Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabBar}>
        <div className="container">
          <div className={styles.tabs}>
            {['overview', 'reviews', 'leaderboard'].map(t => (
              <button key={t}
                className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t)}
                style={activeTab === t ? { borderBottomColor: game.accent, color: game.accent } : {}}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'reviews' && <span className={styles.tabCount}>{MOCK_REVIEWS.length}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="container">
        <div className={styles.layout}>

          {/* Left — main content */}
          <div className={styles.main}>

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>About This Game</h2>
                  <p className={styles.longDesc}>{game.longDescription}</p>
                </div>

                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Features</h2>
                  <div className={styles.featureGrid}>
                    {game.features?.map(f => (
                      <div key={f} className={styles.featureItem} style={{ borderColor: game.accent + '40' }}>
                        <span style={{ color: game.accent }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>

                {game.requirements && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>System Requirements</h2>
                    <div className={styles.reqGrid}>
                      <div className={styles.reqCard}>
                        <div className={styles.reqTitle}>Minimum</div>
                        <div className={styles.reqVal}>{game.requirements.min}</div>
                      </div>
                      <div className={styles.reqCard}>
                        <div className={styles.reqTitle}>Recommended</div>
                        <div className={styles.reqVal}>{game.requirements.rec}</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div className={styles.section}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewSummary}>
                    <div className={styles.bigRating} style={{ color: game.accent }}>
                      {game.rating}
                    </div>
                    <div>
                      <StarRating rating={game.rating} large />
                      <div className={styles.reviewCount2}>{game.reviews?.toLocaleString()} total reviews</div>
                    </div>
                  </div>
                </div>
                <div className={styles.reviewList}>
                  {MOCK_REVIEWS.map(r => (
                    <div key={r.id} className={styles.reviewCard}>
                      <div className={styles.reviewTop}>
                        <div className={styles.reviewAvatar}>{r.avatar}</div>
                        <div className={styles.reviewMeta}>
                          <span className={styles.reviewUser}>{r.user}</span>
                          <span className={styles.reviewDate}>{r.date}</span>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className={styles.reviewText}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEADERBOARD */}
            {activeTab === 'leaderboard' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Top Players — {game.title}</h2>

                {/* Real leaderboard for playable games */}
                {game.playable ? (
                  <>
                    {boardLoading && (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Loading scores...
                      </div>
                    )}
                    {!boardLoading && realBoard.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No scores yet — be the first to complete all levels!
                      </div>
                    )}
                    {!boardLoading && realBoard.length > 0 && (
                      <div className={styles.lbTable}>
                        <div className={styles.lbHead}>
                          <span>Rank</span>
                          <span style={{ flex: 1 }}>Player</span>
                          <span>Time</span>
                          <span>Score</span>
                        </div>
                        {realBoard.map((p, i) => (
                          <div key={p.id} className={`${styles.lbRow} ${i === 0 ? styles.lbFirst : ''}`}>
                            <span className={styles.lbRank}>
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                            </span>
                            <div className={styles.lbPlayer} style={{ flex: 1 }}>
                              <div className={styles.lbAvatar}
                                style={{ background: `hsl(${(i + 1) * 50},55%,42%)` }}>
                                {p.player_name[0].toUpperCase()}
                              </div>
                              <div className={styles.lbName}>{p.player_name}</div>
                            </div>
                            <span className={styles.lbScore} style={{ color: '#a855f7' }}>
                              {p.speedrun_time_ms ? `${(p.speedrun_time_ms / 1000).toFixed(1)}s` : '—'}
                            </span>
                            <span className={styles.lbScore} style={{ color: game.accent }}>
                              🪙 {p.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <Link
                        to={`/games/${game.slug}/leaderboard`}
                        style={{ color: game.accent, textDecoration: 'none', fontWeight: 600 }}>
                        View Full Leaderboard →
                      </Link>
                    </div>
                  </>
                ) : (
                  /* Mock leaderboard for non-playable games */
                  <div className={styles.lbTable}>
                    <div className={styles.lbHead}>
                      <span>Rank</span>
                      <span style={{ flex: 1 }}>Player</span>
                      <span>Score</span>
                      <span>W/L</span>
                    </div>
                    {LEADERBOARD.slice(0, 8).map((p, i) => (
                      <div key={p.rank} className={`${styles.lbRow} ${i === 0 ? styles.lbFirst : ''}`}>
                        <span className={styles.lbRank}>{p.badge}</span>
                        <div className={styles.lbPlayer} style={{ flex: 1 }}>
                          <div className={styles.lbAvatar}
                            style={{ background: `hsl(${p.rank * 50},55%,42%)` }}>
                            {p.name[0]}
                          </div>
                          <div>
                            <div className={styles.lbName}>{p.name}</div>
                            <div className={styles.lbCountry}>{p.country}</div>
                          </div>
                        </div>
                        <span className={styles.lbScore} style={{ color: game.accent }}>
                          {p.score.toLocaleString()}
                        </span>
                        <span className={styles.lbKd}>{p.kd} K/D</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — sidebar */}
          <aside className={styles.sidebar}>
            {/* Game info card */}
            <div className={styles.infoCard}>
              <div className={styles.infoTitle}>Game Info</div>
              {[
                { label: 'Developer',  value: 'BattleX Studios'     },
                { label: 'Genre',      value: game.genre             },
                { label: 'Release',    value: 'Jan 2026'             },
                { label: 'Platform',   value: 'Web, Android, iOS'    },
                { label: 'Players',    value: game.players           },
                { label: 'Rating',     value: `⭐ ${game.rating}/5`  },
                { label: 'Price',      value: game.free ? '🆓 Free' : '💳 Premium' },
              ].map(item => (
                <div key={item.label} className={styles.infoRow}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  <span className={styles.infoValue}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Play button (sticky) */}
            <div className={styles.stickyPlay}>
              {game.playable
                ? <button className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center', background: game.accent, boxShadow: `0 0 24px ${game.accent}60` }}
                    onClick={() => navigate(`/games/${game.slug}/play`)}>
                    ▶ Play Now — {game.free ? 'FREE' : 'Premium'}
                  </button>
                : <button className="btn btn-ghost btn-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => toast.info('Coming soon! Add to wishlist.')}>
                    🔔 Notify Me
                  </button>
              }
            </div>

            {/* Tags */}
            <div className={styles.tagsCard}>
              <div className={styles.infoTitle}>Tags</div>
              <div className={styles.tagList}>
                {[game.genre, game.subgenre, ...(game.features || []).slice(0, 4)].filter(Boolean).map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related games ── */}
        {relatedGames.length > 0 && (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>More {game.genre} Games</h2>
            <div className={styles.relatedGrid}>
              {relatedGames.map(g => (
                <div key={g.id} className={styles.relatedCard}
                  onClick={() => navigate(`/games/${g.slug}/info`)}>
                  <div className={styles.relatedThumb} style={{ background: g.bg }}>
                    {g.thumbImg
                      ? <img src={g.thumbImg} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 40 }}>{g.emoji}</span>
                    }
                  </div>
                  <div className={styles.relatedInfo}>
                    <div className={styles.relatedName}>{g.title}</div>
                    <div className={styles.relatedMeta}>⭐ {g.rating} · {g.players}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
