import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { auth as authApi, token } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => token.getUser())
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // Restore session on page reload
  useEffect(() => {
    if (token.get() && !user) {
      authApi.me()
        .then(res => { if (res?.data) { setUser(res.data); token.saveUser(res.data) } })
        .catch(() => token.clear())
    }
  }, []) // eslint-disable-line

  // ── Internal: store tokens and user from login response ─────────────────────
  const _applySession = useCallback((loginData) => {
    const { accessToken, refreshToken, user: u } = loginData
    token.set(accessToken, refreshToken)
    token.saveUser(u)
    setUser(u)
  }, [])

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(async (emailOrUsername, password) => {
    setLoading(true); setError(null)
    try {
      const res = await authApi.login({ emailOrUsername, password })
      if (res?.data) {
        _applySession(res.data)
        return { ok: true }
      }
      throw new Error(res?.message || 'Login failed')
    } catch (e) {
      const msg = e.errors?.join(', ') || e.message || 'Invalid credentials'
      setError(msg)
      return { ok: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [_applySession])

  // ── Signup ───────────────────────────────────────────────────────────────────
  const signup = useCallback(async ({ username, email, password, confirmPassword, displayName }) => {
    setLoading(true); setError(null)
    try {
      // Step 1: Register
      const regRes = await authApi.register({
        username,
        email,
        password,
        confirmPassword,
        displayName: displayName || username,
      })

      if (!regRes?.success && !regRes?.data) {
        throw new Error(regRes?.message || 'Registration failed')
      }

      // Step 2: Auto-login (reuse token, no extra loading state flip)
      const loginRes = await authApi.login({ emailOrUsername: email, password })
      if (loginRes?.data) {
        _applySession(loginRes.data)
        return { ok: true }
      }

      throw new Error('Registered but login failed. Please sign in manually.')
    } catch (e) {
      const msg = e.errors?.join(', ') || e.message || 'Registration failed'
      setError(msg)
      return { ok: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [_applySession])

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await authApi.logout(token.getRefresh()) } catch {}
    token.clear()
    setUser(null)
    setError(null)
  }, [])

  const updateUser  = useCallback((updates) => {
    setUser(u => { const next = { ...u, ...updates }; token.saveUser(next); return next })
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
