'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const [scores, setScores] = useState([])
  const [winner, setWinner] = useState(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      const { data: scoresData } = await supabase.from('scores').select('*').eq('user_id', user.id)
      setScores(scoresData || [])

      const { data: win } = await supabase.from('winners')
        .select('*').order('created_at', { ascending: false }).limit(1).single()
      setWinner(win)

      const { data: all } = await supabase.from('scores').select('donation')
      const sum = all?.reduce((a, b) => a + (b.donation || 0), 0)
      setTotal(sum || 0)

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (profile?.is_admin) setIsAdmin(true)

      setLoading(false)
    }

    init()
  }, [])

  if (loading) return <p style={{ padding: 20 }}>🎮 Loading Arena...</p>

  return (
    <main className="arena">

      {/* 🔥 BACKGROUND */}
      <div className="stadium-bg" />

      {/* HEADER */}
      <div className="header">
        <h1>🏌️ GOLF ARENA</h1>

        <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>
          🚪 Exit
        </button>
      </div>

      {/* HERO PANEL */}
      <div className="hero">
        <h2>🔥 Live Tournament Dashboard</h2>
        <p>Track performance. Win big. Support charity.</p>
      </div>

      {/* STATS */}
      <div className="stats">

        <div className="stat neon-green">
          🎯
          <h3>{scores.length}</h3>
          <span>Scores</span>
        </div>

        <div className="stat neon-blue">
          💰
          <h3>₹{total}</h3>
          <span>Donations</span>
        </div>

        <div className="stat neon-gold">
          🏆
          <h3>{winner?.name || '---'}</h3>
          <span>Winner</span>
        </div>

      </div>

      {/* ACTION GRID */}
      <div className="grid">

        {isAdmin && (
          <div className="panel" onClick={() => router.push('/admin')}>
            👑 Admin Control
          </div>
        )}

        <div className="panel" onClick={() => router.push('/draws')}>
          🎯 Draw Arena
        </div>

        <div className="panel" onClick={() => router.push('/charity')}>
          🌊 Charity Board
        </div>

        <div className="panel" onClick={() => router.push('/profile')}>
          👤 Player Profile
        </div>

      </div>

      {/* 🎨 STYLES */}
      <style jsx>{`
        .arena {
          min-height: 100vh;
          padding: 2rem;
          color: #fff;
          position: relative;
          overflow: hidden;
          background: #020706;
        }

        .stadium-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at center, rgba(0,255,150,0.15), transparent),
            url('https://th.bing.com/th/id/OIP.z1oy82AZzPGU6XqVTd7TdgHaEK?w=331&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3');
          background-size: cover;
          background-position: center;
          opacity: 0.25;
        }

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          z-index: 2;
          position: relative;
        }

        .hero {
          margin-bottom: 2rem;
          z-index: 2;
          position: relative;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 1rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .stat {
          padding: 1.5rem;
          border-radius: 14px;
          background: rgba(0,0,0,0.6);
          text-align: center;
          backdrop-filter: blur(10px);
          transition: 0.3s;
        }

        .stat:hover {
          transform: scale(1.05);
        }

        .neon-green { box-shadow: 0 0 20px #00ffae; }
        .neon-blue { box-shadow: 0 0 20px #00cfff; }
        .neon-gold { box-shadow: 0 0 20px #ffd700; }

        .grid {
  display: flex;
  justify-content: center;   /* CENTER horizontally */
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;           /* responsive */
}


        .panel {
          padding: 1.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          width: 220px; 
          cursor: pointer;
          transition: 0.3s;
          text-align: center;
        }

        .panel:hover {
          transform: translateY(-8px);
          box-shadow: 0 0 25px #00ffae;
          border-color: #00ffae;
        }

        h3 {
          font-size: 1.5rem;
          margin: 0.5rem 0;
        }

        span {
          font-size: 0.75rem;
          opacity: 0.7;
        }
      `}</style>

    </main>
  )
}

