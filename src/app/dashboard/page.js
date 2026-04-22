'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [scores, setScores] = useState([])
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState('')
  const [courseName, setCourseName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [winner, setWinner] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [amount, setAmount] = useState('')
  const [total, setTotal] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showLight, setShowLight] = useState(false)

  const fetchWinner = async () => {
    const { data } = await supabase.from('draws').select('*').order('created_at', { ascending: false }).limit(1)
    setWinner(data?.[0])
  }

  const fetchTotal = async () => {
    const { data } = await supabase.from('donations').select('amount')
    if (data) setTotal(data.reduce((acc, d) => acc + d.amount, 0))
  }

  const checkSub = async (userId) => {
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', userId).eq('status', 'active')
    if (data && data.length > 0) setIsPro(true)
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      await fetchScores(user.id)
      await fetchWinner()
      await fetchTotal()
      await checkSub(user.id)
      setLoading(false)
    }
    init()
  }, [])

  const fetchScores = async (userId) => {
    const { data } = await supabase.from('scores').select('*').eq('user_id', userId).order('date', { ascending: false })
    setScores(data || [])
  }

  const addScore = async () => {
    setError('')
    setSuccess('')
    const s = parseInt(newScore)
    if (!courseName || !newScore || !newDate) { setError('Please enter course, score, and date.'); return }
    if (s < 1 || s > 45) { setError('Score must be between 1 and 45.'); return }
    const exists = scores.find(sc => sc.date === newDate)
    if (exists) { setError('A score for this date already exists.'); return }
    if (scores.length >= 5) {
      const oldest = [...scores].sort((a, b) => new Date(a.date) - new Date(b.date))[0]
      await supabase.from('scores').delete().eq('id', oldest.id)
    }
    const { error } = await supabase.from('scores').insert({ user_id: user.id, course_name: courseName, score: s, date: newDate })
    if (error) { setError(error.message); return }
    await supabase.from('tickets').insert([{ user_id: user.id }])
    setSuccess('Score added successfully.')
    setCourseName(''); setNewScore(''); setNewDate('')
    await fetchScores(user.id)
  }

  const deleteScore = async (id) => {
    await supabase.from('scores').delete().eq('id', id)
    await fetchScores(user.id)
  }

  const drawWinner = async () => {
    const { data: tickets } = await supabase.from('tickets').select('*')
    if (!tickets || !tickets.length) return alert('No participants yet.')
    const random = tickets[Math.floor(Math.random() * tickets.length)]
    await supabase.from('draws').insert([{ month: 'April', winner_id: random.user_id }])
    alert('Winner selected.')
    await fetchWinner()
  }

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) return alert('Please enter a valid amount.')
    const { error } = await supabase.from('donations').insert([{ user_id: user.id, amount: Number(amount) }])
    if (!error) { alert('Donation recorded. Thank you.'); setAmount(''); await fetchTotal() }
    else alert('Error: ' + error.message)
  }

  const handleSubscribe = async () => {
    const { error } = await supabase.from('subscriptions').insert([{ user_id: user.id, plan: 'pro', status: 'active' }])
    if (!error) { alert('Welcome to Pro.'); setIsPro(true) }
    else alert('Error: ' + error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }



  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060e09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#4ade80', fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>Loading</p>
    </div>
  )

  return (
    <main
      onMouseMove={e => { setMousePos({ x: e.clientX, y: e.clientY }); setShowLight(true) }}
      onMouseLeave={() => setShowLight(false)}
      style={{ minHeight: '100vh', background: '#060e09', color: '#fff', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --green: #4ade80;
          --green-dim: rgba(74,222,128,0.1);
          --green-border: rgba(74,222,128,0.2);
          --surface: rgba(255,255,255,0.035);
          --border: rgba(255,255,255,0.065);
          --text-muted: rgba(255,255,255,0.32);
          --text-dim: rgba(255,255,255,0.17);
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--green-border); border-radius: 4px; }

        .card {
          background: rgba(5,12,7,0.72);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid var(--border);
          border-radius: 20px;
          transition: border-color 0.35s, box-shadow 0.35s, transform 0.35s;
        }
        .card:hover {
          border-color: var(--green-border);
          box-shadow: 0 0 52px rgba(74,222,128,0.05), 0 28px 72px rgba(0,0,0,0.5);
          transform: translateY(-2px);
        }

        .input-field {
          width: 100%;
          padding: 11px 15px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: rgba(0,0,0,0.38);
          color: #fff;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
          margin-top: 5px;
        }
        .input-field:focus {
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(74,222,128,0.07);
          background: rgba(74,222,128,0.025);
        }
        .input-field::placeholder { color: var(--text-dim); }

        .btn-primary {
          background: var(--green);
          color: #021408;
          font-weight: 700;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
          transition: transform 0.25s, box-shadow 0.25s, filter 0.25s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 44px rgba(74,222,128,0.32);
          filter: brightness(1.07);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          padding: 7px 17px;
          border-radius: 100px;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.25s, color 0.25s;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
        }
        .btn-ghost:hover {
          border-color: var(--green-border);
          color: var(--green);
        }

        .score-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(0,0,0,0.28);
          border: 1px solid var(--border);
          transition: border-color 0.25s, background 0.25s;
          margin-bottom: 8px;
        }
        .score-row:hover {
          border-color: var(--green-border);
          background: rgba(74,222,128,0.025);
        }

        .stat-card {
          padding: 1.5rem 1rem;
          text-align: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          transition: border-color 0.3s, background 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .stat-card:hover {
          border-color: var(--green-border);
          background: var(--green-dim);
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(74,222,128,0.07);
        }

        .quick-card {
          padding: 1.75rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          transition: border-color 0.3s, background 0.3s, transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .quick-card:hover {
          border-color: var(--green-border);
          background: var(--green-dim);
          transform: translateY(-5px);
          box-shadow: 0 18px 52px rgba(74,222,128,0.08);
        }

        .label {
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-dim);
          display: block;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .eyebrow {
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--green);
          margin-bottom: 0.4rem;
          display: block;
          font-weight: 600;
        }

        .serif { font-family: 'Cormorant Garamond', serif; }

        .tag {
          background: var(--green-dim);
          border: 1px solid var(--green-border);
          color: var(--green);
          font-size: 0.56rem;
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .tag-pro {
          background: rgba(250,204,21,0.07);
          border: 1px solid rgba(250,204,21,0.22);
          color: #facc15;
          font-size: 0.56rem;
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
        }

        hr.divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.4rem 0;
        }

        .deco-line {
          display: inline-block;
          width: 26px;
          height: 1px;
          background: var(--green);
          vertical-align: middle;
          margin-right: 10px;
          opacity: 0.55;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.55s ease both; }
        .fade-up-2 { animation: fadeUp 0.55s 0.10s ease both; }
        .fade-up-3 { animation: fadeUp 0.55s 0.20s ease both; }
        .fade-up-4 { animation: fadeUp 0.55s 0.30s ease both; }
      `}</style>

      {/* CURSOR GLOW */}
      {showLight && (
        <div style={{
          position: 'fixed',
          left: mousePos.x - 320, top: mousePos.y - 320,
          width: 640, height: 640, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.045) 0%, rgba(74,222,128,0.012) 40%, transparent 70%)',
          pointerEvents: 'none', zIndex: 5,
        }} />
      )}

      {/* BACKGROUND */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1920&q=80"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', opacity: 0.55 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(175deg, rgba(6,14,9,0.82) 0%, rgba(6,14,9,0.6) 40%, rgba(4,12,7,0.78) 100%)' }} />
        <div style={{ position: 'absolute', top: -280, left: -180, width: 680, height: 680, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.035) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -200, right: -160, width: 580, height: 580, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.028) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* Grain */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, opacity: 0.025, backgroundSize: '200px' }} />
      </div>

      {/* PAGE CONTENT */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 3rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(6,14,9,0.84)',
          backdropFilter: 'blur(32px)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{
              width: 33, height: 33, borderRadius: '50%',
              border: '1.5px solid #4ade80',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(74,222,128,0.22)',
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="2.5" fill="#4ade80" />
                <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="serif" style={{ fontSize: '1.22rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              ⛳ Golf<em style={{ color: '#4ade80' }}>Heroes</em>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>{user?.email}</span>
            {isPro && <span className="tag-pro">Pro</span>}
            <button className="btn-ghost" onClick={() => router.push('/charities')}>❤️ Charities</button>
            <button className="btn-ghost" onClick={() => router.push('/draws')}>🎰 Draws</button>
            <button className="btn-ghost" onClick={handleLogout}>🚪 Sign Out</button>
          </div>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3.5rem 3rem' }}>

          {/* WELCOME */}
          <div className="fade-up" style={{ marginBottom: '3rem' }}>
            <span className="eyebrow"><span className="deco-line" />⛳ Dashboard</span>
            <h1 className="serif" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              Welcome back,{' '}
              <em style={{ color: '#4ade80' }}>{user?.user_metadata?.name || 'Player'}</em> 👋
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.55rem', fontStyle: 'italic', letterSpacing: '0.03em' }}>
              🏌️ Play. Compete. Give back.
            </p>
          </div>

          {/* STATS */}
          <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: '💳 Subscription', val: isPro ? 'Pro' : 'Free', sub: isPro ? 'Active plan' : 'Upgrade available', accent: isPro ? '#facc15' : '#4ade80' },
              { label: '⛳ Scores Entered', val: `${scores.length} / 5`, sub: 'Rounds logged', accent: '#4ade80' },
              { label: '🎰 Next Draw', val: 'May 1st', sub: '2026', accent: '#4ade80' },
              { label: '❤️ Charity Share', val: '10%', sub: 'of all proceeds', accent: '#f87171' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <p style={{ fontSize: '0.52rem', color: 'var(--text-dim)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>{s.label}</p>
                <p className="serif" style={{ fontSize: '2.1rem', fontWeight: 700, color: s.accent, lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: '0.63rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* UPGRADE BANNER */}
          {!isPro && (
            <div className="fade-up-2" style={{
              marginBottom: '2rem', padding: '1.5rem 2rem',
              background: 'linear-gradient(120deg, rgba(74,222,128,0.065), rgba(74,222,128,0.015))',
              border: '1px solid var(--green-border)', borderRadius: 18,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem',
            }}>
              <div>
                <span className="eyebrow">💎 Premium Access</span>
                <h3 className="serif" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.3rem', letterSpacing: '-0.01em' }}>Upgrade to Pro</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  🔓 Unlock admin controls, run monthly lottery draws, and maximise charity impact.
                </p>
              </div>
              <button className="btn-primary" onClick={handleSubscribe}
                style={{ padding: '0.8rem 2.2rem', borderRadius: '100px', fontSize: '0.82rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                🚀 Upgrade to Pro
              </button>
            </div>
          )}

          {/* MAIN GRID */}
          <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

            {/* SCORE ENTRY */}
            <div className="card" style={{ padding: '2.25rem' }}>
              <span className="eyebrow">⛳ Score Entry</span>
              <h2 className="serif" style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '1.75rem', letterSpacing: '-0.01em' }}>Add New Score</h2>

              <label className="label">🏌️ Course Name</label>
              <input className="input-field" type="text" value={courseName}
                onChange={e => setCourseName(e.target.value)} placeholder="e.g. St Andrews" />

              <label className="label" style={{ marginTop: '1rem' }}>📊 Stableford Score (1&ndash;45)</label>
              <input className="input-field" type="number" min="1" max="45" value={newScore}
                onChange={e => setNewScore(e.target.value)} placeholder="e.g. 32" />

              <label className="label" style={{ marginTop: '1rem' }}>📅 Date Played</label>
              <input className="input-field" type="date" value={newDate}
                onChange={e => setNewDate(e.target.value)} style={{ colorScheme: 'dark' }} />

              {error && (
                <div style={{ marginTop: '0.9rem', padding: '0.65rem 1rem', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.16)', borderRadius: 10 }}>
                  <p style={{ color: '#f87171', fontSize: '0.8rem' }}>⚠️ {error}</p>
                </div>
              )}
              {success && (
                <div style={{ marginTop: '0.9rem', padding: '0.65rem 1rem', background: 'rgba(74,222,128,0.06)', border: '1px solid var(--green-border)', borderRadius: 10 }}>
                  <p style={{ color: '#4ade80', fontSize: '0.8rem' }}>✅ {success}</p>
                </div>
              )}

              <button className="btn-primary" onClick={addScore}
                style={{ width: '100%', padding: '0.9rem', borderRadius: '100px', fontSize: '0.85rem', marginTop: '1.2rem' }}>
                ➕ Add Score
              </button>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '0.8rem', letterSpacing: '0.04em' }}>
                Latest 5 scores kept &middot; No duplicate dates
              </p>
            </div>

            {/* SCORES LIST */}
            <div className="card" style={{ padding: '2.25rem' }}>
              <span className="eyebrow">📋 My Scores</span>
              <h2 className="serif" style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '1.75rem', letterSpacing: '-0.01em' }}>Last 5 Rounds</h2>

              {scores.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180, textAlign: 'center', gap: '0.5rem' }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ opacity: 0.18 }}>
                    <circle cx="18" cy="18" r="11" stroke="#4ade80" strokeWidth="1.4" />
                    <circle cx="18" cy="18" r="2.8" fill="#4ade80" />
                    <line x1="18" y1="4" x2="18" y2="8" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" />
                    <line x1="18" y1="28" x2="18" y2="32" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" />
                    <line x1="4" y1="18" x2="8" y2="18" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" />
                    <line x1="28" y1="18" x2="32" y2="18" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No rounds yet</p>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>Add your first score to get started.</p>
                </div>
              ) : (
                scores.map((s, i) => (
                  <div key={s.id} className="score-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'rgba(74,222,128,0.3)', width: 22, flexShrink: 0 }}>#{i + 1}</span>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: '0.88rem', marginBottom: 2 }}>
                          {s.course_name || 'Golf Course'}
                          <span style={{ color: '#4ade80', marginLeft: 8, fontWeight: 600 }}>{s.score} pts</span>
                        </p>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                          {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <span className="tag">Stableford</span>
                      <button onClick={() => deleteScore(s.id)}
                        style={{ color: 'rgba(248,113,113,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, transition: 'color 0.2s', padding: '2px 4px' }}
                        onMouseOver={e => e.target.style.color = '#f87171'}
                        onMouseOut={e => e.target.style.color = 'rgba(248,113,113,0.3)'}>
                        &times;
                      </button>
                    </div>
                  </div>
                ))
              )}

              {scores.length > 0 && (
                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', letterSpacing: '0.04em' }}>
                  🎰 These scores are your entries for the May 2026 draw
                </p>
              )}

              {/* DRAW SYSTEM */}
              <hr className="divider" />
              <span className="eyebrow" style={{ color: '#facc15' }}>🎰 Monthly Draw</span>
              {isPro ? (
                <>
                  <button onClick={drawWinner}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: 10, marginTop: '0.5rem',
                      background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.22)',
                      color: '#facc15', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem',
                      transition: 'background 0.25s, color 0.25s', fontFamily: 'DM Sans, sans-serif',
                      letterSpacing: '0.05em',
                    }}
                    onMouseOver={e => { e.target.style.background = '#facc15'; e.target.style.color = '#000' }}
                    onMouseOut={e => { e.target.style.background = 'rgba(250,204,21,0.07)'; e.target.style.color = '#facc15' }}>
                    🎲 Run Monthly Draw
                  </button>
                  {winner && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.16)', borderRadius: 10 }}>
                      <p style={{ color: '#facc15', fontSize: '0.78rem', fontWeight: 600 }}>🏆 Winner &mdash; {winner.month}</p>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.67rem', wordBreak: 'break-all', marginTop: 4 }}>{winner.winner_id}</p>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.12)', borderRadius: 10, textAlign: 'center' }}>
                  <p style={{ color: '#f87171', fontSize: '0.8rem' }}>🔒 Upgrade to Pro to run draws</p>
                </div>
              )}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: '❤️ Your Charity', desc: 'Select and support your chosen charity', cta: 'Select Charity', route: '/charities', accent: '#f87171' },
              { label: '🎰 Monthly Draw', desc: 'Next draw: May 1st, 2026', cta: 'View Draws', route: '/draws', accent: '#facc15' },
              { label: '👑 Admin Panel', desc: 'Manage users, draws & charities', cta: 'Open Admin', route: '/admin', accent: '#c084fc' },
            ].map((c, i) => (
              <div key={i} className="quick-card" onClick={() => router.push(c.route)}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${c.accent}12`, border: `1px solid ${c.accent}28`, marginBottom: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.accent }} />
                </div>
                <h3 className="serif" style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{c.label}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.3rem', lineHeight: 1.65 }}>{c.desc}</p>
                <p style={{ fontSize: '0.6rem', color: c.accent, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>{c.cta} &rarr;</p>
              </div>
            ))}
          </div>

          {/* CHARITY DONATION */}
          <div className="fade-up-4 card" style={{ padding: '2.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <span className="eyebrow" style={{ color: '#f87171' }}>❤️ Charity Impact</span>
                <h2 className="serif" style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '0.7rem', letterSpacing: '-0.01em' }}>💝 Donate to Charity</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 420, lineHeight: 1.78 }}>
                  Every contribution goes directly to active charities supported by the GolfHeroes community. 🌍
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input className="input-field" type="number" placeholder="💷 Amount" value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ width: 150, marginTop: 0 }} />
                  <button onClick={handleDonate}
                    style={{
                      padding: '0.75rem 1.6rem', borderRadius: 10,
                      background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.22)',
                      color: '#f87171', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem',
                      transition: 'background 0.25s, color 0.25s', fontFamily: 'DM Sans, sans-serif',
                      letterSpacing: '0.05em',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.color = '#fff' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.07)'; e.currentTarget.style.color = '#f87171' }}>
                    ❤️ Donate
                  </button>
                </div>
              </div>

              <div style={{
                padding: '1.75rem 2.25rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                borderRadius: 18, textAlign: 'center', minWidth: 210, flexShrink: 0,
              }}>
                <p style={{ fontSize: '0.52rem', color: 'var(--text-dim)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 600 }}>🌍 Total Donated</p>
                <p className="serif" style={{ fontSize: '2.9rem', fontWeight: 700, color: '#f87171', lineHeight: 1 }}>
                  &pound;{total.toLocaleString()}
                </p>
                <p style={{ fontSize: '0.63rem', color: 'var(--text-dim)', marginTop: '0.45rem' }}>Community donations</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}