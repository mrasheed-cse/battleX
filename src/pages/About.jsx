import { useNavigate } from 'react-router-dom'
import styles from './About.module.css'

const TEAM = [
  { name: 'Alex Chen',      role: 'CEO & Co-Founder',       emoji: '👨‍💼', bio: 'Former Google engineer, 15 years in gaming.' },
  { name: 'Priya Sharma',   role: 'CTO & Co-Founder',       emoji: '👩‍💻', bio: 'Ex-Riot Games, architected league systems for 50M+ users.' },
  { name: 'Marcus Webb',    role: 'Head of Game Design',    emoji: '🎮', bio: 'Shipped 12 titles across major studios.' },
  { name: 'Leila Nouri',    role: 'Head of Product',        emoji: '🚀', bio: 'Previously led product at Discord and Twitch.' },
  { name: 'James Okafor',   role: 'Lead Engineer',          emoji: '⚙️', bio: 'Full-stack specialist, open source contributor.' },
  { name: 'Sofia Park',     role: 'Community Manager',      emoji: '🌟', bio: 'Built communities of 1M+ across gaming platforms.' },
]

const MILESTONES = [
  { year: '2023', event: 'BattleX founded in Dhaka, Bangladesh with a team of 4.' },
  { year: '2024', event: 'Launched beta with 10 games. Reached 100K users in 60 days.' },
  { year: '2024', event: 'Secured Series A funding. Expanded to 50+ team members.' },
  { year: '2025', event: 'Passed 5 million active users. Launched tournament system.' },
  { year: '2026', event: 'Launched on Google Play Store. 12.4M active players globally.' },
]

const VALUES = [
  { icon: '🎯', title: 'Player First',    desc: 'Every decision starts with what\'s best for our players. No dark patterns, no pay-to-win.' },
  { icon: '🌍', title: 'Global Access',   desc: 'Gaming should have no borders. We\'re built for players in every country and on every device.' },
  { icon: '🔒', title: 'Fair & Safe',     desc: 'Zero tolerance for cheating, toxicity, or exploitative monetisation.' },
  { icon: '⚡', title: 'Always Improving',desc: 'We ship updates weekly. Every player report matters to us.' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className="section-label">Our Story</div>
          <h1 className={styles.heroTitle}>
            Built by Gamers,<br />for Gamers
          </h1>
          <p className={styles.heroSub}>
            BattleX was founded in 2023 with one mission: build the world's most fair, accessible,
            and exciting gaming platform. No ads in gameplay. No pay-to-win. Just pure competition.
          </p>
          <div className={styles.heroCTAs}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/games')}>Explore Games</button>
            <button className="btn btn-ghost btn-lg"   onClick={() => navigate('/pricing')}>View Plans</button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { val: '12.4M', label: 'Active Players',    icon: '👥' },
              { val: '150+',  label: 'Games Available',   icon: '🎮' },
              { val: '47',    label: 'Countries',         icon: '🌍' },
              { val: '$2.3M', label: 'Prizes Awarded',    icon: '🏆' },
              { val: '99.9%', label: 'Uptime',            icon: '⚡' },
              { val: '4.8★',  label: 'Average Rating',   icon: '⭐' },
            ].map(s => (
              <div key={s.label} className={styles.statItem}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div className={styles.statVal}>{s.val}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section">
        <div className="container">
          <div className="section-label">What We Stand For</div>
          <h2 className="section-title">Our Values</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className={styles.timelineSection}>
        <div className="container">
          <div className="section-label">History</div>
          <h2 className="section-title">Our Journey</h2>
          <div className={styles.timeline}>
            {MILESTONES.map((m, i) => (
              <div key={i} className={styles.milestone}>
                <div className={styles.milestoneYear}>{m.year}</div>
                <div className={styles.milestoneLine}>
                  <div className={styles.milestoneDot} />
                  {i < MILESTONES.length - 1 && <div className={styles.milestoneConnector} />}
                </div>
                <div className={styles.milestoneEvent}>{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section">
        <div className="container">
          <div className="section-label">The People</div>
          <h2 className="section-title">Meet the Team</h2>
          <div className={styles.teamGrid}>
            {TEAM.map(m => (
              <div key={m.name} className={styles.teamCard}>
                <div className={styles.teamAvatar}>{m.emoji}</div>
                <div className={styles.teamName}>{m.name}</div>
                <div className={styles.teamRole}>{m.role}</div>
                <p className={styles.teamBio}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Join the BattleX Community</h2>
          <p className={styles.ctaSub}>12.4 million players can't be wrong. Start free today.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/games')}>
            Start Playing Free →
          </button>
        </div>
      </section>

    </div>
  )
}
