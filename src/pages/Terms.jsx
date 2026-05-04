import styles from './Legal.module.css'

export default function Terms() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <div className="section-label">Legal</div>
          <h1 className="section-title">Terms of Service</h1>
          <p className={styles.lastUpdated}>Last updated: March 26, 2026</p>
        </div>
      </div>
      <div className="container">
        <div className={styles.content}>
          <p className={styles.intro}>
            By accessing or using BattleX ("the Platform"), you agree to be bound by these Terms of Service.
            Please read them carefully. If you do not agree, do not use the Platform.
          </p>

          {[
            {
              title: '1. Eligibility',
              body: `You must be at least 13 years old to use BattleX. By creating an account, you confirm you meet this requirement. Users between 13–17 should have parental consent. We reserve the right to terminate accounts of users who misrepresent their age.`,
            },
            {
              title: '2. Account Responsibilities',
              body: `You are responsible for maintaining the security of your account credentials. You must not share your account with others, use another user's account, or create multiple accounts to circumvent bans or restrictions.

You are responsible for all activity that occurs under your account. Notify us immediately at security@battlex.games if you suspect unauthorized access.`,
            },
            {
              title: '3. Acceptable Use',
              body: `You agree NOT to: cheat, hack, exploit bugs, or use third-party software to gain unfair advantages; harass, bully, or threaten other players; attempt to reverse engineer, decompile, or modify platform code; impersonate BattleX staff or other players; use automated bots or scripts to interact with the platform; engage in real-money trading of in-game items or accounts.

Violations may result in immediate account termination without refund.`,
            },
            {
              title: '4. Subscription & Payments',
              body: `Paid subscriptions are billed monthly or annually in advance. Subscriptions auto-renew until cancelled. You may cancel at any time, and access continues until the end of the current billing period. We do not offer partial refunds for unused subscription time except within the 7-day money-back guarantee for new subscribers.

Prices may change with 30 days' notice. Continued use after a price change constitutes acceptance.`,
            },
            {
              title: '5. Virtual Items & In-Game Content',
              body: `In-game items, achievements, and platform credits have no real-world monetary value and cannot be transferred, sold, or exchanged outside the platform. BattleX reserves the right to modify, remove, or rebalance in-game content at any time.

Tournament prizes are real money and governed by separate tournament terms.`,
            },
            {
              title: '6. Intellectual Property',
              body: `All content on BattleX — including games, artwork, code, trademarks, and brand assets — is owned by BattleX or its licensors. You may not reproduce, distribute, or create derivative works without explicit written permission.

User-generated content (usernames, profile text) remains yours. By submitting it, you grant BattleX a worldwide, royalty-free licence to use it in connection with the platform.`,
            },
            {
              title: '7. Termination',
              body: `We may suspend or terminate your account for violations of these Terms, illegal activity, fraudulent behaviour, or at our discretion with reasonable notice. Upon termination, you lose access to all platform content and virtual items with no refund obligation unless required by law.`,
            },
            {
              title: '8. Limitation of Liability',
              body: `To the maximum extent permitted by law, BattleX shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.

The platform is provided "as is". We do not guarantee uninterrupted service availability.`,
            },
            {
              title: '9. Governing Law',
              body: `These Terms are governed by the laws of Bangladesh. Disputes shall be resolved through binding arbitration in Dhaka, Bangladesh, except where prohibited by local consumer protection laws.`,
            },
            {
              title: '10. Contact',
              body: `For legal inquiries: legal@battlex.games\nBattleX Gaming Platform, Dhaka, Bangladesh`,
            },
          ].map(s => (
            <div key={s.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{s.title}</h2>
              {s.body.split('\n\n').map((para, i) => (
                <p key={i} className={styles.para}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
