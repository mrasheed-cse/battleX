import styles from './Skeleton.module.css'

export function Skeleton({ width = '100%', height = 16, radius = 6, className = '' }) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}

export function GameCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.thumb} />
      <div className={styles.body}>
        <Skeleton width="40%" height={10} radius={4} />
        <Skeleton width="70%" height={20} radius={6} />
        <Skeleton width="100%" height={13} radius={4} />
        <Skeleton width="85%"  height={13} radius={4} />
        <div className={styles.metaRow}>
          <Skeleton width="100px" height={12} radius={4} />
          <Skeleton width="70px"  height={12} radius={4} />
        </div>
        <Skeleton width="100%" height={38} radius={8} />
      </div>
    </div>
  )
}
