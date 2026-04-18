/**
 * BattleX — FCM Token Registration API
 * Saves Firebase Cloud Messaging tokens to Supabase
 * so you can send targeted push notifications to players.
 *
 * POST /api/fcm-token  { token: "...", timestamp: "..." }
 *
 * Supabase setup — run this SQL first:
 *   CREATE TABLE fcm_tokens (
 *     id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     token      text UNIQUE NOT NULL,
 *     created_at timestamptz DEFAULT now()
 *   );
 *   ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "Insert tokens" ON fcm_tokens FOR INSERT WITH CHECK (true);
 */

const SUPABASE_URL     = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' })

  const { token } = req.body || {}
  if (!token || typeof token !== 'string' || token.length < 10) {
    return res.status(400).json({ error: 'Invalid token' })
  }

  try {
    // Upsert — don't error if token already exists
    const response = await fetch(`${SUPABASE_URL}/rest/v1/fcm_tokens`, {
      method:  'POST',
      headers: {
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'resolution=ignore-duplicates',
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok && response.status !== 409) {
      throw new Error(`Supabase error ${response.status}`)
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[FCM Token API]', err)
    // Non-critical — don't expose error to client
    return res.status(200).json({ success: false })
  }
}
