import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './GameCard.module.css'

const TAG_COLORS = {
  HOT:  '#ef4444',
  FREE: '#10b981',
  NEW:  '#a855f7',
}

function StarRating({ rating }) {
  return (
    <span className={styles.stars} aria-label={`Rating: ${rating} out of 5`}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span className={styles.ratingNum}>{rating}</span>
    </span>
  )
}

export default function GameCard({ game }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const isActive = !!game.playable

  const handleClick = () => {
    if (isActive && game.slug) navigate(`/games/${game.slug}/info`)
  }

  return (
    <article
      className={`${styles.card} ${isActive ? styles.cardActive : styles.cardInactive}`}
      style={{ '--card-accent': game.accent }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      data-hovered={hovered}
      data-active={isActive}
    >
      {/* Thumbnail */}
      <div className={styles.thumb} style={{ background: game.bg }}>
        {game.thumbImg ? (
          <img
            src={game.thumbImg}
            alt={game.title}
            className={`${styles.thumbImg} ${!isActive ? styles.thumbInactive : ''}`}
          />
        ) : (
          <span
            className={styles.emoji}
            role="img"
            aria-label={game.title}
            style={{ opacity: isActive ? 1 : 0.35 }}
          >
            {game.emoji}
          </span>
        )}
        <div className={styles.thumbOverlay} />

        {/* Active badge */}
        {isActive && (
          <span className={styles.activeBadge}>
            <span className={styles.activeDot} />
            LIVE
          </span>
        )}

        {/* Tag badge */}
        {game.tag && isActive && (
          <span
            className="badge"
            style={{ background: TAG_COLORS[game.tag], color: '#fff', position: 'absolute', top: 12, left: 12 }}
          >
            {game.tag}
          </span>
        )}
        {game.isNew && isActive && (
          <span className="badge" style={{ background: '#a855f7', color: '#fff', position: 'absolute', top: 12, right: 12 }}>
            NEW
          </span>
        )}

        {/* Coming Soon overlay for inactive */}
        {!isActive && (
          <div className={styles.comingSoonOverlay}>
            <div className={styles.lockIcon}>🔒</div>
            <div className={styles.comingSoonText}>COMING SOON</div>
          </div>
        )}

        {/* Play overlay on hover for active games */}
        {isActive && hovered && (
          <div className={styles.playOverlay}>
            <div className={styles.playBtn}>▶ PLAY NOW</div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.genre}>{game.genre}</div>
        <h3 className={`${styles.title} ${!isActive ? styles.titleInactive : ''}`}>
          {game.title}
        </h3>
        <p className={`${styles.desc} ${!isActive ? styles.descInactive : ''}`}>
          {game.description}
        </p>

        <div className={styles.meta}>
          <StarRating rating={game.rating} />
          <span className={styles.players}>{game.players} players</span>
        </div>

        <button
          className={`btn ${isActive ? (hovered ? 'btn-primary' : 'btn-outline') : ''} ${!isActive ? styles.comingSoonBtn : ''}`}
          style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
          onClick={(e) => {
            e.stopPropagation()
            if (isActive) {
              if (game.gameUrl && game.gameUrl.endsWith('.html')) {
                window.location.href = game.gameUrl
              } else {
                navigate(`/games/${game.slug}/play`)
              }
            } else {
              navigate(`/games/${game.slug}/info`)
            }
          }}
          disabled={!isActive}
        >
          {isActive
            ? (game.free ? '▶ Play Free' : '▶ Play Now')
            : '🔒 Coming Soon'}
        </button>
      </div>
    </article>
  )
}
