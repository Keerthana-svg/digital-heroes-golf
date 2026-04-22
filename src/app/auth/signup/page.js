'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showLight, setShowLight] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    if (!name || !email || !password) { setError('Please fill in all fields.'); setLoading(false); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
    setShowLight(true)
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowLight(false)}
      style={{
        minHeight: '100vh', display: 'flex',
        fontFamily: "'Inter', sans-serif",
        background: '#07130f', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: white;
          outline: none;
          transition: 0.3s;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          margin-top: 6px;
          margin-bottom: 14px;
        }
        .input:focus {
          border-color: #4ade80;
          background: rgba(74,222,128,0.04);
          box-shadow: 0 0 20px rgba(74,222,128,0.1);
        }
        .input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #071a12 inset !important;
          -webkit-text-fill-color: #fff !important;
        }

        .btn {
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: #052014;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: 0.3s;
          font-size: 1rem;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(34,197,94,0.35), 0 0 60px rgba(34,197,94,0.15);
        }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .feature-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          transition: all 0.3s;
        }
        .feature-row:hover {
          border-color: rgba(74,222,128,0.25);
          background: rgba(74,222,128,0.04);
          transform: translateX(4px);
        }

        .prize-card {
          padding: 0.9rem;
          text-align: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          transition: all 0.3s;
        }
        .prize-card:hover {
          border-color: rgba(74,222,128,0.3);
          background: rgba(74,222,128,0.05);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(74,222,128,0.1);
        }

        .link-hover {
          color: #4ade80; cursor: pointer; transition: all 0.2s;
        }
        .link-hover:hover {
          text-shadow: 0 0 15px rgba(74,222,128,0.6);
          text-decoration: underline;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.6s ease forwards; }
        .fade-in-2 { animation: fadeInUp 0.6s ease 0.15s forwards; opacity: 0; }
        .fade-in-3 { animation: fadeInUp 0.6s ease 0.3s forwards; opacity: 0; }
      `}</style>

      {/* 🔦 HOVER LIGHT */}
      {showLight && (
        <div style={{
          position: 'fixed',
          left: mousePos.x - 200, top: mousePos.y - 200,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, rgba(74,222,128,0.03) 40%, transparent 70%)',
          pointerEvents: 'none', zIndex: 5, transition: 'opacity 0.2s',
        }} />
      )}

      {/* BACKGROUND */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1920&q=80"
          alt="golf"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #07130f 0%, rgba(7,19,15,0.85) 50%, #04110c 100%)' }} />
        <div style={{ position: 'absolute', top: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>

        {/* LOGO */}
        <div className="fade-in" onClick={() => router.push('/')}
          style={{ fontWeight: 600, fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(74,222,128,0.3)' }}>⛳</div>
          Golf<span style={{ color: '#4ade80' }}>Heroes</span>
        </div>

        {/* HERO TEXT */}
        <div className="fade-in-2">
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '1rem' }}>New Here?</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem,4vw,3.2rem)', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Start playing<br />
            <span style={{ color: '#4ade80' }}>with purpose.</span>
          </h1>
          <p style={{ opacity: 0.5, maxWidth: 360, lineHeight: 1.75, fontSize: '0.88rem', marginBottom: '2rem' }}>
            Join thousands of golfers who play, win prizes, and give back to charity every month.
          </p>

          {/* FEATURES */}
          {[
            { icon: '⛳', text: 'Enter your Stableford scores' },
            { icon: '🎰', text: 'Join monthly prize draws' },
            { icon: '❤️', text: 'Support your chosen charity' },
            { icon: '🏆', text: 'Win and give back' },
          ].map((f, i) => (
            <div key={i} className="feature-row">
              <span style={{ fontSize: '1rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* PRIZE CARDS */}
        <div className="fade-in-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { pct: '40%', label: 'Jackpot', color: '#facc15' },
            { pct: '35%', label: '4 Match', color: '#4ade80' },
            { pct: '25%', label: '3 Match', color: 'rgba(255,255,255,0.5)' },
          ].map((p, i) => (
            <div key={i} className="prize-card">
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: p.color }}>{p.pct}</p>
              <p style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div style={{ width: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 10 }}>
        <div className="fade-in-2" style={{
          width: '100%', padding: '2.5rem',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
        }}>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 6 }}>Create Account</h2>
          <p style={{ opacity: 0.4, fontSize: '0.85rem', marginBottom: '2rem' }}>Join GolfHeroes today</p>

          {/* NAME */}
          <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Full Name</label>
          <input
            className="input" value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Smith"
            autoComplete="off"
            suppressHydrationWarning={true}
          />

          {/* EMAIL */}
          <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Email Address</label>
          <input
            className="input" type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="off"
            suppressHydrationWarning={true}
          />

          {/* PASSWORD */}
          <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Password</label>
          <input
            className="input" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="6+ characters"
            autoComplete="new-password"
            suppressHydrationWarning={true}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
          />

          {/* ERROR */}
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, marginBottom: 16 }}>
              <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>
            </div>
          )}

          {/* BUTTON */}
          <button className="btn" onClick={handleSignup} disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, marginTop: 4 }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '0.65rem', opacity: 0.3 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', opacity: 0.5 }}>
            Already have an account?{' '}
            <span className="link-hover" onClick={() => router.push('/auth/login')}>
              Sign in here
            </span>
          </p>

          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: 10, textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
              🔒 Secured by Supabase Auth · Your data is safe
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}
