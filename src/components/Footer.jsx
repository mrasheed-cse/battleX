import { NavLink } from 'react-router-dom'
import styles from './Footer.module.css'

const COLS = [
  {
    title: 'Platform',
    links: [
      { label: 'Games Library',  to: '/games'       },
      { label: 'Tournaments',    to: '/tournaments' },
      { label: 'Leaderboard',    to: '/leaderboard' },
      { label: 'Pricing',        to: '/pricing'     },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',   to: '/about'   },
      { label: 'News',       to: '/news'    },
      { label: 'Careers',    to: '/careers' },
      { label: 'Contact',    to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',   to: '/privacy' },
      { label: 'Terms of Service', to: '/terms'   },
      { label: 'Cookie Policy',    to: '/privacy' },
      { label: 'Help Center',      to: '/contact' },
    ],
  },
]

const SOCIALS = [
  { label: '𝕏',  href: 'https://x.com/battlex'       },
  { label: 'DC', href: 'https://discord.gg/battlex'   },
  { label: 'YT', href: 'https://youtube.com/@battlex' },
  { label: 'TW', href: '#'                            },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brand}>
            <NavLink to="/" className={styles.logo}>
              BATTLE<span className={styles.logoAccent}>X</span>
            </NavLink>
            <p className={styles.tagline}>
              The ultimate gaming platform for competitive players. Join millions of gamers
              and experience gaming like never before.
            </p>
            <div className={styles.socials}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className={styles.socialBtn} aria-label={s.label}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.title} className={styles.col}>
              <div className={styles.colTitle}>{col.title}</div>
              {col.links.map(l => (
                <NavLink key={l.label} to={l.to} className={styles.colLink}>
                  {l.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        <hr className="divider" style={{ margin: '40px 0 24px' }} />

        <div className={styles.bottom}>
          <span>© 2026 BattleX Gaming Platform. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <NavLink to="/privacy" className={styles.bottomLink}>Privacy</NavLink>
            <NavLink to="/terms"   className={styles.bottomLink}>Terms</NavLink>
            <NavLink to="/contact" className={styles.bottomLink}>Support</NavLink>
          </div>
          <span>Made with ⚡ in Dhaka, Bangladesh</span>
        </div>
      </div>
    </footer>
  )
}
