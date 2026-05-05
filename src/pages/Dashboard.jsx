import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { players, wallet, auth as authApi } from '../services/api'
import styles from './Dashboard.module.css'

const fmtMoney    = n   => `৳${(+(n||0)).toFixed(2)}`
const fmtDate     = iso => iso ? new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'
const fmtDateTime = iso => iso ? new Date(iso).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'
const fmtMs       = ms  => { if(!ms||ms<=0) return '—'; const s=Math.floor(ms/1000),m=Math.floor(s/60); return m>0?`${m}m ${s%60}s`:`${s}s` }

function unwrap(res) {
  if (!res) return null
  if (res?.data !== undefined) return res.data
  return res
}

// Fetch all leaderboard data for the logged-in user across all games
async function fetchPlayerStats(username) {
  const name = encodeURIComponent(username)
  const stats = { gamesPlayed:0, wins:0, losses:0, points:0, matches:[] }

  try {
    // Ludo stats
    const ludoRes = await fetch(`/api/ludo-leaderboard?view=rankings&limit=200&search=${name}`)
    const ludoJson = await ludoRes.json()
    const ludoPlayer = (ludoJson.rankings||[]).find(r =>
      r.player_name?.toLowerCase() === username.toLowerCase())
    if (ludoPlayer) {
      stats.gamesPlayed += ludoPlayer.matches || 0
      stats.wins        += ludoPlayer.wins    || 0
      stats.points      += ludoPlayer.total_points || 0
      stats.losses      += (ludoPlayer.matches||0) - (ludoPlayer.wins||0)
    }

    // Ludo match history
    const ludoMatchRes = await fetch(`/api/ludo-leaderboard?view=matches&limit=100&search=${name}`)
    const ludoMatchJson = await ludoMatchRes.json()
    ;(ludoMatchJson.matches||[]).forEach(m => {
      const me = m.players?.find(p => p.player_name?.toLowerCase() === username.toLowerCase())
      if (me) stats.matches.push({
        game: 'Ludo', outcome: me.position===1?'Win':me.position<=3?'Loss':'Loss',
        score: me.position, pointsEarned: me.points||0, playedAt: m.played_at,
        matchId: m.match_id, position: me.position,
      })
    })
  } catch(e) { console.warn('[Dashboard] Ludo stats failed:', e.message) }

  try {
    // Table Tennis stats
    const ttRes = await fetch(`/api/table-tennis-leaderboard?view=leaderboard&limit=200`)
    const ttJson = await ttRes.json()
    const ttEntries = (ttJson.entries||[]).filter(e =>
      e.player_name?.toLowerCase() === username.toLowerCase())
    ttEntries.forEach(e => {
      stats.gamesPlayed++
      if (e.won) stats.wins++; else stats.losses++
      stats.points += e.total_points || 0
      stats.matches.push({
        game: 'Table Tennis', outcome: e.won?'Win':'Loss',
        score: e.player_score, pointsEarned: e.total_points||0,
        playedAt: e.submitted_at, opponentCount: 1,
      })
    })
  } catch(e) { console.warn('[Dashboard] TT stats failed:', e.message) }

  try {
    // SNL stats
    const snlRes = await fetch(`/api/snl-leaderboard?view=rankings&limit=200&search=${name}`)
    const snlJson = await snlRes.json()
    const snlPlayer = (snlJson.rankings||[]).find(r =>
      r.player_name?.toLowerCase() === username.toLowerCase())
    if (snlPlayer) {
      stats.gamesPlayed += snlPlayer.matches || 0
      stats.wins        += snlPlayer.wins    || 0
      stats.points      += snlPlayer.total_points || 0
      stats.losses      += (snlPlayer.matches||0) - (snlPlayer.wins||0)
    }
  } catch(e) { console.warn('[Dashboard] SNL stats failed:', e.message) }

  // Sort matches by date, newest first
  stats.matches.sort((a,b) => new Date(b.playedAt||0) - new Date(a.playedAt||0))
  stats.winRate = stats.gamesPlayed > 0
    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
    : 0

  return stats
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ color }}>{icon}</div>
      <div>
        <div className={styles.statValue}>{value ?? '0'}</div>
        <div className={styles.statLabel}>{label}</div>
        {sub && <div className={styles.statSub}>{sub}</div>}
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
    } catch(err) { setMsg({ ok:false, text:err.message||'Update failed' })
    } finally { setSaving(false) }
  }

  const handlePwChange = async e => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmNew) { setPwMsg({ ok:false, text:'Passwords do not match' }); return }
    setPwSaving(true); setPwMsg(null)
    try {
      await authApi.changePassword({ userId:user?.userId, currentPassword:pwForm.currentPassword, newPassword:pwForm.newPassword })
      setPwMsg({ ok:true, text:'Password changed!' })
      setPwForm({ currentPassword:'', newPassword:'', confirmNew:'' })
    } catch(err) { setPwMsg({ ok:false, text:err.message||'Failed' })
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
            {saving?'Saving...':'Save Profile'}
          </button>
        </form>
      </div>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>🔒 Change Password</h3>
        {pwMsg && <div className={`${styles.msg} ${pwMsg.ok?styles.msgOk:styles.msgErr}`}>{pwMsg.text}</div>}
        <form onSubmit={handlePwChange} className={styles.form}>
          {[
            { key:'currentPassword', label:'Current Password', ph:'Current password' },
            { key:'newPassword',     label:'New Password',     ph:'Min 6 characters' },
            { key:'confirmNew',      label:'Confirm New',      ph:'Repeat new password' },
          ].map(f => (
            <div key={f.key} className={styles.formRow}>
              <label>{f.label}</label>
              <input type="password" placeholder={f.ph} value={pwForm[f.key]}
                onChange={e => setPwForm(p=>({...p,[f.key]:e.target.value}))}/>
            </div>
          ))}
          <button className="btn btn-primary" type="submit" disabled={pwSaving}>
            {pwSaving?'Changing...':'Change Password'}
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
  const [gameStats,  setGameStats]  = useState(null)
  const [txns,       setTxns]       = useState([])
  const [tab,        setTab]        = useState('overview')
  const [loading,    setLoading]    = useState(true)
  const [txnLoading, setTxnLoading] = useState(false)
  const [error,      setError]      = useState(null)
  const [withdrawForm, setWithdrawForm] = useState({ amount:'', method:'bkash', accountInfo:'' })
  const [withdrawing,  setWithdrawing]  = useState(false)
  const [withdrawMsg,  setWithdrawMsg]  = useState(null)

  const username = user?.username || user?.displayName || ''

  const loadCore = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [dRes, wRes, gsRes] = await Promise.allSettled([
        players.dashboard(),
        wallet.me(),
        fetchPlayerStats(username),
      ])
      if (dRes.status === 'fulfilled') setDashboard(unwrap(dRes.value))
      if (wRes.status === 'fulfilled') setWalletData(unwrap(wRes.value))
      if (gsRes.status === 'fulfilled') setGameStats(gsRes.value)
      else console.error('[GameStats]', gsRes.reason?.message)
    } catch(e) { setError(e.message)
    } finally { setLoading(false) }
  }, [username])

  const loadTxns = useCallback(async () => {
    setTxnLoading(true)
    try {
      const res  = await wallet.transactions({ page:1, pageSize:20 })
      const data = unwrap(res)
      setTxns(data?.items || [])
    } catch(e) { setTxns([])
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
    e.preventDefault(); setWithdrawing(true); setWithdrawMsg(null)
    try {
      await wallet.withdraw({ userId:user?.userId, amount:parseFloat(withdrawForm.amount), method:withdrawForm.method, accountInfo:withdrawForm.accountInfo })
      setWithdrawMsg({ ok:true, text:'Withdrawal request submitted!' })
      setWithdrawForm({ amount:'', method:'bkash', accountInfo:'' })
      loadCore()
    } catch(e) { setWithdrawMsg({ ok:false, text:e.message||'Withdrawal failed' })
    } finally { setWithdrawing(false) }
  }

  if (!user) return null
  if (loading) return <div className={styles.loadWrap}><div className={styles.spinner}/><p>Loading dashboard...</p></div>
  if (error)   return <div className={styles.errorWrap}><p>⚠ {error}</p><button className="btn btn-primary" onClick={loadCore}>Retry</button></div>

  const d  = dashboard || {}
  const w  = walletData || {}
  const gs = gameStats || { gamesPlayed:0, wins:0, losses:0, points:0, winRate:0, matches:[] }

  const balance = w.moneyBalance ?? w.balance ?? d.walletBalance ?? 0
  const points  = w.pointsBalance ?? 0
  const pending = w.pendingWithdrawal ?? d.pendingWithdrawals ?? 0

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.avatar}>
              {d.avatarUrl
                ? <img src={d.avatarUrl} alt={d.displayName}/>
                : <span>{(d.displayName||d.username||username||'U')[0].toUpperCase()}</span>
              }
            </div>
            <div className={styles.heroInfo}>
              <h1 className={styles.heroName}>{d.displayName||d.username||username}</h1>
              <p className={styles.heroMeta}>
                @{d.username||username}
                {d.country && <span> · 🌍 {d.country}</span>}
                <span> · Member since {fmtDate(d.memberSince)}</span>
              </p>
            </div>
            <div className={styles.heroWallet}>
              <div className={styles.balanceLabel}>Wallet Balance</div>
              <div className={styles.balanceVal}>{fmtMoney(balance)}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginTop:4}}>
                ⭐ {points.toLocaleString()} pts
              </div>
              {pending > 0 && <div className={styles.pendingLabel}>⏳ {fmtMoney(pending)} pending</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats — from leaderboard data */}
        <div className={styles.statsGrid}>
          <StatCard icon="🎮" label="Games Played" value={gs.gamesPlayed}                color="#90caf9"/>
          <StatCard icon="🏆" label="Wins"          value={gs.wins}                       color="#ffd700"/>
          <StatCard icon="📉" label="Losses"        value={gs.losses}                     color="#f44336"/>
          <StatCard icon="📊" label="Win Rate"      value={`${gs.winRate}%`}              color="#4caf50"/>
          <StatCard icon="⭐" label="Total Points"  value={gs.points.toLocaleString()}    color="#ff9800"/>
          <StatCard icon="💰" label="Wallet"        value={fmtMoney(balance)}             color="#81c784"/>
          <StatCard icon="🎯" label="Draws"         value={d.totalDraws||0}               color="#90caf9"/>
          <StatCard icon="🏅" label="Best Game"
            value={gs.matches[0]?.game || '—'}                                            color="#ce93d8"/>
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
            {/* Game breakdown */}
            {gs.gamesPlayed > 0 && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>🎯 Performance</h3>
                <div className={styles.perfRow}>
                  <span>Win Rate</span>
                  <div className={styles.perfBar}>
                    <div className={styles.perfFill} style={{width:`${gs.winRate}%`,background:'#4caf50'}}/>
                  </div>
                  <span>{gs.winRate}%</span>
                </div>
                <div className={styles.perfRow}>
                  <span>Total Points</span>
                  <div className={styles.perfBar}>
                    <div className={styles.perfFill} style={{width:'100%',background:'#ff9800'}}/>
                  </div>
                  <span>{gs.points}</span>
                </div>
              </div>
            )}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🕐 Recent Matches</h3>
              {gs.matches.length === 0
                ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🎮</div>
                    <p className={styles.emptyTitle}>No games played yet</p>
                    <p className={styles.emptySub}>Play some games to see your history!</p>
                    <Link to="/games" className="btn btn-primary" style={{marginTop:12,display:'inline-block'}}>
                      Browse Games
                    </Link>
                  </div>
                )
                : gs.matches.slice(0,8).map((g,i) => (
                  <div key={i} className={styles.recentRow}>
                    <span className={styles.recentIcon}>
                      {g.outcome==='Win'?'🏆':g.outcome==='Draw'?'🤝':'💔'}
                    </span>
                    <div className={styles.recentInfo}>
                      <span className={styles.recentType}>{g.game}</span>
                      <span className={styles.recentDate}>{fmtDate(g.playedAt)}</span>
                    </div>
                    <div className={styles.recentRight}>
                      <span style={{color:g.outcome==='Win'?'#4caf50':g.outcome==='Draw'?'#ff9800':'#f44336',fontWeight:700,fontSize:13}}>
                        {g.outcome}
                      </span>
                      {g.pointsEarned>0 && <span className={styles.recentPts}>+{g.pointsEarned} pts</span>}
                    </div>
                  </div>
                ))
              }
              {gs.matches.length > 0 && (
                <button className={styles.seeAll} onClick={()=>setTab('history')}>
                  See all {gs.matches.length} games →
                </button>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🎮 Game History</h3>
            {gs.matches.length === 0
              ? <div className={styles.emptyState}><div className={styles.emptyIcon}>🎮</div><p className={styles.emptyTitle}>No games yet</p></div>
              : (
                <table className={styles.histTable}>
                  <thead>
                    <tr><th>Game</th><th>Outcome</th><th>Position/Score</th><th>Points</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {gs.matches.map((g,i) => (
                      <tr key={i}>
                        <td className={styles.tdGame}>{g.game}</td>
                        <td>
                          <span style={{color:g.outcome==='Win'?'#4caf50':g.outcome==='Draw'?'#ff9800':'#f44336',fontWeight:700}}>
                            {g.outcome==='Win'?'🏆':g.outcome==='Draw'?'🤝':'💔'} {g.outcome}
                          </span>
                        </td>
                        <td>{g.position ? `${g.position}${g.position===1?'st':g.position===2?'nd':g.position===3?'rd':'th'} place` : g.score}</td>
                        <td><span className={styles.ptsBadge}>+{g.pointsEarned||0}</span></td>
                        <td className={styles.tdDate}>{fmtDate(g.playedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            }
          </div>
        )}

        {/* Wallet */}
        {tab === 'wallet' && (
          <div className={styles.walletGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>💰 Wallet</h3>
              <div className={styles.balanceBig}>{fmtMoney(balance)}</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,.45)',marginBottom:16}}>⭐ {points.toLocaleString()} points</div>
              {pending > 0 && <p className={styles.pending}>⏳ Pending: {fmtMoney(pending)}</p>}
              <h4 className={styles.subTitle}>Request Withdrawal</h4>
              {withdrawMsg && <div className={`${styles.msg} ${withdrawMsg.ok?styles.msgOk:styles.msgErr}`}>{withdrawMsg.text}</div>}
              <form onSubmit={handleWithdraw} className={styles.form}>
                <div className={styles.formRow}>
                  <label>Amount (৳)</label>
                  <input type="number" min="10" step="0.01" placeholder="10.00" required
                    value={withdrawForm.amount} onChange={e=>setWithdrawForm(f=>({...f,amount:e.target.value}))}/>
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
                    value={withdrawForm.accountInfo} onChange={e=>setWithdrawForm(f=>({...f,accountInfo:e.target.value}))}/>
                </div>
                <button className="btn btn-primary" type="submit" disabled={withdrawing}>
                  {withdrawing?'Submitting...':'Request Withdrawal'}
                </button>
              </form>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📋 Transactions</h3>
              {txnLoading ? <div className={styles.spinner}/> :
               txns.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>💳</div>
                  <p className={styles.emptyTitle}>No transactions yet</p>
                </div>
               ) : (
                <table className={styles.txnTable}>
                  <thead><tr><th>Type</th><th>Amount</th><th>Points</th><th>Reason</th><th>Date</th></tr></thead>
                  <tbody>
                    {txns.map((t,i) => (
                      <tr key={i}>
                        <td>{t.type||t.transactionType||'—'}</td>
                        <td className={(+(t.moneyDelta||t.amount||0))>=0?styles.txnPos:styles.txnNeg}>
                          {(+(t.moneyDelta||t.amount||0))>=0?'+':''}{fmtMoney(t.moneyDelta??t.amount)}
                        </td>
                        <td>{t.pointsDelta!=null?`${t.pointsDelta>=0?'+':''}${t.pointsDelta}`:'—'}</td>
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
