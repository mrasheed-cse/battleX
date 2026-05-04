/**
 * SNL Leaderboard — BattleX Gateway port 5000
 */
const GATEWAY    = 'http://46.225.58.8:5000'
const POINTS_MAP = { 1:100, 2:90, 3:80, 4:70, 5:60, 6:50 }
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
  console.log(`[SNL] ${method} ${path} → ${r.status}: ${text.slice(0,200)}`)
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
    // ── POST — save match ────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { matchCode, playerCount, durationMs, results } = req.body
      if (!results || !Array.isArray(results) || !results.length)
        return res.status(400).json({ error:'results[] required' })

      const auth = req.headers.authorization

      // Step 1: create match
      const matchBody = {
        matchCode:   String(matchCode || `snl-${Date.now()}`).slice(0,32),
        playerCount: Math.min(Math.max(parseInt(playerCount)||results.length, 1), 6),
        durationMs:  Math.max(parseInt(durationMs)||0, 0),
        playedAt:    new Date().toISOString(),
      }
      const mRes = await gw('POST', '/api/v1/snl/matches', matchBody, auth)
      if (!mRes.ok) return res.status(mRes.status).json({ error:`Match create failed ${mRes.status}`, detail: mRes.data })

      const matchId = mRes.data?.data?.id || mRes.data?.id
      if (!matchId) return res.status(500).json({ error:'No matchId returned', detail: mRes.data })

      // Step 2: post results
      const resultRows = results.map(r => ({
        matchId,
        playerName:  String(r.playerName || 'Player').slice(0,50),
        position:    Math.min(Math.max(parseInt(r.position)||6, 1), 6),
        score:       Math.max(parseInt(r.score)||0, 0),
        points:      POINTS_MAP[parseInt(r.position)] || 50,
        durationMs:  Math.max(parseInt(r.durationMs)||0, 0),
        submittedAt: new Date().toISOString(),
      }))

      const rRes = await gw('POST', '/api/v1/snl/results', resultRows, auth)
      if (!rRes.ok) return res.status(rRes.status).json({ error:`Results post failed ${rRes.status}` })
      return res.status(201).json({ success:true, matchId, count: resultRows.length })
    }

    // ── GET ──────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { view='matches', limit='50', search='' } = req.query
      const lim = Math.min(parseInt(limit)||50, 200)

      const r = await gw('GET', `/api/v1/snl/leaderboard?limit=${lim * 6}`)
      if (!r.ok) return res.status(200).json(view==='rankings' ? { rankings:[] } : { matches:[] })

      const raw = toArray(r.data)
      const entries = search
        ? raw.filter(e => (e.playerName||'').toLowerCase().includes(search.toLowerCase()))
        : raw

      if (view === 'rankings') {
        const map = {}
        entries.forEach(e => {
          const name = e.playerName || e.player_name
          if (!name) return
          if (!map[name]) map[name] = {
            player_name:name, matches:0, wins:0, podiums:0,
            total_points:0, total_time_ms:0, total_score:0, best_position:99,
          }
          const p = map[name]
          p.matches++
          if (e.position===1) p.wins++
          if (e.position<=3)  p.podiums++
          p.total_points  += e.points || POINTS_MAP[e.position] || 50
          p.total_time_ms += e.durationMs || e.duration_ms || 0
          p.total_score   += e.score || 0
          if (e.position < p.best_position) p.best_position = e.position
        })
        const rankings = Object.values(map).map(p => ({
          ...p,
          win_rate:    p.matches>0 ? Math.round((p.wins/p.matches)*100) : 0,
          avg_time_ms: p.matches>0 ? Math.round(p.total_time_ms/p.matches) : 0,
          avg_score:   p.matches>0 ? Math.round(p.total_score/p.matches) : 0,
        })).sort((a,b) => b.total_points-a.total_points || b.wins-a.wins)
        return res.status(200).json({ rankings })
      }

      // matches view — group by matchId
      const matchMap = {}
      entries.forEach(e => {
        const mid = e.matchId || e.match_id
        if (!mid) return
        if (!matchMap[mid]) matchMap[mid] = {
          match_id: mid, short_id: String(mid).slice(-8).toUpperCase(),
          played_at: e.playedAt||e.played_at||e.submittedAt,
          total_players: e.totalPlayers||e.player_count||0,
          duration_ms: e.durationMs||e.duration_ms||0, players:[],
        }
        matchMap[mid].players.push({
          id: e.id, match_id: mid,
          player_name: e.playerName||e.player_name||'Unknown',
          position: e.position||0, score: e.score||0,
          points: e.points||POINTS_MAP[e.position]||50,
          duration_ms: e.durationMs||e.duration_ms||0,
          played_at: e.playedAt||e.played_at||e.submittedAt,
        })
      })

      const matches = Object.values(matchMap)
        .sort((a,b) => new Date(b.played_at)-new Date(a.played_at))
        .slice(0, lim)
        .map(m => ({ ...m, players: m.players.sort((a,b) => a.position-b.position) }))
      return res.status(200).json({ matches })
    }

    return res.status(405).json({ error:'Method not allowed' })
  } catch(e) {
    console.error('[SNL LB]', e.message)
    return res.status(200).json({ matches:[], rankings:[], error: e.message })
  }
}
