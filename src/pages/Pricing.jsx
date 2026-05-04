import { useState } from 'react'
import { PLANS } from '../data'
import styles from './Pricing.module.css'

const COMPARISON_ROWS = [
  { label: 'Free Games Access',       free: true,    pro: true,    elite: true    },
  { label: 'Premium Games Library',   free: false,   pro: true,    elite: true    },
  { label: 'Ads-Free Experience',     free: false,   pro: true,    elite: true    },
  { label: 'Priority Matchmaking',    free: false,   pro: true,    elite: true    },
  { label: 'Early Access Betas',      free: false,   pro: true,    elite: true    },
  { label: 'Cloud Save Storage',      free: '—',     pro: '50 GB', elite: '1 TB'  },
  { label: 'Streaming Quality',       free: '720p',  pro: '1080p', elite: '4K'    },
  { label: 'Monthly Reward Crates',   free: false,   pro: true,    elite: true    },
  { label: 'Exclusive Elite Titles',  free: false,   pro: false,   elite: true    },
  { label: 'Free Tournament Entry',   free: false,   pro: false,   elite: '2/mo'  },
  { label: 'Dedicated Servers',       free: false,   pro: false,   elite: true    },
  { label: 'Discord Elite Role',      free: false,   pro: false,   elite: true    },
]

function CheckCell({ val }) {
  if (val === true)  return <span className={styles.check}>✓</span>
  if (val === false) return <span className={styles.cross}>—</span>
  return <span className={styles.text}>{val}</span>
}

export default function Pricing({ onSignup }) {
  const [billing, setBilling] = useState('monthly')

  const price = (plan) => {
    if (plan.monthlyPrice === 0) return 'Free'
    return billing === 'monthly'
      ? `$${plan.monthlyPrice.toFixed(2)}`
      : `$${plan.yearlyPrice.toFixed(2)}`
  }

  const period = (plan) => {
    if (plan.monthlyPrice === 0) return ''
    return billing === 'monthly' ? '/mo' : '/yr'
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label">Subscription</div>
          <h1 className="section-title">Choose Your Plan</h1>
          <p className="section-subtitle">Unlock the full BattleX experience. Cancel anytime.</p>

          {/* Billing toggle */}
          <div className={styles.billingToggle}>
            {['monthly', 'yearly'].map(b => (
              <button
                key={b}
                className={`${styles.billingBtn} ${billing === b ? styles.billingBtnActive : ''}`}
                onClick={() => setBilling(b)}
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
                {b === 'yearly' && <span className={styles.saveBadge}>Save 17%</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {/* Plan cards */}
        <div className={styles.plansGrid}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
              style={{ '--plan-color': plan.color }}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>⭐ MOST POPULAR</div>
              )}

              <div className={styles.planHeader}>
                <div className={styles.planName} style={{ color: plan.color }}>{plan.name}</div>
                <div className={styles.planPrice}>
                  <span className={styles.planPriceVal}>{price(plan)}</span>
                  <span className={styles.planPricePeriod}>{period(plan)}</span>
                </div>
                {billing === 'yearly' && plan.monthlyPrice > 0 && (
                  <div className={styles.planSaving}>
                    Billed annually · saves ${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(2)}/yr
                  </div>
                )}
              </div>

              <ul className={styles.perksList}>
                {plan.perks.map(perk => (
                  <li key={perk} className={styles.perkItem}>
                    <span className={styles.perkCheck} style={{ color: plan.color }}>✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn btn-lg ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  width: '100%', justifyContent: 'center',
                  ...(plan.popular ? { background: plan.color, boxShadow: `0 0 30px ${plan.color}60` } : { color: plan.color, borderColor: plan.color }),
                }}
                onClick={onSignup}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className={styles.comparisonWrap}>
          <h2 className={styles.compTitle}>Full Feature Comparison</h2>

          <div className={styles.compTable}>
            {/* Header */}
            <div className={styles.compHead}>
              <div className={styles.compFeatureCol}>Feature</div>
              {PLANS.map(p => (
                <div key={p.id} className={styles.compPlanCol} style={{ color: p.color }}>{p.name}</div>
              ))}
            </div>

            {/* Rows */}
            {COMPARISON_ROWS.map((row, i) => (
              <div key={i} className={`${styles.compRow} ${i % 2 === 0 ? styles.compRowAlt : ''}`}>
                <div className={styles.compFeatureCol}>{row.label}</div>
                <div className={styles.compPlanCol}><CheckCell val={row.free} /></div>
                <div className={styles.compPlanCol}><CheckCell val={row.pro} /></div>
                <div className={styles.compPlanCol}><CheckCell val={row.elite} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.faqSection}>
          <h2 className={styles.compTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            {[
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel your subscription at any time with no penalties. You keep access until the end of your billing period.' },
              { q: 'Is there a free trial?', a: 'Pro and Elite plans include a 7-day free trial for new subscribers. No credit card required to start.' },
              { q: 'Can I switch plans?', a: 'Absolutely. Upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.' },
              { q: 'What payment methods are accepted?', a: 'We accept Visa, MasterCard, American Express, PayPal, and cryptocurrency payments.' },
            ].map((faq, i) => (
              <div key={i} className={styles.faqCard}>
                <h4 className={styles.faqQ}>{faq.q}</h4>
                <p className={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
