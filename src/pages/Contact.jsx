import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import styles from './Contact.module.css'

const TOPICS = ['General Inquiry', 'Technical Support', 'Billing & Subscription', 'Report a Bug', 'Partnership', 'Press Inquiry', 'Other']

const FAQ = [
  { q: 'How do I cancel my subscription?',   a: 'Go to Dashboard → Settings → Subscription and click Cancel. You keep access until the billing period ends.' },
  { q: 'My game is not loading — help!',      a: 'Clear your browser cache, ensure you have a stable internet connection, and try a different browser. If the issue persists, contact us.' },
  { q: 'Can I get a refund?',                 a: 'We offer a 7-day money-back guarantee on first subscriptions. Contact support within 7 days of your first charge.' },
  { q: 'How do I report a cheater?',          a: 'Use the in-game report button or email cheaters@battlex.games with the player\'s username and match ID.' },
  { q: 'Is BattleX available on mobile?',     a: 'Yes! BattleX is available on Android via Google Play and as a PWA on iOS. The same account works everywhere.' },
]

export default function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    toast.success('Message sent! We\'ll reply within 24 hours.')
    setForm({ name: '', email: '', topic: '', message: '' })
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className="section-label">Support</div>
          <h1 className="section-title">Get in Touch</h1>
          <p className="section-subtitle">We typically respond within 24 hours. For urgent issues, use live chat.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>

          {/* ── Contact form ── */}
          <div className={styles.formSection}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className="input-label">Your Name *</label>
                  <input name="name" className="input" placeholder="John Doe"
                    value={form.name} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                  <label className="input-label">Email Address *</label>
                  <input name="email" type="email" className="input" placeholder="you@email.com"
                    value={form.email} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.field}>
                <label className="input-label">Topic</label>
                <select name="topic" className="input" style={{ cursor: 'pointer', appearance: 'none' }}
                  value={form.topic} onChange={handleChange}>
                  <option value="">Select a topic...</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label className="input-label">Message *</label>
                <textarea
                  name="message"
                  className={`input ${styles.textarea}`}
                  placeholder="Describe your issue or question in detail..."
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>

          {/* ── Right sidebar ── */}
          <aside className={styles.aside}>
            {/* Contact channels */}
            <div className={styles.channelsCard}>
              <div className={styles.cardTitle}>Other Ways to Reach Us</div>
              {[
                { icon: '💬', label: 'Live Chat',   desc: 'Mon–Fri, 9am–6pm GMT',    action: 'Start Chat'     },
                { icon: '📧', label: 'Email',        desc: 'support@battlex.games',   action: 'Copy Email'     },
                { icon: '🐦', label: 'Twitter/X',   desc: '@BattleXGames',           action: 'Open Twitter'   },
                { icon: '💙', label: 'Discord',     desc: 'discord.gg/battlex',      action: 'Join Server'    },
              ].map(ch => (
                <div key={ch.label} className={styles.channel}>
                  <span className={styles.channelIcon}>{ch.icon}</span>
                  <div className={styles.channelInfo}>
                    <div className={styles.channelLabel}>{ch.label}</div>
                    <div className={styles.channelDesc}>{ch.desc}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm"
                    onClick={() => toast.info(`Opening ${ch.label}...`)}>
                    {ch.action}
                  </button>
                </div>
              ))}
            </div>

            {/* Response times */}
            <div className={styles.channelsCard}>
              <div className={styles.cardTitle}>Response Times</div>
              {[
                { tier: 'Live Chat',      time: '~2 min',   color: '#10b981' },
                { tier: 'Email',          time: '< 24hrs',  color: '#a855f7' },
                { tier: 'Discord',        time: '< 12hrs',  color: '#5865f2' },
                { tier: 'Support Ticket', time: '1–3 days', color: '#f59e0b' },
              ].map(r => (
                <div key={r.tier} className={styles.responseRow}>
                  <span className={styles.responseTier}>{r.tier}</span>
                  <span className={styles.responseTime} style={{ color: r.color }}>{r.time}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* ── FAQ ── */}
        <div className={styles.faqSection}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {FAQ.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQ}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className={styles.faqArrow}>{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqA}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
