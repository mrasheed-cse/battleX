import { useState } from 'react'
import { TOURNAMENTS } from '../data'
import styles from './Tournaments.module.css'

const STATUS_META = {
  LIVE: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'LIVE' },
  OPEN: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'OPEN' },
  FULL: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)', label: 'FULL' },
}

const TIER_META = {
  ELITE: { color: '#f59e0b', label: '👑 ELITE' },
  PRO:   { color: '#a855f7', label: '⚡ PRO'   },
  FREE:  { color: '#10b981', label: '🎮 FREE'  },
}

function TournamentCard({ t }) {
  const pct    = Math.round((t.filled / t.slots) * 100)
  const status = STATUS_META[t.status]
  const tier   = TIER_META[t.tier]

  return (
    <article className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader} style={{ '--t-accent': t.gameAccent }}>
        <div className={styles.cardHeaderInner}>
          <div>
            <div className={styles.cardGame}>{t.game}</div>
            <h3 className={styles.cardName}>{t.name}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span className={styles.statusBadge}
              style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
              {t.status === 'LIVE' && <span className={styles.liveDot} />}
              {status.label}
            </span>
            <span className={styles.tierBadge} style={{ color: tier.color }}>{tier.label}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <p className={styles.cardDesc}>{t.description}</p>

        <div className={styles.cardMeta}>
          <div className={styles.metaItem}><span className={styles.metaLabel}>Prize</span><span className={styles.prize}>{t.prize}</span></div>
          <div className={styles.metaItem}><span className={styles.metaLabel}>Format</span><span className={styles.metaVal}>{t.format}</span></div>
          <div className={styles.metaItem}><span className={styles.metaLabel}>Region</span><span className={styles.metaVal}>{t.region}</span></div>
          <div className={styles.metaItem}><span className={styles.metaLabel}>Dates</span><span className={styles.metaVal}>{t.date}</span></div>
        </div>

        {/* Slots progress */}
        <div className={styles.slotsRow}>
          <span className={styles.slotsLabel}>👥 {t.filled} / {t.slots} players</span>
          <span className={styles.slotsLabel}>{pct}% full</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${pct}%`,
            background: pct === 100 ? '#6b7280' : t.gameAccent,
          }} />
        </div>

        {/* Action */}
        <button
          className={`btn ${t.status === 'FULL' ? 'btn-ghost' : 'btn-primary'}`}
          style={{
            width: '100%', justifyContent: 'center', marginTop: 20,
            ...(t.status !== 'FULL' ? { background: t.gameAccent, boxShadow: `0 0 20px ${t.gameAccent}50` } : {}),
          }}
          disabled={t.status === 'FULL'}
        >
          {t.status === 'LIVE' ? '📺 Watch Live' : t.status === 'FULL' ? 'Slots Full' : 'Register Now →'}
        </button>
      </div>
    </article>
  )
}

export default function Tournaments() {
  const [filter, setFilter] = useState('All')
  const tabs = ['All', 'LIVE', 'OPEN', 'FULL']

  const shown = filter === 'All' ? TOURNAMENTS : TOURNAMENTS.filter(t => t.status === filter)

  const totalPrize = TOURNAMENTS.reduce((sum, t) => sum + t.prizeRaw, 0)

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className="section-label" style={{ color: '#ef4444' }}>Esports</div>
          <h1 className="section-title">Tournaments</h1>
          <p className="section-subtitle">Compete for glory and real cash prizes</p>

          <div className={styles.headerStats}>
            <div className={styles.hStat}>
              <span className={styles.hStatVal}>{TOURNAMENTS.filter(t => t.status === 'LIVE').length}</span>
              <span className={styles.hStatLabel}>Live Now</span>
            </div>
            <div className={styles.hStat}>
              <span className={styles.hStatVal}>{TOURNAMENTS.filter(t => t.status === 'OPEN').length}</span>
              <span className={styles.hStatLabel}>Open Entry</span>
            </div>
            <div className={styles.hStat}>
              <span className={styles.hStatVal}>${(totalPrize / 1000).toFixed(0)}K+</span>
              <span className={styles.hStatLabel}>Total Prizes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          {tabs.map(t => (
            <button
              key={t}
              className={`${styles.filterTab} ${filter === t ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(t)}
            >
              {t === 'LIVE' && <span className={styles.liveDotTab} />}
              {t}
              <span className={styles.filterCount}>
                {t === 'All' ? TOURNAMENTS.length : TOURNAMENTS.filter(tr => tr.status === t).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {shown.map(t => <TournamentCard key={t.id} t={t} />)}
        </div>
      </div>
    </div>
  )
}
