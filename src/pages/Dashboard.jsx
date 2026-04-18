import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { GAMES, LEADERBOARD } from '../data'
import styles from './Dashboard.module.css'

const MOCK_ACTIVITY = [
  { id: 1, action: 'Played', game: 'Word Wipe',        score: 2840, time: '2 hours ago',  emoji: '🔤' },
  { id: 2, action: 'Played', game: 'Snakes & Ladders', score: 1200, time: '5 hours ago',  emoji: '🎲' },
  { id: 3, action: 'Played', game: 'Word Wipe',        score: 3100, time: 'Yesterday',    emoji: '🔤' },
  { id: 4, action: 'Joined', game: 'Void Runners World Cup', score: null, time: '2 days ago', emoji: '🏆' },
  { id: 5, action: 'Played', game: 'Snakes & Ladders', score: 950,  time: '3 days ago',  emoji: '🎲' },
]

const ACHIEVEMENTS = [
  { id: 1, icon: '🎯', name: 'First Blood',    desc: 'Win your first game',      unlocked: true  },
  { id: 2, icon: '🔥', name: 'On Fire',        desc: 'Win 5 games in a row',     unlocked: true  },
  { id: 3, icon: '🏆', name: 'Champion',       desc: 'Reach top 100 globally',   unlocked: false },
  { id: 4, icon: '💎', name: 'Diamond Player', desc: 'Play 100 games',           unlocked: false },
  { id: 5, icon: '⚡', name: 'Speed Demon',    desc: 'Finish a game in under 2m',unlocked: true  },
  { id: 6, icon: '🌟', name: 'Star Player',    desc: 'Score 10,000 total points',unlocked: false },
]

const PLAN_COLORS = { free: '#6b7280', pro: '#a855f7', elite: '#f59e0b' }

function StatCard({ icon, label, value, accent }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: accent + '20', color: accent }}>{icon}</div>
      <div className={styles.statVal}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [activeTab,  setActiveTab]  = useState('overview')
  const [editMode,   setEditMode]   = useState(false)
  const [username,   setUsername]   = useState(user?.username || '')
  const [bio,        setBio]        = useState('Gaming is life. Competing since 2020.')

  if (!user) return <Navigate to="/" replace />

  const planColor = PLAN_COLORS[user.plan] || '#6b7280'

  const handleSaveProfile = () => {
    setEditMode(false)
    toast.success('Profile updated successfully!')
  }

  const handleLogout = () => {
    logout()
    toast.info('Signed out. See you next time!')
    navigate('/')
  }

  const playableGames = GAMES.filter(g => g.playable)

  const TABS = ['overview', 'games', 'achievements', 'settings']

  return (
    <div className={styles.page}>

      {/* ── Profile hero banner ── */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className="container">
          <div className={styles.heroInner}>
            {/* Avatar */}
            <div className={styles.avatarWrap}>
              <div className={styles.avatar} style={{ boxShadow: `0 0 0 4px ${planColor}` }}>
                {user.username[0].toUpperCase()}
              </div>
              <div className={styles.avatarOnline} />
            </div>

            {/* Info */}
            <div className={styles.heroInfo}>
              {editMode ? (
                <input
                  className={`input ${styles.usernameInput}`}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  maxLength={20}
                />
              ) : (
                <h1 className={styles.heroName}>{user.username}</h1>
              )}
              <div className={styles.heroBadges}>
                <span className={styles.planBadge} style={{ background: planColor + '25', color: planColor, borderColor: planColor + '50' }}>
                  {user.plan.toUpperCase()} MEMBER
                </span>
                <span className={styles.rankBadge}>🏅 Rank #247</span>
              </div>
              {editMode ? (
                <input
                  className={`input ${styles.bioInput}`}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={80}
                  placeholder="Write a short bio..."
                />
              ) : (
                <p className={styles.heroBio}>{bio}</p>
              )}
            </div>

            {/* Actions */}
            <div className={styles.heroActions}>
              {editMode ? (
                <>
                  <button className="btn btn-primary" onClick={handleSaveProfile}>Save Profile</button>
                  <button className="btn btn-ghost"   onClick={() => setEditMode(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline" onClick={() => setEditMode(true)}>✏ Edit Profile</button>
                  <button className="btn btn-ghost"   onClick={handleLogout}>Sign Out</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabBar}>
        <div className="container">
          <div className={styles.tabs}>
            {TABS.map(t => (
              <button
                key={t}
                className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="container">
        <div className={styles.content}>

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              {/* Stats row */}
              <div className={styles.statsRow}>
                <StatCard icon="🎮" label="Games Played"    value="47"      accent="#a855f7" />
                <StatCard icon="🏆" label="Tournaments"     value="3"       accent="#f59e0b" />
                <StatCard icon="⭐" label="Total Score"      value="14,200"  accent="#06b6d4" />
                <StatCard icon="🔥" label="Win Streak"      value="4"       accent="#ef4444" />
                <StatCard icon="⏱" label="Hours Played"     value="23h"     accent="#10b981" />
                <StatCard icon="💎" label="XP Points"       value={user.xp?.toLocaleString() || '0'}  accent="#ec4899" />
              </div>

              <div className={styles.twoCol}>
                {/* Recent activity */}
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>Recent Activity</div>
                  <div className={styles.activityList}>
                    {MOCK_ACTIVITY.map(a => (
                      <div key={a.id} className={styles.activityRow}>
                        <span className={styles.activityEmoji}>{a.emoji}</span>
                        <div className={styles.activityInfo}>
                          <span className={styles.activityAction}>{a.action}</span>
                          <span className={styles.activityGame}>{a.game}</span>
                        </div>
                        <div className={styles.activityRight}>
                          {a.score && <span className={styles.activityScore}>{a.score.toLocaleString()} pts</span>}
                          <span className={styles.activityTime}>{a.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick play */}
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>Quick Play</div>
                  <div className={styles.quickPlay}>
                    {playableGames.map(g => (
                      <div key={g.id} className={styles.qpGame} onClick={() => navigate(`/games/${g.slug}`)}>
                        <div className={styles.qpThumb} style={{ background: g.bg }}>
                          {g.thumbImg
                            ? <img src={g.thumbImg} alt={g.title} className={styles.qpImg} />
                            : <span>{g.emoji}</span>
                          }
                        </div>
                        <div className={styles.qpInfo}>
                          <div className={styles.qpTitle}>{g.title}</div>
                          <div className={styles.qpMeta}>{g.genre} · ⭐ {g.rating}</div>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ background: g.accent, boxShadow: `0 0 12px ${g.accent}60` }}
                        >▶</button>
                      </div>
                    ))}
                    <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                      onClick={() => navigate('/games')}>
                      Browse All Games →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── GAMES ── */}
          {activeTab === 'games' && (
            <div className={styles.gamesTab}>
              <div className={styles.panelTitle} style={{ marginBottom: 24 }}>Your Game History</div>
              <div className={styles.gameHistoryGrid}>
                {GAMES.slice(0, 6).map((g, i) => (
                  <div key={g.id} className={styles.historyCard}>
                    <div className={styles.historyThumb} style={{ background: g.bg }}>
                      {g.thumbImg
                        ? <img src={g.thumbImg} alt={g.title} className={styles.qpImg} />
                        : <span style={{ fontSize: 36 }}>{g.emoji}</span>
                      }
                    </div>
                    <div className={styles.historyBody}>
                      <div className={styles.historyTitle}>{g.title}</div>
                      <div className={styles.historyMeta}>{g.genre}</div>
                      <div className={styles.historyStats}>
                        <span>🕐 {i + 1}h played</span>
                        <span>⭐ {g.rating}</span>
                      </div>
                      <div className={styles.xpBar}>
                        <div className={styles.xpFill} style={{ width: `${30 + i * 12}%`, background: g.accent }} />
                      </div>
                      <div className={styles.xpLabel}>Level {i + 2} · {30 + i * 12}% XP</div>
                    </div>
                    {g.playable && (
                      <button className="btn btn-primary btn-sm"
                        style={{ background: g.accent, position: 'absolute', top: 12, right: 12 }}
                        onClick={() => navigate(`/games/${g.slug}`)}>▶</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ACHIEVEMENTS ── */}
          {activeTab === 'achievements' && (
            <div>
              <div className={styles.panelTitle} style={{ marginBottom: 8 }}>Achievements</div>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: 14, marginBottom: 28 }}>
                {ACHIEVEMENTS.filter(a => a.unlocked).length} of {ACHIEVEMENTS.length} unlocked
              </p>
              <div className={styles.achievementsGrid}>
                {ACHIEVEMENTS.map(a => (
                  <div key={a.id} className={`${styles.achievement} ${a.unlocked ? styles.achievementUnlocked : styles.achievementLocked}`}>
                    <div className={styles.achIcon}>{a.unlocked ? a.icon : '🔒'}</div>
                    <div className={styles.achName}>{a.name}</div>
                    <div className={styles.achDesc}>{a.desc}</div>
                    {a.unlocked && <div className={styles.achBadge}>✓ Unlocked</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className={styles.settingsTab}>
              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionTitle}>Account</div>
                <div className={styles.settingRow}>
                  <div>
                    <div className={styles.settingLabel}>Username</div>
                    <div className={styles.settingValue}>{user.username}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setActiveTab('overview'); setEditMode(true) }}>Change</button>
                </div>
                <div className={styles.settingRow}>
                  <div>
                    <div className={styles.settingLabel}>Email</div>
                    <div className={styles.settingValue}>{user.email}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => toast.info('Email change coming soon!')}>Change</button>
                </div>
                <div className={styles.settingRow}>
                  <div>
                    <div className={styles.settingLabel}>Password</div>
                    <div className={styles.settingValue}>••••••••••</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => toast.info('Password reset email sent!')}>Reset</button>
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionTitle}>Subscription</div>
                <div className={styles.currentPlan} style={{ borderColor: planColor + '50' }}>
                  <div>
                    <div className={styles.planName} style={{ color: planColor }}>{user.plan.toUpperCase()} PLAN</div>
                    <div className={styles.planDesc}>
                      {user.plan === 'free'  && 'Access to 20+ free games'}
                      {user.plan === 'pro'   && 'All 150+ games · No ads · Cloud saves'}
                      {user.plan === 'elite' && 'Everything + exclusive titles + tournaments'}
                    </div>
                  </div>
                  {user.plan !== 'elite' && (
                    <button className="btn btn-primary btn-sm"
                      onClick={() => { navigate('/pricing'); toast.info('Choose your plan!') }}>
                      Upgrade
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.settingsSection}>
                <div className={styles.settingsSectionTitle}>Notifications</div>
                {[
                  { label: 'Tournament reminders', desc: 'Get notified before tournaments start' },
                  { label: 'New game alerts',       desc: 'Be first to know about new releases'  },
                  { label: 'Score beaten alerts',   desc: 'When someone beats your leaderboard score' },
                ].map((n, i) => (
                  <div key={i} className={styles.settingRow}>
                    <div>
                      <div className={styles.settingLabel}>{n.label}</div>
                      <div className={styles.settingDesc}>{n.desc}</div>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" defaultChecked={i === 0} />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                ))}
              </div>

              <div className={styles.dangerZone}>
                <div className={styles.settingsSectionTitle} style={{ color: '#ef4444' }}>Danger Zone</div>
                <button className="btn btn-ghost" style={{ color: '#ef4444', borderColor: '#ef444440' }}
                  onClick={() => toast.error('Account deletion requires email confirmation.')}>
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
