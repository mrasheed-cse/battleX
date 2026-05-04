import { useState } from 'react'
import styles from './News.module.css'

const ALL_POSTS = [
  {
    id: 1, category: 'UPDATE', tag: 'Platform',
    title: 'BattleX 2.0 — Biggest Platform Update Yet',
    excerpt: 'We\'re rolling out a complete redesign, new social features, clip sharing, and Watch Parties for all users starting today.',
    date: 'Mar 25, 2026', readTime: '4 min', author: 'Alex Chen', authorRole: 'CEO',
    accent: '#a855f7', emoji: '🚀', featured: true,
  },
  {
    id: 2, category: 'ESPORTS', tag: 'Tournament',
    title: 'BattleX World Championship 2026 — $500K Prize Pool Announced',
    excerpt: 'The biggest gaming event of the year returns. 6 titles, 48 countries, one champion.',
    date: 'Mar 20, 2026', readTime: '5 min', author: 'Marcus Webb', authorRole: 'Head of Esports',
    accent: '#ef4444', emoji: '🏆', featured: false,
  },
  {
    id: 3, category: 'GAME', tag: 'New Release',
    title: 'Warlords Arena Season 4 — 5 New Champions, Reworked Ranking',
    excerpt: 'Season 4 brings the biggest roster expansion in the game\'s history alongside a fully reworked competitive ladder.',
    date: 'Mar 18, 2026', readTime: '3 min', author: 'Game Team', authorRole: 'BattleX Studios',
    accent: '#f59e0b', emoji: '⚔️', featured: false,
  },
  {
    id: 4, category: 'PLATFORM', tag: 'Feature',
    title: 'Clip Sharing, Watch Parties & Social Hubs Are Live',
    excerpt: 'Three of our most-requested features have arrived. Share your best moments, watch friends play live, and hang out in game-specific community hubs.',
    date: 'Mar 15, 2026', readTime: '3 min', author: 'Leila Nouri', authorRole: 'Head of Product',
    accent: '#10b981', emoji: '📱', featured: false,
  },
  {
    id: 5, category: 'MOBILE', tag: 'Android',
    title: 'BattleX Is Now on Google Play Store',
    excerpt: 'Full platform access, live sync with the web, and an optimised mobile experience — now available on Android devices worldwide.',
    date: 'Mar 10, 2026', readTime: '2 min', author: 'James Okafor', authorRole: 'Lead Engineer',
    accent: '#06b6d4', emoji: '📲', featured: false,
  },
  {
    id: 6, category: 'COMMUNITY', tag: 'Milestone',
    title: 'We Hit 12 Million Players — Thank You',
    excerpt: 'A personal note from our CEO on what this milestone means, where we came from, and where BattleX is headed.',
    date: 'Mar 5, 2026', readTime: '6 min', author: 'Alex Chen', authorRole: 'CEO',
    accent: '#ec4899', emoji: '💜', featured: false,
  },
  {
    id: 7, category: 'SECURITY', tag: 'Trust & Safety',
    title: 'New Anti-Cheat System: Zero Tolerance, 100% Enforcement',
    excerpt: 'We\'ve deployed an AI-powered anti-cheat system that has already banned over 14,000 accounts in its first week.',
    date: 'Feb 28, 2026', readTime: '4 min', author: 'Security Team', authorRole: 'BattleX',
    accent: '#84cc16', emoji: '🛡️', featured: false,
  },
  {
    id: 8, category: 'UPDATE', tag: 'Platform',
    title: 'Performance Improvements: 40% Faster Load Times',
    excerpt: 'After months of optimisation work, pages now load significantly faster across all regions, especially on mobile.',
    date: 'Feb 20, 2026', readTime: '2 min', author: 'James Okafor', authorRole: 'Lead Engineer',
    accent: '#f97316', emoji: '⚡', featured: false,
  },
]

const CATEGORIES = ['All', 'UPDATE', 'ESPORTS', 'GAME', 'PLATFORM', 'MOBILE', 'COMMUNITY', 'SECURITY']

const CAT_COLORS = {
  UPDATE: '#a855f7', ESPORTS: '#ef4444', GAME: '#f59e0b',
  PLATFORM: '#10b981', MOBILE: '#06b6d4', COMMUNITY: '#ec4899',
  SECURITY: '#84cc16',
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All')

  const featured = ALL_POSTS.find(p => p.featured)
  const regular  = ALL_POSTS.filter(p => {
    if (p.featured) return false
    if (activeCategory === 'All') return true
    return p.category === activeCategory
  })

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className="section-label">Media</div>
          <h1 className="section-title">News & Updates</h1>
          <p className="section-subtitle">Latest from the BattleX team — game updates, platform news, and esports coverage.</p>
        </div>
      </div>

      <div className="container">

        {/* Featured post */}
        {featured && (
          <div className={styles.featured} style={{ '--post-accent': featured.accent }}>
            <div className={styles.featuredLeft}>
              <div className={styles.featuredEmoji}>{featured.emoji}</div>
            </div>
            <div className={styles.featuredRight}>
              <div className={styles.postMeta}>
                <span className={styles.catBadge}
                  style={{ background: featured.accent + '25', color: featured.accent, border: `1px solid ${featured.accent}40` }}>
                  {featured.category}
                </span>
                <span className={styles.featuredBadge}>⭐ FEATURED</span>
                <span className={styles.postDate}>{featured.date}</span>
              </div>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
              <div className={styles.postFooter}>
                <div className={styles.authorWrap}>
                  <div className={styles.authorDot} style={{ background: featured.accent }} />
                  <span className={styles.authorName}>{featured.author}</span>
                  <span className={styles.authorRole}>{featured.authorRole}</span>
                </div>
                <span className={styles.readTime}>{featured.readTime} read</span>
              </div>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className={styles.filters}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
              style={activeCategory === cat && cat !== 'All'
                ? { background: CAT_COLORS[cat] + '20', color: CAT_COLORS[cat], borderColor: CAT_COLORS[cat] + '60' }
                : {}}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className={styles.grid}>
          {regular.map(post => (
            <article key={post.id} className={styles.card}>
              <div className={styles.cardThumb} style={{ background: `linear-gradient(135deg, ${post.accent}15, ${post.accent}05)` }}>
                <span className={styles.cardEmoji}>{post.emoji}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.postMeta}>
                  <span className={styles.catBadge}
                    style={{ background: (CAT_COLORS[post.category] || '#6b7280') + '20',
                      color: CAT_COLORS[post.category] || '#6b7280',
                      border: `1px solid ${(CAT_COLORS[post.category] || '#6b7280')}40` }}>
                    {post.category}
                  </span>
                  <span className={styles.postTag}>{post.tag}</span>
                </div>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
                <div className={styles.postFooter}>
                  <div className={styles.authorWrap}>
                    <div className={styles.authorDot} style={{ background: CAT_COLORS[post.category] || '#6b7280' }} />
                    <span className={styles.authorName}>{post.author}</span>
                  </div>
                  <div className={styles.postDateRow}>
                    <span className={styles.postDate}>{post.date}</span>
                    <span className={styles.readTime}>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {regular.length === 0 && (
          <div className={styles.empty}>
            <div>📭</div>
            <p>No posts in this category yet.</p>
          </div>
        )}

        {/* Newsletter signup */}
        <div className={styles.newsletter}>
          <div className={styles.newsletterInner}>
            <div>
              <h3 className={styles.newsletterTitle}>Stay in the Loop</h3>
              <p className={styles.newsletterSub}>Get platform updates, game releases, and tournament news straight to your inbox.</p>
            </div>
            <div className={styles.newsletterForm}>
              <input className="input" placeholder="your@email.com" style={{ minWidth: 260 }} />
              <button className="btn btn-primary">Subscribe →</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
