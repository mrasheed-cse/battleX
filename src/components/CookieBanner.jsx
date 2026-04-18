import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import styles from './CookieBanner.module.css'

export default function CookieBanner() {
  const [consent, setConsent] = useLocalStorage('battlex_cookie_consent', null)
  const [showDetails, setShowDetails] = useState(false)

  if (consent !== null) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.icon}>🍪</span>
          <div className={styles.text}>
            <strong>We use cookies</strong>
            <p>
              BattleX uses cookies to enhance your gaming experience, remember your preferences,
              and analyse platform usage.{' '}
              {showDetails && (
                <span>
                  This includes essential cookies for authentication and session management,
                  analytics cookies to improve our platform, and preference cookies to remember
                  your theme and settings.
                </span>
              )}
              {!showDetails && (
                <button className={styles.detailsBtn} onClick={() => setShowDetails(true)}>
                  Learn more
                </button>
              )}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setConsent('essential')}
          >
            Essential Only
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setConsent('all')}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
