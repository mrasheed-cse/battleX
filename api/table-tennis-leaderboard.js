/**
 * BattleX Table Tennis Leaderboard API
 * Vercel serverless function
 *
 * GET  /api/table-tennis-leaderboard?period=alltime&opponent=all&limit=100
 * POST /api/table-tennis-leaderboard  { playerName, opponentName, opponentType,
 *                                       playerScore, opponentScore, won,
 *                                       durationMs, timesPlayed, totalPoints }
 */

const SUPABASE_URL     = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

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
    if (req.method === 'POST') return await submitScore(req, res)
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[TT Leaderboard API]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── GET ───────────────────────────────────────────────────────────────────────
async function getLeaderboard(req, res) {
  const {
    period   = 'alltime',   // 'alltime' | 'weekly' | 'daily'
    opponent = 'all',       // 'all' | 'cpu' | 'online'
    limit    = '100',
  } = req.query

  // Date filter
  let dateFilter = ''
  if (period === 'weekly') {
    const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    dateFilter = `&submitted_at=gte.${d}`
  } else if (period === 'daily') {
    const d = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    dateFilter = `&submitted_at=gte.${d}`
  }

  // Opponent type filter
  const opponentFilter = opponent !== 'all' ? `&opponent_type=eq.${opponent}` : ''

  const url = `${SUPABASE_URL}/rest/v1/table_tennis_scores` +
    `?order=submitted_at.desc` +
    dateFilter +
    opponentFilter +
    `&limit=${Math.min(parseInt(limit), 200)}` +
    `&select=id,player_name,opponent_name,opponent_type,player_score,` +
    `opponent_score,won,duration_ms,times_played,total_points,submitted_at`

  const data = await supabaseFetch('GET', url)
  const ranked = data.map((row, i) => ({ rank: i + 1, ...row }))

  return res.status(200).json({
    period,
    opponent,
    count: ranked.length,
    entries: ranked,
    updatedAt: new Date().toISOString(),
  })
}

// ── POST ──────────────────────────────────────────────────────────────────────
async function submitScore(req, res) {
  const {
    playerName,
    opponentName  = 'CPU',
    opponentType  = 'cpu',
    playerScore   = 0,
    opponentScore = 0,
    won           = false,
    durationMs    = 0,
    timesPlayed   = 1,
    totalPoints   = 0,
  } = req.body

  if (!playerName) return res.status(400).json({ error: 'playerName required' })

  const name = String(playerName).trim().slice(0, 24).replace(/[<>'"]/g, '')
  if (name.length < 1) return res.status(400).json({ error: 'Invalid player name' })

  // Anti-cheat — basic sanity checks
  if (playerScore < 0 || playerScore > 30)
    return res.status(400).json({ error: 'Invalid score' })
  if (!['cpu', 'online'].includes(opponentType))
    return res.status(400).json({ error: 'Invalid opponent type' })
  if (durationMs < 0 || durationMs > 3_600_000)
    return res.status(400).json({ error: 'Invalid duration' })

  // IP hash for duplicate detection
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown'
  const ipHash = await hashString(ip)

  // Duplicate check — same IP within 30 seconds
  const recentUrl = `${SUPABASE_URL}/rest/v1/table_tennis_scores` +
    `?ip_hash=eq.${ipHash}` +
    `&submitted_at=gte.${new Date(Date.now() - 30_000).toISOString()}` +
    `&limit=1`
  const recent = await supabaseFetch('GET', recentUrl)
  if (recent.length > 0)
    return res.status(429).json({ error: 'Please wait before submitting again' })

  const row = {
    player_name:    name,
    opponent_name:  String(opponentName).trim().slice(0, 24) || 'CPU',
    opponent_type:  opponentType,
    player_score:   Math.round(playerScore),
    opponent_score: Math.round(opponentScore),
    won:            !!won,
    duration_ms:    Math.round(durationMs),
    times_played:   Math.max(1, Math.round(timesPlayed)),
    total_points:   Math.max(0, Math.round(totalPoints)),
    ip_hash:        ipHash,
    submitted_at:   new Date().toISOString(),
  }

  await supabaseFetch('POST', `${SUPABASE_URL}/rest/v1/table_tennis_scores`, row)

  // Get player's rank (by total wins)
  const rankUrl = `${SUPABASE_URL}/rest/v1/table_tennis_scores` +
    `?player_name=eq.${encodeURIComponent(name)}&won=eq.true&select=count&limit=1`
  const rankData = await supabaseFetch('GET', rankUrl)
  const totalWins = rankData.length

  return res.status(201).json({
    success:   true,
    playerName: name,
    won:       !!won,
    totalWins,
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────
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
  if (!r.ok) {
    const text = await r.text()
    throw new Error(`Supabase ${r.status}: ${text}`)
  }
  return r.json().catch(() => [])
}

async function hashString(str) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
  }
  let h = 0
  for (const c of str) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0
  return Math.abs(h).toString(16)
}
