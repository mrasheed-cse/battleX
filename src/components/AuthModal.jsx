import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './AuthModal.module.css'

export default function AuthModal({ defaultTab = 'login', onClose }) {
  const [tab, setTab] = useState(defaultTab)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const { login, signup, loading, error, clearError } = useAuth()

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    clearError()
    setFieldErrors({})
  }, [tab, clearError])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setFieldErrors(f => ({ ...f, [e.target.name]: '' }))
  }

  const validateLogin = () => {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const validateSignup = () => {
    const errs = {}
    if (!form.username || form.username.length < 3) errs.username = 'Min 3 characters'
    if (!form.email || !form.email.includes('@'))   errs.email    = 'Valid email required'
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters'
    if (form.password !== form.confirm)             errs.confirm  = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = tab === 'login' ? validateLogin() : validateSignup()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    const ok = tab === 'login'
      ? await login(form.email, form.password)
      : await signup(form.username, form.email, form.password)

    if (ok) onClose()
  }

  const inputClass = name =>
    `input ${fieldErrors[name] ? styles.inputError : ''}`

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {['login', 'signup'].map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Global error */}
          {error && (
            <div className={styles.globalError}>{error}</div>
          )}

          {/* Username — signup only */}
          {tab === 'signup' && (
            <div className={styles.field}>
              <label className="input-label" htmlFor="username">Username</label>
              <input
                id="username" name="username" className={inputClass('username')}
                placeholder="GamerTag" autoComplete="username"
                value={form.username} onChange={handleChange}
              />
              {fieldErrors.username && <span className={styles.fieldError}>{fieldErrors.username}</span>}
            </div>
          )}

          {/* Email */}
          <div className={styles.field}>
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" className={inputClass('email')}
              placeholder="your@email.com" autoComplete="email"
              value={form.email} onChange={handleChange}
            />
            {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password" className={inputClass('password')}
              placeholder="••••••••" autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              value={form.password} onChange={handleChange}
            />
            {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
          </div>

          {/* Confirm — signup only */}
          {tab === 'signup' && (
            <div className={styles.field}>
              <label className="input-label" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm" name="confirm" type="password" className={inputClass('confirm')}
                placeholder="••••••••" autoComplete="new-password"
                value={form.confirm} onChange={handleChange}
              />
              {fieldErrors.confirm && <span className={styles.fieldError}>{fieldErrors.confirm}</span>}
            </div>
          )}

          {tab === 'login' && (
            <div className={styles.forgotRow}>
              <button type="button" className={styles.forgotLink}>Forgot password?</button>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? '...' : tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* OAuth */}
        <div className={styles.oauth}>
          <div className={styles.oauthDivider}><span>Or continue with</span></div>
          <div className={styles.oauthButtons}>
            {['Google', 'Discord', 'Steam'].map(p => (
              <button key={p} className={`btn btn-ghost ${styles.oauthBtn}`}>{p}</button>
            ))}
          </div>
        </div>

        <p className={styles.switchRow}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" className={styles.switchLink}
            onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}>
            {tab === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
