import { useEffect, useState } from 'react'
import logoSrc from '../assets/logo.png'
import styles from './AppLoader.module.css'

export default function AppLoader({ onDone }) {
  const [phase, setPhase] = useState(0) // 0 = loading, 1 = fading out

  useEffect(() => {
    // Show splash for 1.2s then fade out
    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => onDone(), 1700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`${styles.splash} ${phase === 1 ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <img src={logoSrc} alt="BattleX" className={styles.logo} />
        <div className={styles.barTrack}>
          <div className={styles.barFill} />
        </div>
        <div className={styles.label}>Loading Platform...</div>
      </div>
    </div>
  )
}
