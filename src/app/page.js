'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main
      style={{
        background: '#0a0a0a',
        color: '#fff',
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
        overflowX: 'hidden'
      }}
    >

      {/* 🌟 GLOBAL STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .btn-primary:hover {
          background: #86efac !important;
          transform: translateY(-2px);
        }

        .glass {
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }

        .glass:hover {
          border: 1px solid rgba(74, 222, 128, 0.8);
          box-shadow: 0 0 20px rgba(74,222,128,0.25);
          transform: translateY(-3px);
        }
      `}</style>

      {/* 🌿 BACKGROUND (FIXED - CLEAR IMAGE) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img
          src="https://th.bing.com/th/id/OIP.hnLvEHmXl1F39Er52SJMXAHaDt?w=294&h=174&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
          alt="golf course"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',

            /* ✅ FIX: CLEAN + CLEAR VISIBILITY */
            filter: 'brightness(0.72) contrast(1.1) saturate(1.05)'
          }}
        />

        {/* 🌿 SOFT PREMIUM OVERLAY */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 30% 30%, rgba(74,222,128,0.12), transparent 55%),
              linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.75))
            `
          }}
        />
      </div>

      {/* CONTENT */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* NAVBAR */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 4rem',
            background: 'rgba(10,10,10,0.45)',
            backdropFilter: 'blur(14px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            position: 'sticky',
            top: 0
          }}
        >
          <div
            onClick={() => router.push('/')}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.4rem',
              cursor: 'pointer'
            }}
          >
            ⛳ Golf<span style={{ color: '#4ade80' }}>Heroes</span>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span className="glass" onClick={() => router.push('/charities')} style={{ padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer' }}>
              Charities
            </span>

            <span className="glass" onClick={() => router.push('/draws')} style={{ padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer' }}>
              Draws
            </span>

            <span className="glass" onClick={() => router.push('/auth/login')} style={{ padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer' }}>
              Login
            </span>


            <span className="glass" onClick={() => router.push('/how-it-works')} style={{ padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer' }}>
              How It Works
            </span>



            <button
              className="glass btn-primary"
              onClick={() => router.push('/subscribe')}
              style={{
                background: '#4ade80',
                color: '#0a0a0a',
                padding: '0.6rem 1.4rem',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Subscribe Now
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section
          style={{
            minHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '4rem 2rem'
          }}
        >
          <p style={{ color: '#4ade80', letterSpacing: '0.3em', fontSize: '0.75rem' }}>
            PLAY · WIN · GIVE BACK
          </p>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              marginTop: '1.5rem',
              lineHeight: 1.1
            }}
          >
            Golf with a<br />
            <span style={{ color: '#4ade80', fontStyle: 'italic' }}>
              Greater Purpose
            </span>
          </h1>

          <p style={{ maxWidth: 500, marginTop: '1.5rem', opacity: 0.7 }}>
            Enter your scores. Join monthly prize draws. Every subscription funds a charity you believe in.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button
              className="glass btn-primary"
              onClick={() => router.push('/subscribe')}
              style={{
                background: '#4ade80',
                padding: '0.9rem 2.5rem',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Start Playing →
            </button>

            <button
              className="glass"
              onClick={() => router.push('/charities')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '0.9rem 2rem',
                borderRadius: '100px',
                cursor: 'pointer'
              }}
            >
              Browse Charities
            </button>
          </div>
        </section>

        {/* STATS */}
        <section style={{ padding: '4rem 2rem', display: 'flex', justifyContent: 'center' }}>
          <div
            className="glass"
            style={{
              width: '100%',
              maxWidth: '1100px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              padding: '2rem',
              borderRadius: 20
            }}
          >
            {[
              { t: "💰 Jackpot", v: "£25,000" },
              { t: "🏆 Winners", v: "128" },
              { t: "🎯 Win Rate", v: "1 in 12" },
              { t: "❤️ Charity", v: "10%" }
            ].map((x, i) => (
              <div
                key={i}
                className="glass"
                style={{
                  borderRadius: 16,
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <p style={{ opacity: 0.6 }}>{x.t}</p>
                <h2 style={{ color: '#4ade80', fontSize: '2rem', marginTop: '0.5rem' }}>
                  {x.v}
                </h2>
              </div>
            ))}
          </div>
        </section>



        {/* FOOTER */}
        <footer
          style={{
            padding: '2rem',
            textAlign: 'center',
            opacity: 0.3,
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          © 2026 GolfHeroes
        </footer>

      </div>
    </main>
  )
}



