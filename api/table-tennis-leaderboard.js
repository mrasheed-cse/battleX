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
  // Try every possible response shape the backend might return
  if (Array.isArray(data))              return data
  if (Array.isArray(data?.data))        return data.data
  if (Array.isArray(data?.items))       return data.items
  if (Array.isArray(data?.results))     return data.results
  if (Array.isArray(data?.leaderboard)) return data.leaderboard
  if (Array.isArray(data?.scores))      return data.scores
  if (data?.data && typeof data.data === 'object') return [data.data]
  return []
}

function normalizeEntry(e) {
  // Support both camelCase and snake_case from backend
  // Output snake_case to match what the page template expects
  return {
    id:             e.id,
    player_name:    e.playerName   || e.player_name   || e.name         || 'Unknown',
    opponent_name:  e.opponentName || e.opponent_name  || e.opponent     || 'AI',
    opponent_type:  e.opponentType || e.opponent_type  || 'ai',
    player_score:   e.playerScore  || e.player_score   || e.score        || 0,
    opponent_score: e.opponentScore|| e.opponent_score || 0,
    won:            e.won          ?? (e.result === 'win') ?? false,
    duration_ms:    e.durationMs   || e.duration_ms    || e.duration     || 0,
    times_played:   e.timesPlayed  || e.times_played   || 1,
    total_points:   e.totalPoints  || e.total_points   || e.points       || 0,
    submitted_at:   e.submittedAt  || e.submitted_at   || e.createdAt    || e.created_at || e.playedAt || null,
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).set(CORS).end()
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v))

  try {
    if (req.method === 'GET') {
      const { playerName='', limit='100', view='leaderboard' } = req.query
      const lim = Math.min(parseInt(limit)||100, 500)

      let url = `${GATEWAY}/api/v1/table-tennis/leaderboard?limit=${lim}`
      if (view === 'player' && playerName)
        url = `${GATEWAY}/api/v1/table-tennis/player/${encodeURIComponent(playerName)}?limit=${lim}`
      if (view === 'stats' && playerName)
        url = `${GATEWAY}/api/v1/table-tennis/stats/${encodeURIComponent(playerName)}`

      const r    = await fetch(url, { headers: { 'Content-Type':'application/json' } })
      const text = await r.text()

      let raw
      try { raw = JSON.parse(text) } catch { raw = [] }

      // Log full shape so we can debug
      console.log('[TT] status:', r.status, 'shape:', JSON.stringify(raw).slice(0, 300))

      const entries = extractEntries(raw).map(normalizeEntry)
      return res.status(200).json({ entries, count: entries.length, _raw: raw })
    }

    if (req.method === 'POST') {
      const { playerName, opponentName, opponentType,
              playerScore, opponentScore, won, durationMs } = req.body
      if (!playerName) return res.status(400).json({ error:'playerName required' })

      const body = {
        playerName:    String(playerName).slice(0,50),
        opponentName:  String(opponentName  || 'AI').slice(0,50),
        opponentType:  String(opponentType  || 'ai').slice(0,20),
        playerScore:   Math.max(parseInt(playerScore)   ||0, 0),
        opponentScore: Math.max(parseInt(opponentScore) ||0, 0),
        won:           Boolean(won),
        durationMs:    Math.max(parseInt(durationMs)    ||0, 0),
        submittedAt:   new Date().toISOString(),
      }

      const r = await fetch(`${GATEWAY}/api/v1/table-tennis`, {
        method:  'POST',
        headers: { 'Content-Type':'application/json',
                   ...(req.headers.authorization ? {Authorization: req.headers.authorization} : {}) },
        body: JSON.stringify(body),
      })

      const text = await r.text()
      console.log('[TT POST] status:', r.status, text.slice(0,200))
      if (!r.ok) return res.status(r.status).json({ error:`Backend ${r.status}: ${text.slice(0,100)}` })
      return res.status(201).json({ ok: true, success: true })
    }

    return res.status(405).json({ error:'Method not allowed' })
  } catch(e) {
    console.error('[TT]', e.message)
    return res.status(200).json({ entries:[], count:0, error: e.message })
  }
}
