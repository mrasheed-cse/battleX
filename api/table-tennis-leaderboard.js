/**
 * Table Tennis Leaderboard — proxies to BattleX Game Service (port 5003)
 */

const GAME_SVC = 'http://46.225.58.8:5000'
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function extractArray(data) {
  if (Array.isArray(data))        return data
  if (Array.isArray(data?.data))  return data.data
  if (Array.isArray(data?.items)) return data.items
  if (data?.data !== undefined)   return [data.data].filter(Boolean)
  return []
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).set(CORS).end()
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v))

  try {
    if (req.method === 'GET') {
      const { playerName = '', limit = '100', view = 'leaderboard' } = req.query
      const lim = Math.min(parseInt(limit)||100, 500)

      let endpoint = `/api/v1/table-tennis/leaderboard?limit=${lim}`
      if (view === 'player' && playerName)
        endpoint = `/api/v1/table-tennis/player/${encodeURIComponent(playerName)}?limit=${lim}`
      if (view === 'stats' && playerName)
        endpoint = `/api/v1/table-tennis/stats/${encodeURIComponent(playerName)}`

      const upstream = await fetch(`${GAME_SVC}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const text = await upstream.text()
      let data
      try { data = JSON.parse(text) } catch { data = [] }

      if (!upstream.ok) {
        // Return empty entries instead of error so UI shows "no data" not "failed"
        console.error(`[TT] backend ${upstream.status} for ${endpoint}: ${text.slice(0,200)}`)
        return res.status(200).json({ entries: [], count: 0, backendStatus: upstream.status })
      }

      const arr = extractArray(data)
      return res.status(200).json({ entries: arr, count: arr.length })
    }

    if (req.method === 'POST') {
      const {
        playerName, opponentName, opponentType,
        playerScore, opponentScore, won, durationMs,
      } = req.body
      if (!playerName) return res.status(400).json({ error: 'playerName required' })

      const body = {
        playerName:    String(playerName).slice(0, 50),
        opponentName:  String(opponentName  || 'AI').slice(0, 50),
        opponentType:  String(opponentType  || 'ai').slice(0, 20),
        playerScore:   Math.max(parseInt(playerScore)   || 0, 0),
        opponentScore: Math.max(parseInt(opponentScore) || 0, 0),
        won:           Boolean(won),
        durationMs:    Math.max(parseInt(durationMs)    || 0, 0),
        submittedAt:   new Date().toISOString(),
      }

      const upstream = await fetch(`${GAME_SVC}/api/v1/table-tennis`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json',
                   ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}) },
        body: JSON.stringify(body),
      })

      if (!upstream.ok) {
        const text = await upstream.text()
        console.error(`[TT POST] backend ${upstream.status}: ${text.slice(0,200)}`)
        return res.status(upstream.status).json({ error: `Backend ${upstream.status}` })
      }
      return res.status(201).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (e) {
    console.error('[TT] exception:', e.message)
    // Return empty instead of error so page shows "no data" gracefully
    return res.status(200).json({ entries: [], count: 0, error: e.message })
  }
}
