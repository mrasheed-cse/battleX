import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GAMES } from '../data'
import styles from './SearchBar.module.css'

export default function SearchBar({ onClose }) {
  const [query,   setQuery]   = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const results = query.trim().length > 1
    ? GAMES.filter(g =>
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.genre.toLowerCase().includes(query.toLowerCase()) ||
        g.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  const go = (game) => {
    if (game.playable) {
      navigate(`/games/${game.slug}`)
    } else {
      navigate('/games')
    }
    onClose?.()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.inputRow}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Search games, genres..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => setQuery('')}>×</button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map(game => (
            <button key={game.id} className={styles.resultItem} onClick={() => go(game)}>
              <div className={styles.resultEmoji}>{game.emoji}</div>
              <div className={styles.resultInfo}>
                <div className={styles.resultTitle}>{game.title}</div>
                <div className={styles.resultMeta}>
                  <span className={styles.resultGenre}>{game.genre}</span>
                  {game.free && <span className={styles.resultFree}>FREE</span>}
                  {game.playable && <span className={styles.resultPlayable}>▶ Playable</span>}
                </div>
              </div>
              <span className={styles.resultRating}>⭐ {game.rating}</span>
            </button>
          ))}
          <div className={styles.seeAll} onClick={() => { navigate('/games'); onClose?.() }}>
            See all results in Games Library →
          </div>
        </div>
      )}

      {focused && query.trim().length > 1 && results.length === 0 && (
        <div className={styles.dropdown}>
          <div className={styles.noResults}>
            <span>No games found for "<strong>{query}</strong>"</span>
          </div>
        </div>
      )}
    </div>
  )
}
