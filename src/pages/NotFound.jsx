import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <div className={styles.glitch} aria-hidden="true">404</div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.sub}>Looks like this level doesn't exist. Try heading back to base.</p>
      <div className={styles.actions}>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>Back to Home</button>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/games')}>Browse Games</button>
      </div>
    </div>
  )
}
