import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './AuthModal.module.css'

export default function AuthModal({ defaultTab = 'login', onClose }) {
  const [tab,         setTab]         = useState(defaultTab)
  const [form,        setForm]        = useState({ username:'', email:'', password:'', confirm:'', displayName:'' })
  const [fieldErrors, setFieldErrors] = useState({})
  const { login, signup, loading, error, clearError } = useAuth()

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  useEffect(() => { clearError(); setFieldErrors({}) }, [tab, clearError])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setFieldErrors(f => ({ ...f, [e.target.name]: '' }))
  }

  const validateLogin = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email or username required'
    if (!form.password) errs.password = 'Password required'
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

    let result
    if (tab === 'login') {
      result = await login(form.email, form.password)
    } else {
      result = await signup({
        username:        form.username,
        email:           form.email,
        password:        form.password,
        confirmPassword: form.confirm,
        displayName:     form.displayName || form.username,
      })
    }
    if (result?.ok) onClose()
  }

  const inputClass = name => `input ${fieldErrors[name] ? styles.inputError : ''}`

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.logo}>
          <span className={styles.logoBx}>BX</span>
          <span className={styles.logoText}>BattleX</span>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab==='login'  ? styles.tabActive:''}`} onClick={()=>setTab('login')}>Sign In</button>
          <button className={`${styles.tab} ${tab==='signup' ? styles.tabActive:''}`} onClick={()=>setTab('signup')}>Create Account</button>
        </div>

        {error && <div className={styles.apiError}><span>⚠</span>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {tab === 'signup' && (
            <>
              <div className={styles.field}>
                <label>Username *</label>
                <input className={inputClass('username')} name="username" value={form.username}
                  onChange={handleChange} placeholder="Choose a username" autoComplete="username"/>
                {fieldErrors.username && <span className={styles.err}>{fieldErrors.username}</span>}
              </div>
              <div className={styles.field}>
                <label>Display Name</label>
                <input className={inputClass('displayName')} name="displayName" value={form.displayName}
                  onChange={handleChange} placeholder="How others see you (optional)"/>
              </div>
            </>
          )}

          <div className={styles.field}>
            <label>{tab==='login' ? 'Email or Username *' : 'Email *'}</label>
            <input className={inputClass('email')} name="email" type={tab==='login'?'text':'email'}
              value={form.email} onChange={handleChange}
              placeholder={tab==='login' ? 'Email or username' : 'your@email.com'}
              autoComplete={tab==='login' ? 'username' : 'email'}/>
            {fieldErrors.email && <span className={styles.err}>{fieldErrors.email}</span>}
          </div>

          <div className={styles.field}>
            <label>Password *</label>
            <input className={inputClass('password')} name="password" type="password"
              value={form.password} onChange={handleChange}
              placeholder={tab==='login' ? 'Your password' : 'Min 6 characters'}
              autoComplete={tab==='login' ? 'current-password' : 'new-password'}/>
            {fieldErrors.password && <span className={styles.err}>{fieldErrors.password}</span>}
          </div>

          {tab === 'signup' && (
            <div className={styles.field}>
              <label>Confirm Password *</label>
              <input className={inputClass('confirm')} name="confirm" type="password"
                value={form.confirm} onChange={handleChange} placeholder="Repeat password"
                autoComplete="new-password"/>
              {fieldErrors.confirm && <span className={styles.err}>{fieldErrors.confirm}</span>}
            </div>
          )}

          <button className={`btn btn-primary btn-lg ${styles.submitBtn}`} type="submit" disabled={loading}>
            {loading ? <span className={styles.spinner}/> : null}
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          {tab==='login' ? "Don't have an account? " : 'Already have an account? '}
          <button className={styles.switchLink}
            onClick={()=>setTab(tab==='login'?'signup':'login')}>
            {tab==='login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
