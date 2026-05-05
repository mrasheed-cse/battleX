import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { players, wallet, auth as authApi } from '../services/api'
import styles from './Dashboard.module.css'

const fmtMoney    = n   => `৳${(+(n||0)).toFixed(2)}`
const fmtDate     = iso => iso ? new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'
const fmtDateTime = iso => iso ? new Date(iso).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'
const pct         = n   => `${((+(n||0))*100).toFixed(1)}%`
const outcomeColor = o  => ({Win:'#4caf50',Loss:'#f44336',Draw:'#ff9800'})[o]||'#90caf9'
const outcomeIcon  = o  => ({Win:'🏆',Loss:'💔',Draw:'🤝'})[o]||'🎮'

// Unwrap { success, data } or just return raw
function unwrap(res) {
  if (!res) return null
  if (res?.success && res?.data !== undefined) return res.data
  if (res?.data !== undefined) return res.data
  return res
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ color }}>{icon}</div>
      <div>
        <div className={styles.statValue}>{value ?? '—'}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}

// ── Profile Edit ──────────────────────────────────────────────────────────────
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
    } catch(err) {
      setMsg({ ok:false, text: err.message||'Update failed' })
    } finally { setSaving(false) }
  }

  const handlePwChange = async e => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmNew) {
      setPwMsg({ ok:false, text:'Passwords do not match' }); return
    }
    setPwSaving(true); setPwMsg(null)
    try {
      await authApi.changePassword({
        userId: user?.userId,
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      })
      setPwMsg({ ok:true, text:'Password changed!' })
      setPwForm({ currentPassword:'', newPassword:'', confirmNew:'' })
    } catch(err) {
      setPwMsg({ ok:false, text: err.message||'Failed' })
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
              <input type="text" placeholder={f.ph}
                value={form[f.key]}
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
              <input type="password" placeholder={f.ph}
                value={pwForm[f.key]}
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

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [dashboard,  setDashboard]  = useState(null)
  const [walletData, setWalletData] = useState(null)
  const [stats,      setStats]      = useState(null)
  const [history,    setHistory]    = useState([])
  const [txns,       setTxns]       = useState([])
  const [tab,        setTab]        = useState('overview')
  const [loading,    setLoading]    = useState(true)
  const [txnLoading, setTxnLoading] = useState(false)
  const [error,      setError]      = useState(null)
  const [histPage,   setHistPage]   = useState(1)
  const [histTotal,  setHistTotal]  = useState(0)
  const [gameFilter, setGameFilter] = useState('')
  const [withdrawForm, setWithdrawForm] = useState({ amount:'', method:'bkash', accountInfo:'' })
  const [withdrawing,  setWithdrawing]  = useState(false)
  const [withdrawMsg,  setWithdrawMsg]  = useState(null)

  const loadCore = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [dRes, wRes, sRes] = await Promise.allSettled([
        players.dashboard(),
        wallet.me(),
        players.stats(),
      ])

      // Log raw responses for debugging
      if (dRes.status === 'fulfilled') {
        console.log('[Dashboard] raw dashboard:', JSON.stringify(dRes.value).slice(0,300))
        setDashboard(unwrap(dRes.value))
      } else {
        console.error('[Dashboard] dashboard failed:', dRes.reason?.message)
      }

      if (wRes.status === 'fulfilled') {
        console.log('[Dashboard] raw wallet:', JSON.stringify(wRes.value).slice(0,200))
        setWalletData(unwrap(wRes.value))
      } else {
        console.error('[Dashboard] wallet failed:', wRes.reason?.message)
      }

      if (sRes.status === 'fulfilled') {
        console.log('[Dashboard] raw stats:', JSON.stringify(sRes.value).slice(0,200))
        setStats(unwrap(sRes.value))
      } else {
        console.error('[Dashboard] stats failed:', sRes.reason?.message)
      }

    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadHistory = useCallback(async (page=1, gameType='') => {
    try {
      const params = { page, pageSize:10 }
      if (gameType) params.gameType = gameType
      const res = await players.gameHistory(params)
      console.log('[Dashboard] history:', JSON.stringify(res).slice(0,200))
      const data = unwrap(res)
      const items = data?.items || data?.data || (Array.isArray(data) ? data : [])
      setHistory(items)
      setHistTotal(data?.totalCount || items.length || 0)
      setHistPage(page)
    } catch(e) {
      console.error('[Dashboard] history failed:', e.message)
      setHistory([])
    }
  }, [])

  const loadTxns = useCallback(async () => {
    setTxnLoading(true)
    try {
      const res = await wallet.transactions({ page:1, pageSize:20 })
      console.log('[Dashboard] transactions:', JSON.stringify(res).slice(0,200))
      const data = unwrap(res)
      const items = data?.items || data?.transactions || (Array.isArray(data) ? data : [])
      setTxns(items)
    } catch(e) {
      console.error('[Dashboard] txns failed:', e.message)
      setTxns([])
    } finally { setTxnLoading(false) }
  }, [])

  useEffect(() => {
    if (!user) { navigate('/'); return }
    loadCore()
  }, [user, navigate, loadCore])

  useEffect(() => {
    if (tab === 'history') loadHistory(1, gameFilter)
    if (tab === 'wallet')  loadTxns()
  }, [tab, gameFilter, loadHistory, loadTxns])

  const handleWithdraw = async e => {
    e.preventDefault()
    setWithdrawing(true); setWithdrawMsg(null)
    try {
      await wallet.withdraw({
        userId:      user?.userId,
        amount:      parseFloat(withdrawForm.amount),
        method:      withdrawForm.method,
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

  if (loading) return (
    <div className={styles.loadWrap}>
      <div className={styles.spinner}/>
      <p>Loading dashboard...</p>
    </div>
  )

  if (error) return (
    <div className={styles.errorWrap}>
      <p>⚠ {error}</p>
      <button className="btn btn-primary" onClick={loadCore}>Retry</button>
    </div>
  )

  // Use dashboard data with safe fallbacks
  // walletBalance comes from PlayerDashboardDto directly
  const d  = dashboard || {}
  const w  = walletData || {}
  const s  = stats || {}

  // Balance: try walletData first, fall back to dashboard.walletBalance
  const balance  = w.balance ?? w.availableBalance ?? d.walletBalance ?? 0
  const pending  = w.pendingWithdrawals ?? d.pendingWithdrawals ?? 0

  // Win rate: backend returns 0-1 (e.g. 0.67) OR 0-100 (e.g. 67)
  const winRateRaw = d.winRate ?? s.winRate ?? 0
  const winRatePct = winRateRaw <= 1 ? `${(winRateRaw*100).toFixed(1)}%` : `${winRateRaw.toFixed(1)}%`

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
              {d.currentRank && <div className={styles.rankBadge}>#{d.currentRank}</div>}
            </div>
            <div className={styles.heroInfo}>
              <h1 className={styles.heroName}>{d.displayName||d.username||user.username||'Player'}</h1>
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
              {pending > 0 && <div className={styles.pendingLabel}>⏳ {fmtMoney(pending)} pending</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className={styles.statsGrid}>
          <StatCard icon="🎮" label="Games Played" value={d.totalGamesPlayed??s.totalGamesPlayed??0}             color="#90caf9"/>
          <StatCard icon="🏆" label="Wins"          value={d.totalWins??s.totalWins??0}                          color="#ffd700"/>
          <StatCard icon="📉" label="Losses"        value={d.totalLosses??s.totalLosses??0}                      color="#f44336"/>
          <StatCard icon="📊" label="Win Rate"      value={winRatePct}                                            color="#4caf50"/>
          <StatCard icon="⭐" label="Total Points"  value={(d.totalPointsEarned??s.totalPointsEarned??0).toLocaleString()} color="#ff9800"/>
          <StatCard icon="💰" label="Total Earned"  value={fmtMoney(d.totalMoneyEarned??s.totalMoneyEarned)}     color="#81c784"/>
          <StatCard icon="🔥" label="Win Streak"    value={s.streak??0}                                           color="#ff5722"/>
          <StatCard icon="🥇" label="Global Rank"   value={d.currentRank??s.currentRank ? `#${d.currentRank??s.currentRank}` : '—'} color="#ce93d8"/>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { id:'overview', label:'📊 Overview'     },
            { id:'history',  label:'🎮 Game History' },
            { id:'wallet',   label:'💰 Wallet'       },
            { id:'profile',  label:'👤 Profile'      },
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
          <div className={styles.overviewGrid}>
            {s.gameTypeBreakdown && Object.keys(s.gameTypeBreakdown).length > 0 && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>🎯 Games by Type</h3>
                {Object.entries(s.gameTypeBreakdown).map(([type, count]) => (
                  <div key={type} className={styles.breakdownRow}>
                    <span className={styles.breakdownType}>{type}</span>
                    <div className={styles.breakdownBar}>
                      <div className={styles.breakdownFill}
                        style={{ width:`${Math.min(100,(count/Math.max(d.totalGamesPlayed||1,1))*100)}%` }}/>
                    </div>
                    <span className={styles.breakdownCount}>{count}</span>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🕐 Recent Games</h3>
              {(d.recentGames||[]).length === 0
                ? <p className={styles.empty}>No recent games. Start playing!</p>
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
              <button className={styles.seeAll} onClick={()=>setTab('history')}>See all games →</button>
            </div>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className={styles.card}>
            <div className={styles.histHeader}>
              <h3 className={styles.cardTitle}>🎮 Game History</h3>
              <select className={styles.filterSelect} value={gameFilter}
                onChange={e=>{setGameFilter(e.target.value);loadHistory(1,e.target.value)}}>
                <option value="">All Games</option>
                <option value="Ludo">Ludo</option>
                <option value="SnakesAndLadders">Snakes &amp; Ladders</option>
                <option value="TableTennis">Table Tennis</option>
                <option value="ParkingJam">Parking Jam</option>
              </select>
            </div>
            {history.length === 0
              ? <p className={styles.empty}>No games found. Play some games!</p>
              : <table className={styles.histTable}>
                  <thead>
                    <tr><th>Game</th><th>Outcome</th><th>Score</th><th>Points</th><th>Earned</th><th>Opponents</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {history.map((g,i) => (
                      <tr key={i}>
                        <td className={styles.tdGame}>{g.gameType||'—'}</td>
                        <td><span style={{color:outcomeColor(g.outcome),fontWeight:700}}>{outcomeIcon(g.outcome)} {g.outcome}</span></td>
                        <td>{g.score??'—'}</td>
                        <td><span className={styles.ptsBadge}>+{g.pointsEarned||0}</span></td>
                        <td>{(g.moneyEarned||0)>0 ? fmtMoney(g.moneyEarned) : '—'}</td>
                        <td>{g.opponentCount??'—'}</td>
                        <td className={styles.tdDate}>{fmtDate(g.playedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
            {histTotal > 10 && (
              <div className={styles.pagination}>
                <button disabled={histPage<=1} onClick={()=>loadHistory(histPage-1,gameFilter)}>← Prev</button>
                <span>Page {histPage} of {Math.ceil(histTotal/10)}</span>
                <button disabled={histPage>=Math.ceil(histTotal/10)} onClick={()=>loadHistory(histPage+1,gameFilter)}>Next →</button>
              </div>
            )}
          </div>
        )}

        {/* Wallet */}
        {tab === 'wallet' && (
          <div className={styles.walletGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>💰 Wallet</h3>
              <div className={styles.balanceBig}>{fmtMoney(balance)}</div>
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
                  <select value={withdrawForm.method}
                    onChange={e=>setWithdrawForm(f=>({...f,method:e.target.value}))}>
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
                  ? <p className={styles.empty}>No transactions yet.</p>
                  : <table className={styles.txnTable}>
                      <thead><tr><th>Type</th><th>Amount</th><th>Reason</th><th>Date</th></tr></thead>
                      <tbody>
                        {txns.map((t,i) => (
                          <tr key={i}>
                            <td>{t.type||t.transactionType||t.kind||'Transaction'}</td>
                            <td className={(+(t.amount||t.moneyDelta||0))>=0?styles.txnPos:styles.txnNeg}>
                              {(+(t.amount||t.moneyDelta||0))>=0?'+':''}{fmtMoney(t.amount||t.moneyDelta)}
                            </td>
                            <td>{t.reason||t.description||'—'}</td>
                            <td>{fmtDate(t.createdAt||t.date||t.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
