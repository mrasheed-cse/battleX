import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import styles from './Careers.module.css'

const OPENINGS = [
  {
    id: 1, title: 'Senior Full-Stack Engineer',     dept: 'Engineering',  type: 'Full-time', location: 'Remote / Dhaka',
    desc: 'Build and scale core platform features. React, Node.js, PostgreSQL, and a passion for gaming required.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
  },
  {
    id: 2, title: 'Game Developer (Unity/JS)',       dept: 'Games',        type: 'Full-time', location: 'Remote',
    desc: 'Design and develop browser-based HTML5 games that run flawlessly on any device.',
    skills: ['JavaScript', 'WebGL', 'Canvas API', 'Game Design'],
  },
  {
    id: 3, title: 'UI/UX Designer',                 dept: 'Design',       type: 'Full-time', location: 'Remote / Dhaka',
    desc: 'Own the visual identity and design system of BattleX. You\'ll shape what millions of gamers see every day.',
    skills: ['Figma', 'Motion Design', 'Design Systems', 'Prototyping'],
  },
  {
    id: 4, title: 'DevOps / Platform Engineer',     dept: 'Engineering',  type: 'Full-time', location: 'Remote',
    desc: 'Maintain and scale our infrastructure across Vercel, AWS, and Supabase. 99.9% uptime is our baseline.',
    skills: ['AWS', 'Docker', 'CI/CD', 'Terraform', 'Monitoring'],
  },
  {
    id: 5, title: 'Community Manager',              dept: 'Community',    type: 'Full-time', location: 'Remote',
    desc: 'Grow and nurture our player community across Discord, Twitter/X, and in-platform spaces.',
    skills: ['Discord', 'Social Media', 'Content Creation', 'Gaming'],
  },
  {
    id: 6, title: 'Esports Tournament Coordinator', dept: 'Esports',      type: 'Part-time', location: 'Remote',
    desc: 'Plan, run, and broadcast competitive tournaments. Experience with streaming and bracket management required.',
    skills: ['OBS', 'Battlefy/Challonge', 'Broadcasting', 'Esports'],
  },
  {
    id: 7, title: 'Data Analyst',                   dept: 'Product',      type: 'Full-time', location: 'Remote / Dhaka',
    desc: 'Turn platform data into insights that improve the player experience and drive product decisions.',
    skills: ['SQL', 'Python', 'Tableau', 'A/B Testing', 'Statistics'],
  },
]

const DEPTS = ['All', 'Engineering', 'Games', 'Design', 'Community', 'Esports', 'Product']

const DEPT_COLORS = {
  Engineering: '#a855f7', Games: '#f59e0b', Design: '#ec4899',
  Community: '#10b981', Esports: '#ef4444', Product: '#06b6d4',
}

const PERKS = [
  { icon: '💰', title: 'Competitive Pay',     desc: 'Market-rate salaries with equity options.' },
  { icon: '🌍', title: 'Fully Remote',        desc: 'Work from anywhere in the world.' },
  { icon: '🎮', title: 'Free Elite Plan',     desc: 'Full BattleX Elite access for you + 3 family members.' },
  { icon: '📚', title: 'Learning Budget',     desc: '$1,200/year for courses, books, and conferences.' },
  { icon: '🏖️', title: 'Unlimited PTO',      desc: 'Take the time you need. Seriously.' },
  { icon: '💻', title: 'Hardware Stipend',    desc: '$2,000 setup budget on your first day.' },
  { icon: '🏥', title: 'Health Coverage',     desc: 'Medical, dental, and vision for you and dependents.' },
  { icon: '⚡', title: 'Async-First Culture', desc: 'Deep work over endless meetings.' },
]

export default function Careers() {
  const toast     = useToast()
  const [dept, setDept] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const shown = dept === 'All' ? OPENINGS : OPENINGS.filter(j => j.dept === dept)

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <div className="section-label">Join Us</div>
          <h1 className={styles.heroTitle}>
            Help Build the Future<br />of Gaming
          </h1>
          <p className={styles.heroSub}>
            We're a remote-first team of gamers, engineers, and designers building
            the platform we always wanted to play on. Come build it with us.
          </p>
          <div className={styles.heroStats}>
            {[
              { val: '60+',     label: 'Team Members'    },
              { val: 'Remote',  label: 'Work Style'       },
              { val: '18',      label: 'Countries'        },
              { val: 'Series A',label: 'Funded'           },
            ].map(s => (
              <div key={s.label} className={styles.heroStat}>
                <div className={styles.heroStatVal}>{s.val}</div>
                <div className={styles.heroStatLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">

        {/* Perks */}
        <section className={styles.perksSection}>
          <h2 className={styles.sectionTitle}>Why BattleX?</h2>
          <div className={styles.perksGrid}>
            {PERKS.map(p => (
              <div key={p.title} className={styles.perkCard}>
                <span className={styles.perkIcon}>{p.icon}</span>
                <div>
                  <div className={styles.perkTitle}>{p.title}</div>
                  <div className={styles.perkDesc}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Openings */}
        <section className={styles.openingsSection}>
          <div className={styles.openingsHeader}>
            <h2 className={styles.sectionTitle}>Open Roles</h2>
            <span className={styles.openCount}>{OPENINGS.length} openings</span>
          </div>

          {/* Dept filter */}
          <div className={styles.deptFilters}>
            {DEPTS.map(d => (
              <button key={d}
                className={`${styles.deptBtn} ${dept === d ? styles.deptBtnActive : ''}`}
                style={dept === d && d !== 'All'
                  ? { background: (DEPT_COLORS[d] || '#6b7280') + '20', color: DEPT_COLORS[d] || '#6b7280', borderColor: (DEPT_COLORS[d] || '#6b7280') + '60' }
                  : {}}
                onClick={() => setDept(d)}>
                {d}
              </button>
            ))}
          </div>

          <div className={styles.jobList}>
            {shown.map(job => (
              <div key={job.id}
                className={`${styles.jobCard} ${expanded === job.id ? styles.jobCardOpen : ''}`}
                style={{ '--job-color': DEPT_COLORS[job.dept] || '#6b7280' }}
              >
                <div className={styles.jobHeader} onClick={() => setExpanded(expanded === job.id ? null : job.id)}>
                  <div className={styles.jobLeft}>
                    <div className={styles.jobTitle}>{job.title}</div>
                    <div className={styles.jobMeta}>
                      <span className={styles.jobDept}
                        style={{ color: DEPT_COLORS[job.dept], background: (DEPT_COLORS[job.dept] || '#6b7280') + '15' }}>
                        {job.dept}
                      </span>
                      <span className={styles.jobPill}>{job.type}</span>
                      <span className={styles.jobPill}>📍 {job.location}</span>
                    </div>
                  </div>
                  <span className={styles.jobArrow}>{expanded === job.id ? '▲' : '▼'}</span>
                </div>

                {expanded === job.id && (
                  <div className={styles.jobBody}>
                    <p className={styles.jobDesc}>{job.desc}</p>
                    <div className={styles.skillsList}>
                      {job.skills.map(s => (
                        <span key={s} className={styles.skill}
                          style={{ borderColor: (DEPT_COLORS[job.dept] || '#6b7280') + '50',
                                   color: DEPT_COLORS[job.dept] || '#6b7280' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <button className="btn btn-primary"
                      style={{ background: DEPT_COLORS[job.dept] || '#6b7280',
                               boxShadow: `0 0 20px ${(DEPT_COLORS[job.dept] || '#6b7280')}50` }}
                      onClick={() => toast.success('Application form coming soon! Email careers@battlex.games')}>
                      Apply for this Role →
                    </button>
                  </div>
                )}
              </div>
            ))}

            {shown.length === 0 && (
              <div className={styles.empty}>No openings in this department right now. Check back soon!</div>
            )}
          </div>
        </section>

        {/* Spontaneous application */}
        <div className={styles.spontaneous}>
          <div>
            <h3 className={styles.spontTitle}>Don't see the right role?</h3>
            <p className={styles.spontDesc}>We're always interested in exceptional people. Send your CV to <strong>careers@battlex.games</strong> and tell us how you'd contribute.</p>
          </div>
          <button className="btn btn-outline"
            onClick={() => toast.info('Email careers@battlex.games with your CV and a short intro!')}>
            Send Open Application →
          </button>
        </div>

      </div>
    </div>
  )
}
