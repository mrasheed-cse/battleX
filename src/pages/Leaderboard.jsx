import { useState } from 'react'
import { LEADERBOARD } from '../data'
import styles from './Leaderboard.module.css'

const CHANGE_META = {
  up:   { icon: '▲', color: '#10b981', label: 'Rising'  },
  down: { icon: '▼', color: '#ef4444', label: 'Falling' },
  same: { icon: '—', color: '#6b7280', label: 'Steady'  },
}

const TIER_COLORS = {
  ELITE: '#f59e0b',
  PRO:   '#a855f7',
}

export default function Leaderboard() {
  const [tab, setTab] = useState('global')

  const tabs = [
    { key: 'global',  label: '🌍 Global'    },
    { key: 'weekly',  label: '📅 This Week'  },
    { key: 'friends', label: '👥 Friends'    },
  ]

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className="section-label" style={{ color: '#f59e0b' }}>Rankings</div>
          <h1 className="section-title">Global Leaderboard</h1>
          <p className="section-subtitle">The best players in the world, ranked by total score</p>
        </div>
      </div>

      <div className="container">
        {/* Top 3 podium */}
        <div className={styles.podium}>
          {/* 2nd */}
          <div className={`${styles.podiumCard} ${styles.podiumSecond}`}>
            <div className={styles.podiumAvatar} style={{ background: `hsl(120,60%,40%)` }}>
              {LEADERBOARD[1].name[0]}
            </div>
            <div className={styles.podiumMedal}>🥈</div>
            <div className={styles.podiumName}>{LEADERBOARD[1].name}</div>
            <div className={styles.podiumScore}>{LEADERBOARD[1].score.toLocaleString()}</div>
            <div className={styles.podiumCountry}>{LEADERBOARD[1].country}</div>
          </div>

          {/* 1st */}
          <div className={`${styles.podiumCard} ${styles.podiumFirst}`}>
            <div className={styles.podiumCrown}>👑</div>
            <div className={styles.podiumAvatar} style={{ background: '#f59e0b', color: '#000' }}>
              {LEADERBOARD[0].name[0]}
            </div>
            <div className={styles.podiumMedal}>🥇</div>
            <div className={styles.podiumName}>{LEADERBOARD[0].name}</div>
            <div className={styles.podiumScore}>{LEADERBOARD[0].score.toLocaleString()}</div>
            <div className={styles.podiumCountry}>{LEADERBOARD[0].country}</div>
          </div>

          {/* 3rd */}
          <div className={`${styles.podiumCard} ${styles.podiumThird}`}>
            <div className={styles.podiumAvatar} style={{ background: `hsl(200,60%,40%)` }}>
              {LEADERBOARD[2].name[0]}
            </div>
            <div className={styles.podiumMedal}>🥉</div>
            <div className={styles.podiumName}>{LEADERBOARD[2].name}</div>
            <div className={styles.podiumScore}>{LEADERBOARD[2].score.toLocaleString()}</div>
            <div className={styles.podiumCountry}>{LEADERBOARD[2].country}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map(t => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={styles.tableWrap}>
          {/* Head */}
          <div className={styles.tableHead}>
            <span style={{ width: 48 }}>Rank</span>
            <span style={{ flex: 1 }}>Player</span>
            <span style={{ width: 100, textAlign: 'right' }}>Score</span>
            <span style={{ width: 80,  textAlign: 'right' }}>Wins</span>
            <span style={{ width: 60,  textAlign: 'right' }}>K/D</span>
            <span style={{ width: 80,  textAlign: 'right' }}>Trend</span>
          </div>

          {/* Rows */}
          {LEADERBOARD.map((entry, i) => {
            const change = CHANGE_META[entry.change]
            return (
              <div
                key={entry.rank}
                className={`${styles.row} ${i === 0 ? styles.rowFirst : ''}`}
              >
                <span className={styles.rankCell}>
                  <span className={styles.rankNum}>{entry.rank}</span>
                  <span className={styles.rankBadge}>{entry.badge}</span>
                </span>

                <div className={styles.playerCell}>
                  <div className={styles.playerAvatar}
                    style={{ background: `hsl(${entry.rank * 50},55%,42%)` }}>
                    {entry.name[0]}
                  </div>
                  <div>
                    <div className={styles.playerName}>{entry.name}</div>
                    <div className={styles.playerMeta}>
                      {entry.country}&nbsp;
                      <span style={{ color: TIER_COLORS[entry.tier] || '#6b7280', fontSize: 10, fontWeight: 700 }}>
                        {entry.tier}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={styles.scoreCell}>{entry.score.toLocaleString()}</span>
                <span className={styles.winsCell}>{entry.wins.toLocaleString()}</span>
                <span className={styles.kdCell}>{entry.kd}</span>
                <span className={styles.changeCell} style={{ color: change.color }}>
                  {change.icon} {change.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className={styles.tableFooter}>
          Showing top 10 of 12,400,000+ players • Updates every 15 minutes
        </div>
      </div>
    </div>
  )
}
