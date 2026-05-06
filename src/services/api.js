/**
 * BattleX API Client
 * All requests go through /api/backend/{service}/... proxy on Vercel
 * This avoids HTTPS→HTTP mixed content and CORS issues
 */

const PROXY = '/api/backend'

// Service prefixes
const IDENTITY = `${PROXY}/identity`
const PLAYER   = `${PROXY}/player`
const GAME     = `${PROXY}/game`
const WALLET   = `${PROXY}/wallet`

const TOKEN_KEY   = 'token'
const REFRESH_KEY = 'refreshToken'
const USER_KEY    = 'bx_user'

// ── Token helpers ─────────────────────────────────────────────────────────────
export const token = {
  get:        ()     => localStorage.getItem(TOKEN_KEY),
  getRefresh: ()     => localStorage.getItem(REFRESH_KEY),
  set:        (a, r) => { localStorage.setItem(TOKEN_KEY, a); localStorage.setItem(REFRESH_KEY, r) },
  clear:      ()     => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); localStorage.removeItem(USER_KEY); localStorage.removeItem('userId'); localStorage.removeItem('username') },
  saveUser:   (u)    => {
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    if (u?.userId)      localStorage.setItem('userId',      u.userId)
    if (u?.username)    localStorage.setItem('username',    u.username)
    if (u?.displayName) localStorage.setItem('bx_username', u.displayName || u.username)
  },
  getUser:    ()     => { try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null } },
}

// ── Core fetch with JWT + auto-refresh ───────────────────────────────────────
let refreshing = null // prevent parallel refresh loops

async function apiFetch(base, path, options = {}, retry = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token.get() ? { Authorization: `Bearer ${token.get()}` } : {}),
    ...options.headers,
  }

  const url = `${base}${path}`
  const res = await fetch(url, { ...options, headers })

  // Auto-refresh on 401
  if (res.status === 401 && retry && token.getRefresh()) {
    if (!refreshing) {
      refreshing = auth.refresh().finally(() => { refreshing = null })
    }
    const ok = await refreshing
    if (ok) return apiFetch(base, path, options, false)
    else token.clear()
  }

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json.message || json.errors?.join(', ') || `HTTP ${res.status}`
    throw Object.assign(new Error(msg), { status: res.status, errors: json.errors, data: json })
  }
  return json
}

const get  = (base, path, params)  => {
  const qs = params ? '?' + new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([,v]) => v !== undefined && v !== ''))
  ) : ''
  return apiFetch(base, `${path}${qs}`, { method: 'GET' })
}
const post = (base, path, body)    => apiFetch(base, path, { method: 'POST',   body: JSON.stringify(body ?? {}) })
const put  = (base, path, body)    => apiFetch(base, path, { method: 'PUT',    body: JSON.stringify(body ?? {}) })
const del  = (base, path)          => apiFetch(base, path, { method: 'DELETE' })

// ── Identity Service ──────────────────────────────────────────────────────────
export const auth = {
  register:   (body)         => post(IDENTITY, '/api/v1/auth/register', body),
  login:      (body)         => post(IDENTITY, '/api/v1/auth/login', body),
  refresh:    async () => {
    try {
      const data = await post(IDENTITY, '/api/v1/auth/refresh', {
        accessToken:  token.get(),
        refreshToken: token.getRefresh(),
      })
      if (data?.data?.accessToken) {
        token.set(data.data.accessToken, data.data.refreshToken)
        return true
      }
    } catch {}
    return false
  },
  logout:          (refreshToken) => post(IDENTITY, '/api/v1/auth/logout', { refreshToken }),
  me:              ()             => get(IDENTITY, '/api/v1/auth/me'),
  changePassword:  (body)         => put(IDENTITY, '/api/v1/auth/change-password', body),
}

export const users = {
  list:     (params)         => get(IDENTITY, '/api/v1/users', params),
  get:      (id)             => get(IDENTITY, `/api/v1/users/${id}`),
  delete:   (id)             => del(IDENTITY, `/api/v1/users/${id}`),
  setRole:  (id, role)       => put(IDENTITY, `/api/v1/users/${id}/role`,   { userId: id, role }),
  setStatus:(id, status, reason) => put(IDENTITY, `/api/v1/users/${id}/status`, { userId: id, status, reason }),
}

// ── Player Service ────────────────────────────────────────────────────────────
export const players = {
  dashboard:   ()       => get(PLAYER, '/api/v1/players/me/dashboard'),
  stats:       ()       => get(PLAYER, '/api/v1/players/me/stats'),
  gameHistory: (params) => get(PLAYER, '/api/v1/players/me/game-history', params),
  updateMe:    (body)   => put(PLAYER, '/api/v1/players/me', body),
  getPlayer:   (id)     => get(PLAYER, `/api/v1/players/${id}`),
  list:        (params) => get(PLAYER, '/api/v1/players', params),
}

// ── Game Service ──────────────────────────────────────────────────────────────
export const games = {
  listOpen:     (params)     => get(GAME, '/api/v1/games/open', params),
  list:         (params)     => get(GAME, '/api/v1/games', params),
  get:          (id)         => get(GAME, `/api/v1/games/${id}`),
  create:       (body)       => post(GAME, '/api/v1/games', body),
  join:         (id)         => post(GAME, `/api/v1/games/${id}/join`),
  start:        (id)         => post(GAME, `/api/v1/games/${id}/start`),
  submitResult: (id, body)   => post(GAME, `/api/v1/games/${id}/results`, body),
  cancel:       (id, body)   => post(GAME, `/api/v1/games/${id}/cancel`, body),
}

// ── Wallet Service ────────────────────────────────────────────────────────────
export const wallet = {
  me:           ()       => get(WALLET, '/api/v1/wallet/me'),
  transactions: (params) => get(WALLET, '/api/v1/wallet/me/transactions', params),
  withdraw:     (body)   => post(WALLET, '/api/v1/wallet/me/withdraw', body),
  getByPlayer:  (id)     => get(WALLET, `/api/v1/wallet/${id}`),
  adjust:       (id, b)  => post(WALLET, `/api/v1/wallet/${id}/adjust`, b),
}

// ── Internal player stats recording ─────────────────────────────────────────
// Calls POST /api/v1/internal/players/record-game/batch
// This is the proper architecture: game completion → player stats update
export async function recordGameResults(results) {
  // results: array of { userId, username, gameType, outcome, score, pointsEarned, moneyEarned, opponentCount, sessionId }
  return post(PLAYER, '/api/v1/internal/players/record-game/batch', results)
}

// ── Leaderboard helpers (call Vercel API routes which proxy to Game Service) ─
export const leaderboard = {
  // General (parking jam etc.)
  get:         (game, params)    => get(PROXY + '/leaderboard', '', { game, ...params }),
  post:        (body)            => post(PROXY + '/leaderboard', '', body),
  playerScores:(game, playerName)=> get(PROXY + '/leaderboard', '', { view:'player', game, playerName }),

  // Ludo
  ludo: {
    rankings: (params) => get(PROXY + '/ludo-leaderboard', '', { view:'rankings', ...params }),
    matches:  (params) => get(PROXY + '/ludo-leaderboard', '', { view:'matches',  ...params }),
    post:     (body)   => post(PROXY + '/ludo-leaderboard', '', body),
  },

  // Snakes & Ladders
  snl: {
    rankings: (params) => get(PROXY + '/snl-leaderboard', '', { view:'rankings', ...params }),
    matches:  (params) => get(PROXY + '/snl-leaderboard', '', { view:'matches',  ...params }),
    post:     (body)   => post(PROXY + '/snl-leaderboard', '', body),
  },

  // Table Tennis
  tt: {
    top:    (limit)       => get(PROXY + '/table-tennis-leaderboard', '', { view:'leaderboard', limit }),
    player: (playerName, limit) => get(PROXY + '/table-tennis-leaderboard', '', { view:'player', playerName, limit }),
    stats:  (playerName)  => get(PROXY + '/table-tennis-leaderboard', '', { view:'stats', playerName }),
    post:   (body)        => post(PROXY + '/table-tennis-leaderboard', '', body),
  },
}
