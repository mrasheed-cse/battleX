/**
 * Table Tennis Leaderboard — debug version
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

  try {
    const limit = Math.min(parseInt(req.query?.limit)||100, 500)
    const url   = `${GAME_SVC}/api/v1/table-tennis/leaderboard?limit=${limit}`

    console.log('[TT] calling:', url)
    const upstream = await fetch(url, {
      method:  'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    const text = await upstream.text()
    console.log('[TT] status:', upstream.status)
    console.log('[TT] body:', text.slice(0, 500))

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error:   `Backend returned ${upstream.status}`,
        details: text.slice(0, 300),
      })
    }

    let data
    try { data = JSON.parse(text) } catch { data = [] }

    // Normalize to array
    const arr = Array.isArray(data) ? data
              : Array.isArray(data?.data)  ? data.data
              : Array.isArray(data?.items) ? data.items
              : []

    return res.status(200).json({ entries: arr, count: arr.length, raw: data })

  } catch (e) {
    console.error('[TT] error:', e.message)
    return res.status(502).json({ error: e.message })
  }
}
