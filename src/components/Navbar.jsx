import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBar from './SearchBar'
import styles from './Navbar.module.css'
import logoSrc from '../assets/logo.png'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { label: 'Home',        to: '/'            },
  { label: 'Games',       to: '/games'       },
  { label: 'Tournaments', to: '/tournaments' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Pricing',     to: '/pricing'     },
]

export default function Navbar({ onLoginClick, onSignupClick }) {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Ctrl+K / Cmd+K opens search
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>

          {/* ── Fixed logo — overflows navbar ── */}
          <NavLink to="/" className={styles.logoWrap}>
            <img src={logoSrc} alt="BattleX Premium Gaming" className={styles.logoImg} />
          </NavLink>

          {/* ── Desktop nav links — centered ── */}
          <div className={styles.navLinks}>
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* ── Right side ── */}
          <div className={styles.authArea}>
            {/* Theme toggle */}
            <button
              className={styles.iconCircleBtn}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Search button */}
            <button
              className={styles.searchBtn}
              onClick={() => setSearchOpen(true)}
              title="Search games (Ctrl+K)"
            >
              🔍
              <span className={styles.searchHint}>Ctrl K</span>
            </button>

            {user ? (
              <div className={styles.userMenu}>
                <div
                  className={styles.userAvatar}
                  onClick={() => navigate('/dashboard')}
                  title="My Dashboard"
                  style={{ cursor: 'pointer' }}
                >
                  {(user.displayName || user.username || user.email || "U")[0].toUpperCase()}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}
                    onClick={() => navigate('/dashboard')}
                    style={{ cursor: 'pointer' }}>
                    {user.displayName || user.username || user.email || 'Player'}
                  </span>
                  <span className={styles.userPlan}>
                    {(user.role || user.plan || 'player').toUpperCase()}
                  </span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/') }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm"   onClick={onLoginClick}>Sign In</button>
                <button className="btn btn-primary btn-sm" onClick={onSignupClick}>Sign Up</button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${mobileOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.barOpen3 : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            {user && (
              <NavLink to="/dashboard"
                className={styles.mobileLink}
                onClick={() => setMobileOpen(false)}>
                👤 My Dashboard
              </NavLink>
            )}
            <div className={styles.mobileAuth}>
              {user ? (
                <button className="btn btn-ghost"
                  onClick={() => { logout(); navigate('/'); setMobileOpen(false) }}>
                  Sign Out
                </button>
              ) : (
                <>
                  <button className="btn btn-ghost"   onClick={() => { onLoginClick();  setMobileOpen(false) }}>Sign In</button>
                  <button className="btn btn-primary" onClick={() => { onSignupClick(); setMobileOpen(false) }}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)}>
          <div className={styles.searchModal} onClick={e => e.stopPropagation()}>
            <SearchBar onClose={() => setSearchOpen(false)} />
            <div className={styles.searchHints}>
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
