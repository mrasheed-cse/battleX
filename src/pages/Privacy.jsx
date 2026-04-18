import styles from './Legal.module.css'

export default function Privacy() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <div className="section-label">Legal</div>
          <h1 className="section-title">Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: March 26, 2026</p>
        </div>
      </div>
      <div className="container">
        <div className={styles.content}>
          <p className={styles.intro}>
            BattleX Gaming Platform ("BattleX", "we", "us") respects your privacy and is committed
            to protecting your personal data. This policy explains how we collect, use, and protect
            your information when you use our platform.
          </p>

          {[
            {
              title: '1. Information We Collect',
              body: `We collect information you provide directly: account registration data (username, email, password), profile information, payment details for subscriptions, and communications with our support team.

We automatically collect: gameplay data and session information, device information and browser type, IP address and approximate location, platform usage analytics, and performance metrics.`,
            },
            {
              title: '2. How We Use Your Information',
              body: `We use your information to: provide and improve the BattleX platform, process subscription payments, maintain leaderboards and tournament results, send service notifications and updates (with consent), prevent fraud and ensure platform security, and personalise your gaming experience.

We do not sell your personal data to third parties. We do not use your data to serve third-party advertisements within our platform.`,
            },
            {
              title: '3. Data Storage & Security',
              body: `Your data is stored on secure servers in the European Union and United States. We use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 encryption for sensitive data at rest. Passwords are hashed using bcrypt and are never stored in plain text.

We retain account data for the duration of your account's existence plus 90 days after deletion, and anonymised analytics data for up to 3 years.`,
            },
            {
              title: '4. Cookies & Tracking',
              body: `We use cookies for: essential platform functionality (session management, authentication), preference storage (theme, language settings), and optional analytics to improve platform performance.

You can manage cookie preferences at any time via our cookie consent banner or your browser settings. Rejecting non-essential cookies will not affect your ability to use core platform features.`,
            },
            {
              title: '5. Your Rights (GDPR & CCPA)',
              body: `You have the right to: access your personal data, correct inaccurate data, request deletion of your account and data, export your data in a portable format, object to processing of your data, and withdraw consent at any time.

To exercise these rights, contact us at privacy@battlex.games. We will respond within 30 days. For EU residents, you may also lodge a complaint with your local data protection authority.`,
            },
            {
              title: '6. Third-Party Services',
              body: `BattleX integrates with: Supabase (database and authentication), Stripe (payment processing — we do not store card numbers), Vercel (hosting infrastructure), and optional social login providers (Google, Discord).

Each third-party service has its own privacy policy. We encourage you to review them.`,
            },
            {
              title: '7. Children\'s Privacy',
              body: `BattleX is not directed at children under 13. We do not knowingly collect personal data from children under 13. If you believe we have inadvertently collected such data, please contact us immediately at privacy@battlex.games and we will delete it promptly.`,
            },
            {
              title: '8. Changes to This Policy',
              body: `We may update this policy from time to time. We will notify registered users of material changes via email and in-platform notification at least 14 days before changes take effect. Continued use after the effective date constitutes acceptance.`,
            },
            {
              title: '9. Contact',
              body: `For privacy-related inquiries: privacy@battlex.games\nBattleX Gaming Platform, Dhaka, Bangladesh`,
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
