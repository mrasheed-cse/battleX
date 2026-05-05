/**
 * Ludo Leaderboard — BattleX Gateway port 5000
 * POST to /api/v1/ludo/leaderboard (LudoLeaderboard table) AND /api/v1/ludo/results/batch
 * GET from /api/v1/ludo/leaderboard
 */
const GATEWAY    = 'http://46.225.58.8:5000'
const POINTS_MAP = { 1:100, 2:75, 3:50, 4:25 }
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function gw(method, path, body) {
  const h = { 'Content-Type': 'application/json' }
  const r = await fetch(`${GATEWAY}${path}`, {
    method, headers: h,
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await r.text()
  console.log(`[LUDO] ${method} ${path} → ${r.status}: ${text.slice(0,200)}`)
  try { return { ok: r.ok, status: r.status, data: JSON.parse(text) } }
  catch { return { ok: r.ok, status: r.status, data: text } }
}

function toArray(d) {
  if (Array.isArray(d))        return d
  if (Array.isArray(d?.data))  return d.data
  if (Array.isArray(d?.items)) return d.items
  return []
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).set(CORS).end()
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v))

  try {
    // ── POST — save to BOTH leaderboard table AND results table ──────────────
    if (req.method === 'POST') {
      const { matchId, results, totalPlayers } = req.body
      if (!matchId || !Array.isArray(results) || !results.length)
        return res.status(400).json({ error: 'matchId and results[] required' })

      const playedAt = new Date().toISOString()
      let savedCount = 0

      // POST all to /api/v1/ludo/leaderboard (one per player)
      for (const r of results) {
        const position = Math.min(Math.max(parseInt(r.position)||1,1),4)
        const lbBody = {
          matchId,
          playerName:   String(r.playerName || r.color || 'Unknown').slice(0,50),
          position,
          color:        r.color || null,
          durationSecs: Math.round((parseInt(r.durationMs)||0) / 1000),
          totalPlayers: parseInt(totalPlayers) || results.length,
          playedAt,
        }
        await gw('POST', '/api/v1/ludo/leaderboard', lbBody)
        savedCount++
      }

      // Also POST batch to /api/v1/ludo/results/batch to update player stats
      const batchBody = results.map(r => ({
        matchId,
        playerName:   String(r.playerName || r.color || 'Unknown').slice(0,50),
        position:     Math.min(Math.max(parseInt(r.position)||1,1),4),
        color:        r.color || null,
        points:       POINTS_MAP[Math.min(Math.max(parseInt(r.position)||1,1),4)] || 10,
        durationMs:   Math.max(0, parseInt(r.durationMs)||0),
        totalPlayers: parseInt(totalPlayers) || results.length,
        playedAt,
      }))
      const batchRes = await gw('POST', '/api/v1/ludo/results/batch', batchBody)
      console.log('[LUDO] batch result:', batchRes.status, JSON.stringify(batchRes.data).slice(0,100))

      return res.status(201).json({ ok: true, count: savedCount })
    }

    // ── GET ───────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { view = 'matches', limit = '50', search = '' } = req.query
      const lim = Math.min(parseInt(limit)||50, 500)

      const r = await gw('GET', `/api/v1/ludo/leaderboard?limit=${lim * 10}`)
      let raw = toArray(r.data)
      console.log('[LUDO GET] entries:', raw.length)

      const entries = search
        ? raw.filter(e => (e.playerName||'').toLowerCase().includes(search.toLowerCase()))
        : raw

      if (view === 'rankings') {
        // Deduplicate: keep only one entry per player per match (highest id)
        const seen = {}
        const deduped = entries.filter(e => {
          const key = `${e.matchId||e.match_id}__${e.playerName}`
          if (!seen[key] || e.id > seen[key]) { seen[key] = e.id; return true }
          return false
        })
        const map = {}
        deduped.forEach(e => {
          const name = e.playerName || e.player_name
          if (!name || name === '...') return
          if (!map[name]) map[name] = {
            player_name: name, matches:0, wins:0, podiums:0,
            total_points:0, total_time_ms:0, best_position:99,
          }
          const p = map[name]
          p.matches++
          if (e.position===1) p.wins++
          if (e.position<=3)  p.podiums++
          p.total_points  += POINTS_MAP[e.position] || 10
          p.total_time_ms += (e.durationSecs||0)*1000
          if (e.position < p.best_position) p.best_position = e.position
        })
        const rankings = Object.values(map)
          .map(p => ({
            ...p,
            win_rate:    p.matches>0 ? Math.round((p.wins/p.matches)*100) : 0,
            avg_time_ms: p.matches>0 ? Math.round(p.total_time_ms/p.matches) : 0,
          }))
          .sort((a,b) => b.total_points-a.total_points||b.wins-a.wins)
        return res.status(200).json({ rankings })
      }

      const matchMap = {}
      entries.forEach(e => {
        const mid = e.matchId || e.match_id
        if (!mid) return
        if (!matchMap[mid]) matchMap[mid] = {
          match_id:      mid,
          short_id:      String(mid).slice(-8).toUpperCase(),
          played_at:     e.playedAt || e.played_at,
          total_players: e.totalPlayers || 0,
          duration_ms:   (e.durationSecs||0)*1000,
          players:       {},   // keyed by position to deduplicate
        }
        const pos = e.position || 0
        // Only keep latest entry per position (highest id = latest)
        const existing = matchMap[mid].players[pos]
        if (!existing || (e.id > existing.id)) {
          matchMap[mid].players[pos] = {
            id:          e.id,
            match_id:    mid,
            player_name: e.playerName || 'Unknown',
            position:    pos,
            color:       e.color      || null,
            points:      POINTS_MAP[pos] || 10,
            duration_ms: (e.durationSecs||0)*1000,
            played_at:   e.playedAt   || e.played_at,
          }
        }
      })

      const matches = Object.values(matchMap)
        .sort((a,b) => new Date(b.played_at)-new Date(a.played_at))
        .slice(0, lim)
        .map(m => ({ ...m, players: Object.values(m.players).sort((a,b) => a.position-b.position) }))
      return res.status(200).json({ matches })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch(e) {
    console.error('[LUDO LB]', e.message)
    return res.status(200).json({ matches:[], rankings:[], error: e.message })
  }
}
