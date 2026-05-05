import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { players, wallet, auth as authApi } from '../services/api'
import styles from './Dashboard.module.css'

const fmtMoney    = n   => `৳${(+(n||0)).toFixed(2)}`
const fmtDate     = iso => iso ? new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'
const fmtDateTime = iso => iso ? new Date(iso).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'
const outcomeColor = o  => ({Win:'#4caf50',Loss:'#f44336',Draw:'#ff9800'})[o]||'#90caf9'
const outcomeIcon  = o  => ({Win:'🏆',Loss:'💔',Draw:'🤝'})[o]||'🎮'

function unwrap(res) {
  if (!res) return null
  if (res?.data !== undefined) return res.data
  return res
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ color }}>{icon}</div>
      <div>
        <div className={styles.statValue}>{value ?? '0'}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}

function ProfileEdit({ user, dashboard, onSave }) {
  const [form,     setForm]     = useState({
    displayName: dashboard?.displayName || '',
    bio:         dashboard?.bio         || '',
    country:     dashboard?.country     || '',
    avatarUrl:   dashboard?.avatarUrl   || '',
  })
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState(null)
  const [pwForm,   setPwForm]   = useState({ currentPassword:'', newPassword:'', confirmNew:'' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg,    setPwMsg]    = useState(null)

  const handleSave = async e => {
    e.preventDefault(); setSaving(true); setMsg(null)
    try {
      await players.updateMe({ userId: user?.userId, ...form })
      setMsg({ ok:true, text:'Profile updated!' })
      onSave()
    } catch(err) { setMsg({ ok:false, text: err.message||'Update failed' })
    } finally { setSaving(false) }
  }

  const handlePwChange = async e => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmNew) { setPwMsg({ ok:false, text:'Passwords do not match' }); return }
    setPwSaving(true); setPwMsg(null)
    try {
      await authApi.changePassword({ userId: user?.userId, currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwMsg({ ok:true, text:'Password changed!' })
      setPwForm({ currentPassword:'', newPassword:'', confirmNew:'' })
    } catch(err) { setPwMsg({ ok:false, text: err.message||'Failed' })
    } finally { setPwSaving(false) }
  }

  return (
    <div className={styles.profileGrid}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>👤 Edit Profile</h3>
        {msg && <div className={`${styles.msg} ${msg.ok?styles.msgOk:styles.msgErr}`}>{msg.text}</div>}
        <form onSubmit={handleSave} className={styles.form}>
          {[
            { key:'displayName', label:'Display Name', ph:'Your display name' },
            { key:'bio',         label:'Bio',          ph:'Tell us about yourself' },
            { key:'country',     label:'Country',      ph:'e.g. Bangladesh' },
            { key:'avatarUrl',   label:'Avatar URL',   ph:'https://...' },
          ].map(f => (
            <div key={f.key} className={styles.formRow}>
              <label>{f.label}</label>
              <input type="text" placeholder={f.ph} value={form[f.key]}
                onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}/>
            </div>
          ))}
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>🔒 Change Password</h3>
        {pwMsg && <div className={`${styles.msg} ${pwMsg.ok?styles.msgOk:styles.msgErr}`}>{pwMsg.text}</div>}
        <form onSubmit={handlePwChange} className={styles.form}>
          {[
            { key:'currentPassword', label:'Current Password', ph:'Current password' },
            { key:'newPassword',     label:'New Password',     ph:'Min 6 characters'  },
            { key:'confirmNew',      label:'Confirm New',      ph:'Repeat new password' },
          ].map(f => (
            <div key={f.key} className={styles.formRow}>
              <label>{f.label}</label>
              <input type="password" placeholder={f.ph} value={pwForm[f.key]}
                onChange={e => setPwForm(p=>({...p,[f.key]:e.target.value}))}/>
            </div>
          ))}
          <button className="btn btn-primary" type="submit" disabled={pwSaving}>
            {pwSaving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [dashboard,  setDashboard]  = useState(null)
  const [walletData, setWalletData] = useState(null)
  const [txns,       setTxns]       = useState([])
  const [tab,        setTab]        = useState('overview')
  const [loading,    setLoading]    = useState(true)
  const [txnLoading, setTxnLoading] = useState(false)
  const [error,      setError]      = useState(null)
  const [withdrawForm, setWithdrawForm] = useState({ amount:'', method:'bkash', accountInfo:'' })
  const [withdrawing,  setWithdrawing]  = useState(false)
  const [withdrawMsg,  setWithdrawMsg]  = useState(null)

  const loadCore = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [dRes, wRes] = await Promise.allSettled([
        players.dashboard(),
        wallet.me(),
      ])
      if (dRes.status === 'fulfilled') setDashboard(unwrap(dRes.value))
      else console.error('[Dashboard]', dRes.reason?.message)

      if (wRes.status === 'fulfilled') setWalletData(unwrap(wRes.value))
      else console.error('[Wallet]', wRes.reason?.message)
    } catch(e) {
      setError(e.message)
    } finally { setLoading(false) }
  }, [])

  const loadTxns = useCallback(async () => {
    setTxnLoading(true)
    try {
      const res = await wallet.transactions({ page:1, pageSize:20 })
      const data = unwrap(res)
      setTxns(data?.items || [])
    } catch(e) {
      console.error('[Txns]', e.message)
      setTxns([])
    } finally { setTxnLoading(false) }
  }, [])

  useEffect(() => {
    if (!user) { navigate('/'); return }
    loadCore()
  }, [user, navigate, loadCore])

  useEffect(() => {
    if (tab === 'wallet') loadTxns()
  }, [tab, loadTxns])

  const handleWithdraw = async e => {
    e.preventDefault()
    setWithdrawing(true); setWithdrawMsg(null)
    try {
      await wallet.withdraw({
        userId: user?.userId,
        amount: parseFloat(withdrawForm.amount),
        method: withdrawForm.method,
        accountInfo: withdrawForm.accountInfo,
      })
      setWithdrawMsg({ ok:true, text:'Withdrawal request submitted!' })
      setWithdrawForm({ amount:'', method:'bkash', accountInfo:'' })
      loadCore()
    } catch(e) {
      setWithdrawMsg({ ok:false, text: e.message||'Withdrawal failed' })
    } finally { setWithdrawing(false) }
  }

  if (!user) return null
  if (loading) return <div className={styles.loadWrap}><div className={styles.spinner}/><p>Loading dashboard...</p></div>
  if (error)   return <div className={styles.errorWrap}><p>⚠ {error}</p><button className="btn btn-primary" onClick={loadCore}>Retry</button></div>

  const d = dashboard || {}
  const w = walletData || {}

  // Wallet: backend returns moneyBalance not balance
  const balance = w.moneyBalance ?? w.balance ?? w.availableBalance ?? d.walletBalance ?? 0
  const points  = w.pointsBalance ?? w.points ?? 0
  const pending = w.pendingWithdrawal ?? w.pendingWithdrawals ?? d.pendingWithdrawals ?? 0

  // Win rate: 0-1 float → show as percentage
  const winRate = d.winRate ?? 0
  const winRatePct = winRate <= 1 ? `${(winRate*100).toFixed(1)}%` : `${winRate.toFixed(1)}%`

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.avatar}>
              {d.avatarUrl
                ? <img src={d.avatarUrl} alt={d.displayName}/>
                : <span>{(d.displayName||d.username||user.username||'U')[0].toUpperCase()}</span>
              }
              {(d.currentRank > 0) && <div className={styles.rankBadge}>#{d.currentRank}</div>}
            </div>
            <div className={styles.heroInfo}>
              <h1 className={styles.heroName}>{d.displayName||d.username||user.username}</h1>
              <p className={styles.heroMeta}>
                @{d.username||user.username}
                {d.country && <span> · 🌍 {d.country}</span>}
                <span> · Member since {fmtDate(d.memberSince)}</span>
              </p>
              {d.lastPlayedAt && <p className={styles.heroSub}>Last played: {fmtDateTime(d.lastPlayedAt)}</p>}
            </div>
            <div className={styles.heroWallet}>
              <div className={styles.balanceLabel}>Wallet Balance</div>
              <div className={styles.balanceVal}>{fmtMoney(balance)}</div>
              <div className={styles.balanceLabel} style={{marginTop:4}}>⭐ {points.toLocaleString()} pts</div>
              {pending > 0 && <div className={styles.pendingLabel}>⏳ {fmtMoney(pending)} pending</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats grid */}
        <div className={styles.statsGrid}>
          <StatCard icon="🎮" label="Games Played" value={d.totalGamesPlayed||0}                      color="#90caf9"/>
          <StatCard icon="🏆" label="Wins"          value={d.totalWins||0}                             color="#ffd700"/>
          <StatCard icon="📉" label="Losses"        value={d.totalLosses||0}                           color="#f44336"/>
          <StatCard icon="📊" label="Win Rate"      value={winRatePct}                                  color="#4caf50"/>
          <StatCard icon="⭐" label="Points Earned" value={(d.totalPointsEarned||0).toLocaleString()}  color="#ff9800"/>
          <StatCard icon="💰" label="Money Earned"  value={fmtMoney(d.totalMoneyEarned)}              color="#81c784"/>
          <StatCard icon="🤝" label="Draws"         value={d.totalDraws||0}                            color="#90caf9"/>
          <StatCard icon="🥇" label="Global Rank"   value={(d.currentRank>0)?`#${d.currentRank}`:'—'} color="#ce93d8"/>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { id:'overview', label:'📊 Overview' },
            { id:'wallet',   label:'💰 Wallet'   },
            { id:'profile',  label:'👤 Profile'  },
          ].map(t => (
            <button key={t.id}
              className={`${styles.tab} ${tab===t.id?styles.tabActive:''}`}
              onClick={()=>setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🕐 Recent Games</h3>
            {(d.recentGames||[]).length === 0
              ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🎮</div>
                  <p className={styles.emptyTitle}>No games played yet</p>
                  <p className={styles.emptySub}>Play some games and your history will appear here!</p>
                  <Link to="/games" className="btn btn-primary" style={{marginTop:12}}>Browse Games</Link>
                </div>
              )
              : (d.recentGames||[]).map((g,i) => (
                <div key={i} className={styles.recentRow}>
                  <span className={styles.recentIcon}>{outcomeIcon(g.outcome)}</span>
                  <div className={styles.recentInfo}>
                    <span className={styles.recentType}>{g.gameType}</span>
                    <span className={styles.recentDate}>{fmtDate(g.playedAt)}</span>
                  </div>
                  <div className={styles.recentRight}>
                    <span style={{color:outcomeColor(g.outcome),fontWeight:700,fontSize:13}}>{g.outcome}</span>
                    {g.pointsEarned>0 && <span className={styles.recentPts}>+{g.pointsEarned} pts</span>}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* Wallet */}
        {tab === 'wallet' && (
          <div className={styles.walletGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>💰 Wallet</h3>
              <div className={styles.balanceBig}>{fmtMoney(balance)}</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:8}}>
                ⭐ {points.toLocaleString()} points
              </div>
              {pending > 0 && <p className={styles.pending}>⏳ Pending: {fmtMoney(pending)}</p>}

              <h4 className={styles.subTitle}>Request Withdrawal</h4>
              {withdrawMsg && (
                <div className={`${styles.msg} ${withdrawMsg.ok?styles.msgOk:styles.msgErr}`}>{withdrawMsg.text}</div>
              )}
              <form onSubmit={handleWithdraw} className={styles.form}>
                <div className={styles.formRow}>
                  <label>Amount (৳)</label>
                  <input type="number" min="10" step="0.01" placeholder="10.00" required
                    value={withdrawForm.amount}
                    onChange={e=>setWithdrawForm(f=>({...f,amount:e.target.value}))}/>
                </div>
                <div className={styles.formRow}>
                  <label>Method</label>
                  <select value={withdrawForm.method} onChange={e=>setWithdrawForm(f=>({...f,method:e.target.value}))}>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div className={styles.formRow}>
                  <label>Account Number</label>
                  <input type="text" placeholder="01XXXXXXXXX" required
                    value={withdrawForm.accountInfo}
                    onChange={e=>setWithdrawForm(f=>({...f,accountInfo:e.target.value}))}/>
                </div>
                <button className="btn btn-primary" type="submit" disabled={withdrawing}>
                  {withdrawing ? 'Submitting...' : 'Request Withdrawal'}
                </button>
              </form>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📋 Transactions</h3>
              {txnLoading
                ? <div className={styles.spinner}/>
                : txns.length === 0
                  ? (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>💳</div>
                      <p className={styles.emptyTitle}>No transactions yet</p>
                      <p className={styles.emptySub}>Your transaction history will appear here.</p>
                    </div>
                  )
                  : (
                    <table className={styles.txnTable}>
                      <thead><tr><th>Type</th><th>Amount</th><th>Points</th><th>Reason</th><th>Date</th></tr></thead>
                      <tbody>
                        {txns.map((t,i) => (
                          <tr key={i}>
                            <td>{t.type||t.transactionType||'—'}</td>
                            <td className={(+(t.moneyDelta||t.amount||0))>=0?styles.txnPos:styles.txnNeg}>
                              {(+(t.moneyDelta||t.amount||0))>=0?'+':''}{fmtMoney(t.moneyDelta??t.amount)}
                            </td>
                            <td>{t.pointsDelta!=null ? `${t.pointsDelta>=0?'+':''}${t.pointsDelta}` : '—'}</td>
                            <td>{t.reason||t.description||'—'}</td>
                            <td>{fmtDate(t.createdAt||t.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
              }
            </div>
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && <ProfileEdit user={user} dashboard={d} onSave={loadCore}/>}

        <div className={styles.actions}>
          <Link to="/games" className="btn btn-primary btn-lg">🎮 Play Games</Link>
          <button className="btn btn-ghost btn-lg" onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  )
}
