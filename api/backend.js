/**
 * BattleX Backend Proxy
 * Route: /api/backend?path=identity/api/v1/auth/login
 *
 * Maps service names to internal ports:
 *   identity → :5001
 *   player   → :5002
 *   game     → :5003
 *   wallet   → :5004
 */

const SERVICES = {
  identity: 'http://46.225.58.8:5001',
  player:   'http://46.225.58.8:5002',
  game:     'http://46.225.58.8:5003',
  wallet:   'http://46.225.58.8:5004',
}

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function setCORS(res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
}

export default async function handler(req, res) {
  setCORS(res)

  if (req.method === 'OPTIONS') return res.status(200).end()

  // Extract path from query: ?path=identity/api/v1/auth/login
  const rawPath = req.query?.path || ''
  const pathStr = Array.isArray(rawPath) ? rawPath.join('/') : rawPath

  // Split service from rest of path
  const slashIdx = pathStr.indexOf('/')
  const service  = slashIdx === -1 ? pathStr : pathStr.slice(0, slashIdx)
  const apiPath  = slashIdx === -1 ? ''       : pathStr.slice(slashIdx)

  const baseUrl = SERVICES[service]
  if (!baseUrl) {
    return res.status(400).json({
      success: false,
      message: `Unknown service "${service}". Valid: ${Object.keys(SERVICES).join(', ')}`
    })
  }

  // Preserve query string from original request (exclude 'path' param)
  const qParams = { ...req.query }
  delete qParams.path
  const qs = Object.keys(qParams).length
    ? '?' + new URLSearchParams(qParams).toString()
    : ''

  const target = `${baseUrl}${apiPath}${qs}`
  console.log(`[PROXY] ${req.method} ${service} → ${target}`)

  // Forward headers
  const headers = { 'Content-Type': 'application/json' }
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization
  }

  try {
    const fetchOpts = { method: req.method, headers }

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      fetchOpts.body = JSON.stringify(req.body ?? {})
    }

    const upstream = await fetch(target, fetchOpts)
    const text     = await upstream.text()

    res.setHeader('Content-Type', 'application/json')
    return res.status(upstream.status).send(text)

  } catch (err) {
    console.error(`[PROXY ERROR] ${target}:`, err.message)
    return res.status(502).json({
      success: false,
      message: `Could not reach backend: ${err.message}`
    })
  }
}
