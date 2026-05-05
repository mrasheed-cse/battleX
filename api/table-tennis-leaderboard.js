/**
 * Table Tennis Leaderboard — BattleX Gateway port 5000
 */
const GATEWAY = 'http://46.225.58.8:5000'
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function extractEntries(data) {
  if (Array.isArray(data))        return data
  if (Array.isArray(data?.data))  return data.data
  if (Array.isArray(data?.items)) return data.items
  return []
}

function normalizeEntry(e) {
  return {
    id:             e.id,
    player_name:    e.playerName   || e.player_name   || 'Unknown',
    opponent_name:  e.opponentName || e.opponent_name  || 'AI',
    opponent_type:  e.opponentType || e.opponent_type  || 'ai',
    player_score:   e.playerScore  || e.player_score   || e.score || 0,
    opponent_score: e.opponentScore|| e.opponent_score || 0,
    won:            e.won          ?? false,
    duration_ms:    e.durationMs   || e.duration_ms    || 0,
    times_played:   e.timesPlayed  || e.times_played   || 1,
    total_points:   e.totalPoints  || e.total_points   || e.points || 0,
    submitted_at:   e.submittedAt  || e.submitted_at   || e.createdAt || null,
  }
}

async function gwFetch(method, path, body, authHeader) {
  const headers = { 'Content-Type': 'application/json' }
  if (authHeader) headers['Authorization'] = authHeader
  const r = await fetch(`${GATEWAY}${path}`, {
    method, headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await r.text()
  console.log(`[TT] ${method} ${path} → ${r.status}: ${text.slice(0,200)}`)
  try { return { ok: r.ok, status: r.status, data: JSON.parse(text) } }
  catch { return { ok: r.ok, status: r.status, data: text } }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).set(CORS).end()
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v))

  try {
    if (req.method === 'GET') {
      const { playerName='', limit='100', view='leaderboard' } = req.query
      const lim = Math.min(parseInt(limit)||100, 500)
      const auth = req.headers.authorization

      let url
      if (view === 'player' && playerName)
        url = `/api/v1/table-tennis/player/${encodeURIComponent(playerName)}?limit=${lim}`
      else if (view === 'stats' && playerName)
        url = `/api/v1/table-tennis/stats/${encodeURIComponent(playerName)}`
      else
        url = `/api/v1/table-tennis/leaderboard?limit=${lim}`

      const r = await gwFetch('GET', url, null, auth)
      const entries = extractEntries(r.data).map(normalizeEntry)
      return res.status(200).json({ entries, count: entries.length })
    }

    if (req.method === 'POST') {
      const { playerName, opponentName, opponentType,
              playerScore, opponentScore, won, durationMs,
              timesPlayed, totalPoints } = req.body

      if (!playerName) return res.status(400).json({ error:'playerName required' })

      const body = {
        playerName:    String(playerName).slice(0,50),
        opponentName:  String(opponentName  || 'CPU').slice(0,50),
        opponentType:  String(opponentType  || 'cpu').slice(0,20),
        playerScore:   Math.max(parseInt(playerScore)   ||0, 0),
        opponentScore: Math.max(parseInt(opponentScore) ||0, 0),
        won:           Boolean(won),
        durationMs:    Math.max(parseInt(durationMs)    ||0, 0),
        timesPlayed:   Math.max(parseInt(timesPlayed)   ||1, 1),
        totalPoints:   Math.max(parseInt(totalPoints)   ||0, 0),
        submittedAt:   new Date().toISOString(),
      }

      const auth = req.headers.authorization
      const r = await gwFetch('POST', '/api/v1/table-tennis', body, auth)
      if (!r.ok) return res.status(r.status).json({ error:`Backend ${r.status}` })
      return res.status(201).json({ ok:true, success:true })
    }

    return res.status(405).json({ error:'Method not allowed' })
  } catch(e) {
    console.error('[TT]', e.message)
    return res.status(200).json({ entries:[], count:0, error:e.message })
  }
}
