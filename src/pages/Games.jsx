import { useState, useMemo } from 'react'
import { GAMES, GENRES } from '../data'
import GameCard from '../components/GameCard'
import styles from './Games.module.css'

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Top Rated',    value: 'rating'  },
  { label: 'Newest First', value: 'newest'  },
  { label: 'A → Z',        value: 'alpha'   },
]

const FILTERS = [
  { label: 'Free to Play', key: 'free'  },
  { label: 'New Releases', key: 'isNew' },
  { label: 'Hot Right Now', key: 'hot'  },
]

export default function Games() {
  const [search,  setSearch]  = useState('')
  const [genre,   setGenre]   = useState('All')
  const [sort,    setSort]    = useState('popular')
  const [filters, setFilters] = useState(new Set())

  const toggleFilter = key =>
    setFilters(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const results = useMemo(() => {
    let list = [...GAMES]

    if (search)            list = list.filter(g => g.title.toLowerCase().includes(search.toLowerCase()) || g.genre.toLowerCase().includes(search.toLowerCase()))
    if (genre !== 'All')   list = list.filter(g => g.genre === genre)
    if (filters.has('free'))  list = list.filter(g => g.free)
    if (filters.has('isNew')) list = list.filter(g => g.isNew)
    if (filters.has('hot'))   list = list.filter(g => g.tag === 'HOT')

    switch (sort) {
      case 'rating':  list.sort((a, b) => b.rating - a.rating);  break
      case 'newest':  list.sort((a, b) => b.id - a.id);          break
      case 'alpha':   list.sort((a, b) => a.title.localeCompare(b.title)); break
      default:        list.sort((a, b) => parseFloat(b.players) - parseFloat(a.players)); break
    }
    // Always put playable games first regardless of sort
    list.sort((a, b) => (b.playable ? 1 : 0) - (a.playable ? 1 : 0))

    return list
  }, [search, genre, sort, filters])

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.header}>
        <div className="container">
          <div className="section-label">Library</div>
          <h1 className="section-title">All Games</h1>
          <p className="section-subtitle">150+ titles across every genre — free and premium</p>
        </div>
      </div>

      <div className="container">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={`input ${styles.searchInput}`}
              placeholder="Search games or genres..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            className={`input ${styles.sortSelect}`}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Genre tabs */}
        <div className={styles.genreTabs}>
          {GENRES.map(g => (
            <button
              key={g}
              className={`${styles.genreTab} ${genre === g ? styles.genreTabActive : ''}`}
              onClick={() => setGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Quick filters */}
        <div className={styles.quickFilters}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`${styles.filterChip} ${filters.has(f.key) ? styles.filterChipActive : ''}`}
              onClick={() => toggleFilter(f.key)}
            >
              {filters.has(f.key) ? '✓ ' : ''}{f.label}
            </button>
          ))}
          <span className={styles.resultCount}>{results.length} game{results.length !== 1 ? 's' : ''} found</span>
        </div>

        {/* Grid */}
        {results.length > 0 ? (
          <div className={styles.grid}>
            {results.map(g => <GameCard key={g.id} game={g} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎮</div>
            <h3>No games found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setGenre('All'); setFilters(new Set()) }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
