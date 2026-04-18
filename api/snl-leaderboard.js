/**
 * BattleX Snakes & Ladders Leaderboard API
 *
 * POST /api/snl-leaderboard
 *   { matchCode, playerCount, durationMs,
 *     results: [{ playerName, position, score, durationMs }] }
 *
 * GET  /api/snl-leaderboard?view=details&period=alltime&limit=50
 * GET  /api/snl-leaderboard?view=summary&period=alltime&limit=50
 */

const SUPABASE_URL      = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

const POINTS_MAP = { 1:100, 2:90, 3:80, 4:70, 5:60, 6:50 }

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).set(CORS).end()
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
  try {
    if (req.method === 'GET')  return await getLeaderboard(req, res)
    if (req.method === 'POST') return await submitMatch(req, res)
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[SNL API]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── GET ───────────────────────────────────────────────────────────────────────
async function getLeaderboard(req, res) {
  const {
    view   = 'summary',   // 'details' | 'summary'
    period = 'alltime',
    limit  = '50',
  } = req.query

  const lim = Math.min(parseInt(limit) || 50, 200)

  let dateFilter = ''
  if (period === 'weekly') {
    dateFilter = `&submitted_at=gte.${new Date(Date.now() - 7*24*60*60*1000).toISOString()}`
  } else if (period === 'daily') {
    dateFilter = `&submitted_at=gte.${new Date(Date.now() - 24*60*60*1000).toISOString()}`
  }

  if (view === 'details') {
    // Details: all match results joined with match info
    const url = `${SUPABASE_URL}/rest/v1/snl_results` +
      `?select=id,player_name,position,score,points,duration_ms,submitted_at,match_id,snl_matches(match_code,player_count,played_at)` +
      `&order=submitted_at.desc` +
      dateFilter +
      `&limit=${lim}`
    const data = await supabaseFetch('GET', url)
    return res.status(200).json({ view, period, count: data.length, entries: data })
  }

  // Summary: aggregate per player_name using RPC-style query
  // Fetch all results and aggregate in JS
  const url = `${SUPABASE_URL}/rest/v1/snl_results` +
    `?select=player_name,position,score,points,duration_ms,submitted_at` +
    `&order=submitted_at.desc` +
    dateFilter +
    `&limit=5000`

  const data = await supabaseFetch('GET', url)

  // Aggregate per player
  const map = {}
  for (const row of data) {
    const n = row.player_name
    if (!map[n]) map[n] = { player_name: n, times_played: 0, total_score: 0, total_time_ms: 0, total_points: 0 }
    map[n].times_played++
    map[n].total_score    += row.score    || 0
    map[n].total_time_ms  += row.duration_ms || 0
    map[n].total_points   += row.points   || 0
  }

  const summary = Object.values(map)
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, lim)
    .map((r, i) => ({ rank: i + 1, ...r }))

  return res.status(200).json({ view, period, count: summary.length, entries: summary })
}

// ── POST ──────────────────────────────────────────────────────────────────────
async function submitMatch(req, res) {
  const { matchCode, playerCount, durationMs, results } = req.body

  if (!results || !Array.isArray(results) || results.length === 0)
    return res.status(400).json({ error: 'results array required' })

  // Create match record
  const matchRow = {
    match_code:   (matchCode || `local-${Date.now()}`).slice(0, 32),
    player_count: Math.min(Math.max(parseInt(playerCount) || results.length, 1), 6),
    duration_ms:  Math.max(parseInt(durationMs) || 0, 0),
    played_at:    new Date().toISOString(),
  }

  console.log('[SNL] Inserting match:', JSON.stringify(matchRow))
  const matchInsert = await supabaseFetch(
    'POST', `${SUPABASE_URL}/rest/v1/snl_matches`, matchRow
  )
  const matchId = Array.isArray(matchInsert) ? matchInsert[0]?.id : matchInsert?.id
  if (!matchId) return res.status(500).json({ error: 'Match insert failed' })

  // Insert each player result
  const resultRows = results.map(r => ({
    match_id:    matchId,
    player_name: String(r.playerName || 'Player').trim().slice(0, 24),
    position:    Math.min(Math.max(parseInt(r.position) || 6, 1), 6),
    score:       Math.max(parseInt(r.score) || 0, 0),
    points:      POINTS_MAP[parseInt(r.position)] || 50,
    duration_ms: Math.max(parseInt(r.durationMs) || 0, 0),
    submitted_at: new Date().toISOString(),
  }))

  console.log('[SNL] Inserting results:', JSON.stringify(resultRows))
  await supabaseFetch('POST', `${SUPABASE_URL}/rest/v1/snl_results`, resultRows)

  return res.status(201).json({ success: true, matchId, count: resultRows.length })
}

// ── Supabase helper ───────────────────────────────────────────────────────────
async function supabaseFetch(method, url, body) {
  const opts = {
    method,
    headers: {
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        method === 'POST' ? 'return=representation' : '',
    },
  }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(url, opts)
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`)
  return r.json().catch(() => [])
}
