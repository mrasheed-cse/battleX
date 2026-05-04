/**
 * Snakes & Ladders Leaderboard — proxies to BattleX Game Service (port 5003)
 * GET  /api/snl-leaderboard?view=matches|rankings&limit=50&search=
 * POST /api/snl-leaderboard  { matchCode, playerCount, durationMs, results:[...] }
 */

const GAME_SVC = 'http://46.225.58.8:5003'
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
const POINTS_MAP = { 1:100, 2:90, 3:80, 4:70, 5:60, 6:50 }

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
    // ── GET ──────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { view = 'matches', limit = '50', search = '', period = 'alltime' } = req.query
      const lim = Math.min(parseInt(limit)||50, 200)

      if (view === 'rankings') {
        const r = await call('GET', `/api/v1/snl/leaderboard?limit=${lim * 4}`)
        if (!r.ok) return res.status(r.status).json(r.data)

        let entries = r.data?.data || r.data || []
        if (search) entries = entries.filter(x =>
          (x.playerName||'').toLowerCase().includes(search.toLowerCase()))

        // Aggregate per player
        const map = {}
        entries.forEach(e => {
          const name = e.playerName
          if (!name) return
          if (!map[name]) map[name] = {
            player_name: name, matches:0, wins:0, podiums:0,
            total_points:0, total_time_ms:0, total_score:0, best_position:99,
          }
          const p = map[name]
          p.matches++
          if (e.position === 1) p.wins++
          if (e.position <= 3) p.podiums++
          p.total_points  += POINTS_MAP[e.position] || 50
          p.total_time_ms += e.durationMs || 0
          p.total_score   += e.score || 0
          if (e.position < p.best_position) p.best_position = e.position
        })

        const rankings = Object.values(map).map(p => ({
          ...p,
          win_rate:    p.matches > 0 ? Math.round((p.wins/p.matches)*100) : 0,
          avg_time_ms: p.matches > 0 ? Math.round(p.total_time_ms/p.matches) : 0,
          avg_score:   p.matches > 0 ? Math.round(p.total_score/p.matches) : 0,
        })).sort((a,b) => b.total_points - a.total_points || b.wins - a.wins)

        return res.status(200).json({ rankings })
      }

      // matches view — get leaderboard entries and group by matchCode
      const r = await call('GET', `/api/v1/snl/leaderboard?limit=${lim * 8}`)
      if (!r.ok) return res.status(r.status).json(r.data)

      let entries = r.data?.data || r.data || []
      if (search) entries = entries.filter(x =>
        (x.playerName||'').toLowerCase().includes(search.toLowerCase()))

      // Group by matchId
      const matchMap = {}
      entries.forEach(e => {
        const mid = e.matchId || e.id
        if (!matchMap[mid]) matchMap[mid] = {
          match_id:      mid,
          short_id:      String(e.matchCode || mid).slice(-8).toUpperCase(),
          played_at:     e.playedAt || e.submittedAt,
          total_players: e.playerCount || 0,
          duration_ms:   e.durationMs || 0,
          players:       [],
        }
        matchMap[mid].players.push({
          id:          e.id,
          match_id:    mid,
          player_name: e.playerName,
          position:    e.position,
          score:       e.score || 0,
          points:      POINTS_MAP[e.position] || 50,
          duration_ms: e.durationMs || 0,
          played_at:   e.playedAt || e.submittedAt,
        })
        if (e.position === 1) matchMap[mid].duration_ms = e.durationMs || 0
      })

      const matches = Object.values(matchMap)
        .sort((a,b) => new Date(b.played_at) - new Date(a.played_at))
        .slice(0, lim)
        .map(m => ({ ...m, players: m.players.sort((a,b) => a.position - b.position) }))

      return res.status(200).json({ matches })
    }

    // ── POST ─────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { matchCode, playerCount, durationMs, results } = req.body
      if (!results || !Array.isArray(results) || results.length === 0)
        return res.status(400).json({ error: 'results array required' })

      const auth = req.headers.authorization

      // Step 1: create match — POST /api/v1/snl/matches
      const matchBody = {
        matchCode:   String(matchCode || `snl-${Date.now()}`).slice(0, 32),
        playerCount: Math.min(Math.max(parseInt(playerCount)||results.length, 1), 6),
        durationMs:  Math.max(parseInt(durationMs)||0, 0),
        playedAt:    new Date().toISOString(),
      }
      const matchRes = await call('POST', '/api/v1/snl/matches', matchBody, auth)
      if (!matchRes.ok) return res.status(matchRes.status).json(matchRes.data)

      const matchId = matchRes.data?.data?.id || matchRes.data?.id
      if (!matchId) return res.status(500).json({ error: 'Match creation failed' })

      // Step 2: post results — POST /api/v1/snl/results (array of SnlResult)
      const resultRows = results.map(r => ({
        matchId:     matchId,
        playerName:  String(r.playerName || 'Player').slice(0, 50),
        position:    Math.min(Math.max(parseInt(r.position)||6, 1), 6),
        score:       Math.max(parseInt(r.score)||0, 0),
        points:      POINTS_MAP[parseInt(r.position)] || 50,
        durationMs:  Math.max(parseInt(r.durationMs)||0, 0),
        submittedAt: new Date().toISOString(),
      }))

      const resultRes = await call('POST', '/api/v1/snl/results', resultRows, auth)
      return res.status(resultRes.ok ? 201 : resultRes.status).json(
        resultRes.ok ? { success: true, matchId, count: resultRows.length } : resultRes.data
      )
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (e) {
    console.error('[SNL LB]', e.message)
    return res.status(502).json({ error: e.message })
  }
}
