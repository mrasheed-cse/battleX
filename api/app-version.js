/**
 * BattleX — App Version API
 * Used by the Android Capacitor app for OTA update checking.
 * 
 * GET /api/app-version
 * Returns the current app version so the Android app can compare
 * against its bundled version and prompt for updates.
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  return res.status(200).json({
    version:     '1.0.0',          // bump this to trigger in-app update prompts
    buildNumber: 1,
    releaseDate: '2026-03-30',
    minRequired: '1.0.0',          // minimum version before force-update
    updateUrl:   'https://play.google.com/store/apps/details?id=com.battlex.games',
    changelog: [
      'Parking Jam added with 4 levels',
      'Supabase leaderboard live',
      'Ad system integrated across all games',
      'Performance improvements',
    ],
    maintenance: false,            // set true to show maintenance screen
    baseUrl:     'https://battle-x.vercel.app',
  })
}
