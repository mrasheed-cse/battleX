/**
 * General Leaderboard (Parking Jam etc.) — BattleX Gateway port 5000
 */
const GATEWAY = 'http://46.225.58.8:5000'
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function gw(method, path, body, auth) {
  const h = { 'Content-Type':'application/json' }
  if (auth) h['Authorization'] = auth
  const r = await fetch(`${GATEWAY}${path}`, {
    method, headers: h,
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await r.text()
  console.log(`[LB] ${method} ${path} → ${r.status}: ${text.slice(0,200)}`)
  try { return { ok: r.ok, status: r.status, data: JSON.parse(text) } }
  catch { return { ok: r.ok, status: r.status, data: text } }
}

function toArray(d) {
  if (Array.isArray(d))          return d
  if (Array.isArray(d?.data))    return d.data
  if (Array.isArray(d?.items))   return d.items
  if (Array.isArray(d?.scores))  return d.scores
  return []
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).set(CORS).end()
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v))

  try {
    if (req.method === 'GET') {
      const { game='parking-jam', limit='100', speedrun='false', view='leaderboard', playerName='' } = req.query
      const lim = Math.min(parseInt(limit)||100, 500)

      if (view==='player' && playerName) {
        const r = await gw('GET', `/api/v1/leaderboard/player/${encodeURIComponent(playerName)}?game=${encodeURIComponent(game)}`)
        return res.status(200).json({ leaderboard: toArray(r.data), count: toArray(r.data).length })
      }

      const qs = new URLSearchParams({ game, limit: String(lim), speedrun })
      const r = await gw('GET', `/api/v1/leaderboard?${qs}`)
      const entries = toArray(r.data)

      const ranked = entries.map((e,i) => ({
        rank:        i+1,
        player_name: e.playerName || e.player_name || e.name || 'Unknown',
        score:       e.score || 0,
        level:       e.level || 1,
        speedrun_time_ms: e.speedrunTimeMs || e.speedrun_time_ms || 0,
        submitted_at: e.submittedAt || e.submitted_at || null,
        ...e,
      }))
      return res.status(200).json({ leaderboard: ranked, count: ranked.length })
    }

    if (req.method === 'POST') {
      const { game, playerName, score, speedrunTimeMs, level, speedrunEnabled } = req.body
      if (!game || !playerName || score===undefined)
        return res.status(400).json({ error:'game, playerName, score required' })

      const body = {
        game:           String(game).slice(0,50),
        playerName:     String(playerName).slice(0,50),
        score:          Math.max(parseInt(score)||0, 0),
        speedrunTimeMs: speedrunTimeMs ? Math.max(parseInt(speedrunTimeMs)||0,0) : null,
        level:          Math.max(parseInt(level)||1, 1),
        speedrunEnabled: Boolean(speedrunEnabled),
        submittedAt:    new Date().toISOString(),
      }
      const r = await gw('POST', '/api/v1/leaderboard', body, req.headers.authorization)
      if (!r.ok) return res.status(r.status).json({ error:`Backend ${r.status}` })
      return res.status(201).json({ ok:true })
    }

    return res.status(405).json({ error:'Method not allowed' })
  } catch(e) {
    console.error('[LB]', e.message)
    return res.status(200).json({ leaderboard:[], count:0, error: e.message })
  }
}
