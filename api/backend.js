/**
 * BattleX Backend Proxy
 * All services accessible via Gateway on port 5000
 * Route: /api/backend?path=identity/api/v1/auth/login
 */

const GATEWAY = 'http://46.225.58.8:5000'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
  if (req.method === 'OPTIONS') return res.status(200).end()

  const rawPath = req.query?.path || ''
  const pathStr = Array.isArray(rawPath) ? rawPath.join('/') : rawPath

  // Strip service prefix — all go through gateway
  // e.g. identity/api/v1/auth/login → /api/v1/auth/login
  const slashIdx = pathStr.indexOf('/')
  const apiPath  = slashIdx === -1 ? '/' : pathStr.slice(slashIdx)

  // Preserve query params (excluding 'path')
  const qParams = { ...req.query }
  delete qParams.path
  const qs = Object.keys(qParams).length
    ? '?' + new URLSearchParams(qParams).toString()
    : ''

  const target = `${GATEWAY}${apiPath}${qs}`
  console.log(`[PROXY] ${req.method} → ${target}`)

  const headers = { 'Content-Type': 'application/json' }
  if (req.headers.authorization) headers['Authorization'] = req.headers.authorization

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
    return res.status(502).json({ success: false, message: err.message })
  }
}
