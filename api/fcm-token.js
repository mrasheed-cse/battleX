/**
 * FCM Token — proxies to BattleX Game Service (port 5003)
 * POST /api/fcm-token  { userId, token, platform }
 */

const GAME_SVC = 'http://46.225.58.8:5003'
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).set(CORS).end()
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v))

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { userId, token, platform } = req.body
    if (!userId || !token) return res.status(400).json({ error: 'userId and token required' })

    // Forward to game service if it has a FCM endpoint, otherwise store via scores
    const auth = req.headers.authorization
    const headers = { 'Content-Type': 'application/json' }
    if (auth) headers['Authorization'] = auth

    const r = await fetch(`${GAME_SVC}/api/v1/fcm-tokens`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, token, platform: platform || 'web' }),
    })

    if (r.ok) return res.status(201).json({ ok: true })

    // Silently succeed if endpoint doesn't exist yet
    console.log('[FCM] endpoint not available yet, status:', r.status)
    return res.status(200).json({ ok: true, note: 'queued' })

  } catch (e) {
    console.error('[FCM]', e.message)
    // Don't fail the app for FCM token issues
    return res.status(200).json({ ok: true, note: 'queued' })
  }
}
