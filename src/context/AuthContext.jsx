import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      // Placeholder — replace with real API call
      await new Promise(r => setTimeout(r, 900))
      setUser({ id: 1, username: 'GamerTag', email, avatar: null, plan: 'pro', xp: 14200 })
      return true
    } catch (e) {
      setError('Invalid credentials. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (username, email, password) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(r => setTimeout(r, 1200))
      setUser({ id: 1, username, email, avatar: null, plan: 'free', xp: 0 })
      return true
    } catch (e) {
      setError('Registration failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
