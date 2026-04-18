import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// ── Back to Top Button ────────────────────────────────────────────────────────
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
    >
      ↑
    </button>
  )
}

// ── Mobile Bottom Navigation ──────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Home',        to: '/',            icon: '🏠', end: true },
  { label: 'Games',       to: '/games',       icon: '🎮' },
  { label: 'Battle',      to: '/tournaments', icon: '🏆' },
  { label: 'Ranks',       to: '/leaderboard', icon: '📊' },
  { label: 'More',        to: null,           icon: '☰'  },
]

const MORE_ITEMS = [
  { label: 'About Us',       to: '/about',    icon: 'ℹ️' },
  { label: 'Contact Us',     to: '/contact',  icon: '📧' },
  { label: 'Privacy Policy', to: '/privacy',  icon: '🔒' },
  { label: 'Terms of Use',   to: '/terms',    icon: '📄' },
]

export function MobileBottomNav() {
  const { pathname } = useLocation()
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {/* More drawer */}
      {showMore && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.6)',
          }}
          onClick={() => setShowMore(false)}
        >
          <div
            style={{
              position: 'absolute', bottom: 64, left: 0, right: 0,
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border)',
              borderRadius: '16px 16px 0 0',
              padding: '16px 0 8px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: 1 }}>MORE</div>
            {MORE_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setShowMore(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 24px',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 15,
                  fontWeight: 600,
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>›</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map(item => {
          if (!item.to) {
            return (
              <button
                key="more"
                className={`mbn-item ${showMore ? 'mbn-active' : ''}`}
                onClick={() => setShowMore(s => !s)}
                aria-label="More"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span className="mbn-icon">{item.icon}</span>
                <span className="mbn-label">{item.label}</span>
              </button>
            )
          }
          const isActive = item.end
            ? pathname === item.to
            : pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`mbn-item ${isActive ? 'mbn-active' : ''}`}
              aria-label={item.label}
              onClick={() => setShowMore(false)}
            >
              <span className="mbn-icon">{item.icon}</span>
              <span className="mbn-label">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
