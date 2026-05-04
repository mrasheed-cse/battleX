/**
 * General Leaderboard (Parking Jam etc.) — proxies to BattleX Game Service (port 5003)
 * GET  /api/leaderboard?game=parking-jam&limit=100&speedrun=false&period=weekly
 * POST /api/leaderboard  { game, playerName, score, speedrunTimeMs, level, speedrunEnabled }
 * GET  /api/leaderboard?view=player&playerName=X&game=parking-jam
 */

const GAME_SVC = 'http://46.225.58.8:5003'
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function call(method, path, body = null, authHeader = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (authHeader) headers['Authorization'] = authHeader
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(`${GAME_SVC}${path}`, opts)
  const text = await r.text()
  try { return { ok: r.ok, status: r.status, data: JSON.parse(text) } }
  catch { return { ok: r.ok, status: r.status, data: text } }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).set(CORS).end()
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v))

  try {
    if (req.method === 'GET') {
      const {
        view = 'leaderboard',
        game = 'parking-jam',
        playerName = '',
        limit = '100',
        speedrun = 'false',
      } = req.query
      const lim = Math.min(parseInt(limit)||100, 500)

      // Player-specific scores
      if (view === 'player' && playerName) {
        const r = await call('GET',
          `/api/v1/leaderboard/player/${encodeURIComponent(playerName)}?game=${encodeURIComponent(game)}`)
        return res.status(r.ok ? 200 : r.status).json(r.data)
      }

      // GET /api/v1/leaderboard?game=&limit=&speedrun=
      const qs = new URLSearchParams({
        game,
        limit: String(lim),
        speedrun: speedrun === 'true' ? 'true' : 'false',
      })
      const r = await call('GET', `/api/v1/leaderboard?${qs}`)
      if (!r.ok) return res.status(r.status).json(r.data)

      // Add rank numbers to response
      const entries = r.data?.data || r.data || []
      const ranked  = Array.isArray(entries)
        ? entries.map((e, i) => ({ rank: i + 1, ...e }))
        : entries
      return res.status(200).json({ leaderboard: ranked, count: Array.isArray(ranked) ? ranked.length : 0 })
    }

    if (req.method === 'POST') {
      const { game, playerName, score, speedrunTimeMs, level, speedrunEnabled } = req.body
      if (!game || !playerName || score === undefined)
        return res.status(400).json({ error: 'game, playerName, score required' })

      const body = {
        game:            String(game).slice(0, 50),
        playerName:      String(playerName).slice(0, 50),
        score:           Math.max(parseInt(score)||0, 0),
        speedrunTimeMs:  speedrunTimeMs ? Math.max(parseInt(speedrunTimeMs)||0, 0) : null,
        level:           Math.max(parseInt(level)||1, 1),
        speedrunEnabled: Boolean(speedrunEnabled),
        submittedAt:     new Date().toISOString(),
      }

      const auth = req.headers.authorization
      const r = await call('POST', '/api/v1/leaderboard', body, auth)
      return res.status(r.ok ? 201 : r.status).json(r.ok ? { ok: true } : r.data)
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (e) {
    console.error('[LB]', e.message)
    return res.status(502).json({ error: e.message })
  }
}
