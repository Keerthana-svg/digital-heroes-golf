'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showLight, setShowLight] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
    setShowLight(true)
  }

  const handleMouseLeave = () => setShowLight(false)

  return (
    <main
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily: "'Inter', sans-serif",
        background: '#07130f',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .glass {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .glass:hover {
          border-color: rgba(74,222,128,0.2);
          box-shadow: 0 0 30px rgba(74,222,128,0.05);
        }

        .btn {
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: #052014;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: 0.3s;
          font-size: 1rem;
          letter-spacing: 0.03em;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(34,197,94,0.35), 0 0 60px rgba(34,197,94,0.15);
        }
        .btn:active { transform: translateY(0px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: white;
          outline: none;
          transition: 0.3s;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          margin-top: 6px;
          margin-bottom: 15px;
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

        .stat-card {
          padding: 1rem;
          text-align: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          transition: all 0.3s;
        }
        .stat-card:hover {
          border-color: rgba(74,222,128,0.3);
          background: rgba(74,222,128,0.05);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(74,222,128,0.1);
        }

        .form-card {
          width: 100%;
          padding: 2.5rem;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          transition: border-color 0.4s, box-shadow 0.4s;
        }

        .link-hover {
          color: #4ade80;
          cursor: pointer;
          transition: all 0.2s;
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

      {/* 🔦 HOVER LIGHT EFFECT */}
      {showLight && (
        <div style={{
          position: 'fixed',
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, rgba(74,222,128,0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 5,
          transition: 'opacity 0.2s',
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
        {/* Corner glows */}
        <div style={{ position: 'absolute', top: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>

      {/* LEFT INFO PANEL */}
      <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>

        {/* LOGO */}
        <div className="fade-in" style={{ fontWeight: 600, fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          onClick={() => router.push('/')}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(74,222,128,0.3)' }}>⛳</div>
          Golf<span style={{ color: '#4ade80' }}>Heroes</span>
        </div>

        {/* HERO TEXT */}
        <div className="fade-in-2">
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '1rem' }}>Welcome Back</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem,4vw,3.5rem)', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Welcome back to <br />
            <span style={{ color: '#4ade80' }}>your course</span>
          </h1>
          <p style={{ opacity: 0.5, maxWidth: 380, lineHeight: 1.75, fontSize: '0.9rem' }}>
            Track your golf scores, join monthly draws, and support real charities while playing the game you love.
          </p>
        </div>

        {/* STATS */}
        <div className="fade-in-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { v: '2.4K+', l: 'Players' },
            { v: '£48K', l: 'Prize Pool' },
            { v: '12', l: 'Charities' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ color: '#4ade80', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{s.v}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.4, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div style={{ width: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 10 }}>
        <div className="form-card fade-in-2">

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 6 }}>Sign In</h2>
          <p style={{ opacity: 0.4, fontSize: '0.85rem', marginBottom: '2rem' }}>Access your dashboard</p>

          <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Email</label>
          <input
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="off"
            suppressHydrationWarning={true}
          />

          <label style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            suppressHydrationWarning={true}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, marginBottom: 16 }}>
              <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>
            </div>
          )}

          <button
            className="btn"
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Login →'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '0.65rem', opacity: 0.3 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', opacity: 0.5 }}>
            New here?{' '}
            <span className="link-hover" onClick={() => router.push('/auth/signup')}>
              Create account
            </span>
          </p>

          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: 10, textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>🔒 Secured by Supabase Auth</p>
          </div>

        </div>
      </div>
    </main>
  )
}