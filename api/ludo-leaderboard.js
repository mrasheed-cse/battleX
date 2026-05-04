/**
 * Ludo Leaderboard — proxies to BattleX Game Service (port 5003)
 * GET  /api/ludo-leaderboard?view=matches|rankings&limit=50&search=
 * POST /api/ludo-leaderboard  { matchId, results:[{playerName,position,color,durationMs}], totalPlayers }
 */

const GAME_SVC = 'http://46.225.58.8:5000'
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const POINTS_MAP = { 1:100, 2:75, 3:50, 4:25 }

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
    // ── GET ─────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { view = 'matches', limit = '50', search = '' } = req.query
      const lim = Math.min(parseInt(limit)||50, 200)

      if (view === 'rankings') {
        // GET /api/v1/ludo/leaderboard?limit=N
        const r = await call('GET', `/api/v1/ludo/leaderboard?limit=${lim}`)
        if (!r.ok) return res.status(r.status).json(r.data)

        // Shape into rankings format frontend expects
        let rankings = (r.data?.data || r.data || [])
        if (search) {
          rankings = rankings.filter(x =>
            (x.playerName||'').toLowerCase().includes(search.toLowerCase())
          )
        }

        // Aggregate per player from raw leaderboard entries
        const map = {}
        rankings.forEach(entry => {
          const name = entry.playerName
          if (!name) return
          if (!map[name]) map[name] = {
            player_name: name, matches:0, wins:0, podiums:0,
            total_points:0, total_time_ms:0, best_position:99,
          }
          const p = map[name]
          p.matches++
          if (entry.position === 1) p.wins++
          if (entry.position <= 3) p.podiums++
          p.total_points += POINTS_MAP[entry.position] || 10
          p.total_time_ms += (entry.durationSecs||0) * 1000
          if (entry.position < p.best_position) p.best_position = entry.position
        })

        const result = Object.values(map).map(p => ({
          ...p,
          win_rate:    p.matches > 0 ? Math.round((p.wins/p.matches)*100) : 0,
          avg_time_ms: p.matches > 0 ? Math.round(p.total_time_ms/p.matches) : 0,
        })).sort((a,b) => b.total_points - a.total_points || b.wins - a.wins)

        return res.status(200).json({ rankings: result })
      }

      // matches view — GET /api/v1/ludo/leaderboard?limit=N
      const r = await call('GET', `/api/v1/ludo/leaderboard?limit=${lim * 8}`)
      if (!r.ok) return res.status(r.status).json(r.data)

      let entries = r.data?.data || r.data || []
      if (search) {
        entries = entries.filter(x =>
          (x.playerName||'').toLowerCase().includes(search.toLowerCase())
        )
      }

      // Group by matchId
      const matchMap = {}
      entries.forEach(e => {
        const mid = e.matchId
        if (!mid) return
        if (!matchMap[mid]) matchMap[mid] = {
          match_id:      mid,
          short_id:      String(mid).slice(-8).toUpperCase(),
          played_at:     e.playedAt,
          total_players: e.totalPlayers || 0,
          duration_ms:   (e.durationSecs||0) * 1000,
          players:       [],
        }
        matchMap[mid].players.push({
          id:          e.id,
          match_id:    mid,
          player_name: e.playerName || e.player_name || 'Unknown',
          position:    e.position || 0,
          color:       e.color || null,
          points:      e.points || POINTS_MAP[e.position] || 10,
          duration_ms: e.durationMs || e.duration_ms || (e.durationSecs||0)*1000,
          played_at:   e.playedAt,
        })
      })

      const matches = Object.values(matchMap)
        .sort((a,b) => new Date(b.played_at) - new Date(a.played_at))
        .slice(0, lim)
        .map(m => ({ ...m, players: m.players.sort((a,b) => a.position - b.position) }))

      return res.status(200).json({ matches })
    }

    // ── POST ─────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { matchId, results, totalPlayers } = req.body
      if (!matchId || !Array.isArray(results) || results.length === 0)
        return res.status(400).json({ error: 'matchId and results[] required' })

      // POST /api/v1/ludo/results/batch — array of LudoResult
      const batch = results.map(r => ({
        matchId,
        playerName:   String(r.playerName || r.color || 'Unknown').slice(0, 50),
        position:     Math.min(Math.max(parseInt(r.position)||1, 1), 4),
        color:        r.color || null,
        points:       POINTS_MAP[parseInt(r.position)] || 10,
        durationMs:   Math.max(0, parseInt(r.durationMs)||0),
        totalPlayers: parseInt(totalPlayers) || results.length,
        playedAt:     new Date().toISOString(),
      }))

      const auth = req.headers.authorization
      const r = await call('POST', '/api/v1/ludo/results/batch', batch, auth)
      return res.status(r.ok ? 201 : r.status).json(r.ok ? { ok: true, count: batch.length } : r.data)
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (e) {
    console.error('[LUDO LB]', e.message)
    return res.status(502).json({ error: e.message })
  }
}
