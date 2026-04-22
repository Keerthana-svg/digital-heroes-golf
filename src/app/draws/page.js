'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Draws() {
  const router = useRouter()
  const [draws, setDraws] = useState([])
  const [userScores, setUserScores] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: d } = await supabase
        .from('draws')
        .select('*')
        .order('created_at', { ascending: false })

      setDraws(d || [])

      if (user) {
        const { data: s } = await supabase
          .from('scores')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })

        setUserScores(s || [])
      }
    }
    init()
  }, [])

  const mockDraw = {
    month: 'April 2026',
    status: 'live',
    draw_numbers: [12, 27, 33, 41, 8]
  }

  const activeDraw = draws[0] || mockDraw

  const matchCount = userScores.filter(s =>
    activeDraw.draw_numbers?.includes(s.score)
  ).length

  return (
    <main className="min-h-screen text-white relative overflow-hidden">

      {/* 🌄 BACKGROUND (CLEAR + NO BLUR) */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/6572955/pexels-photo-6572955.jpeg"
          className="w-full h-full object-cover scale-105"
        />

        {/* stronger cinematic overlay */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />

        {/* subtle green glow */}
        <div className="absolute inset-0 bg-emerald-500/10" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-5 bg-black/40 backdrop-blur-md border-b border-white/10">
        <span
          onClick={() => router.push('/')}
          className="cursor-pointer text-xl font-bold hover:text-emerald-400 transition"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ⛳ Golf<span className="text-emerald-400">Heroes</span>
        </span>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/charities')}
            className="text-sm text-gray-300 hover:text-emerald-400 transition"
          >
            Charities
          </button>

          <button
            onClick={() => router.push(user ? '/dashboard' : '/auth/login')}
            className="bg-emerald-500 text-black px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 transition"
          >
            {user ? 'Dashboard' : 'Login'}
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        {/* HERO */}
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-emerald-400 mb-4">
            Monthly Prize System
          </p>

          <h1
            className="text-5xl md:text-6xl font-bold mb-4 hover:scale-105 transition"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Golf <span className="text-emerald-400 italic">Draws</span>
          </h1>

          <p className="text-gray-300 text-sm">
            Your performance becomes your lottery numbers 🎯
          </p>
        </div>

        {/* CURRENT DRAW */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10
          hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] transition">

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs text-gray-400 tracking-widest uppercase">
                Current Draw
              </p>

              <h2
                className="text-3xl font-bold mt-1 hover:text-emerald-400 transition"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {activeDraw.month}
              </h2>
            </div>

            <span className={`px-4 py-1 rounded-full text-xs border transition hover:scale-105
              ${activeDraw.status === 'live'
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
              }`}>
              {activeDraw.status}
            </span>
          </div>

          {/* NUMBERS */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 tracking-widest mb-4">
              Draw Numbers
            </p>

            <div className="flex flex-wrap gap-4">
              {activeDraw.draw_numbers.map((n, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-full flex items-center justify-center
                  bg-emerald-500/10 border border-emerald-400/40
                  hover:scale-110 hover:bg-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/20 transition"
                >
                  <span
                    className="text-2xl font-bold text-emerald-400"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {n}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MATCH STATUS */}
          {user && (
            <div className={`p-4 rounded-2xl border transition hover:scale-[1.02]
              ${matchCount > 0
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-white/5 border-white/10'
              }`}
            >
              <p className="text-sm font-semibold">
                {matchCount > 0
                  ? `🎉 You matched ${matchCount} number(s)!`
                  : '❌ No matches this time'
                }
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Your scores: {userScores.map(s => s.score).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* PRIZE CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          {[
            { title: 'Jackpot', pct: '40%', desc: '5 numbers match' },
            { title: 'Second Prize', pct: '35%', desc: '4 numbers match' },
            { title: 'Third Prize', pct: '25%', desc: '3 numbers match' },
          ].map((p, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center
              hover:scale-105 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10 transition"
            >
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                {p.title}
              </p>

              <h3
                className="text-4xl font-bold text-emerald-400 mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.pct}
              </h3>

              <p className="text-xs text-gray-500 mt-2">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8
          hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition">

          <h3
            className="text-2xl font-bold mb-6 hover:text-emerald-400 transition"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How It Works
          </h3>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              'Join subscription',
              'Add 5 golf scores',
              'Monthly number draw',
              'Win based on matches'
            ].map((t, i) => (
              <div
                key={i}
                className="hover:translate-y-[-4px] transition"
              >
                <p className="text-emerald-400 font-bold text-xl mb-2">
                  0{i + 1}
                </p>
                <p className="text-sm text-gray-300">{t}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}

