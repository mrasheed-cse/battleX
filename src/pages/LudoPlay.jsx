import { Link } from 'react-router-dom'
import styles from './LudoPlay.module.css'

export default function LudoPlay() {
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
