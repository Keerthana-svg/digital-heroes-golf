'use client'
import { useRouter } from 'next/navigation'

export default function HowItWorks() {
  const router = useRouter()

  const steps = [
    {
      num: '01',
      title: 'Start with a Plan',
      icon: '💳',
      desc: 'Activate a premium subscription. Unlock all features and support charity.'
    },
    {
      num: '02',
      title: 'Enter Your Scores',
      icon: '⛳',
      desc: 'Log your Stableford points. Each score becomes your draw number.'
    },
    {
      num: '03',
      title: 'Monthly Draw',
      icon: '🎰',
      desc: '5 numbers are generated monthly. Match and win rewards.'
    },
    {
      num: '04',
      title: 'Win & Give Back',
      icon: '🏆',
      desc: 'Earn rewards while contributing to meaningful causes.'
    }
  ]

  return (
    <main className="min-h-screen text-white relative overflow-hidden">

      {/* 🌄 BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/6572955/pexels-photo-6572955.jpeg"
          className="w-full h-full object-cover scale-110"
        />

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-emerald-500/10" />
      </div>

      {/* FONT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
      `}</style>

      {/* NAVBAR */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-5 bg-black/40 backdrop-blur-md border-b border-white/10">

        <span
          onClick={() => router.push('/')}
          className="cursor-pointer text-xl font-bold hover:text-emerald-400 transition"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          ⛳ Golf<span className="text-emerald-400">Heroes</span>
        </span>

        <div className="flex gap-6 items-center">

          <button
            onClick={() => router.push('/charities')}
            className="text-sm text-gray-300 hover:text-emerald-400 transition relative group"
          >
            Charities
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-400 transition-all group-hover:w-full"></span>
          </button>

          <button
            onClick={() => router.push('/how-it-works')}
            className="text-sm text-emerald-400 relative group"
          >
            How It Works
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-emerald-400"></span>
          </button>

          <button
            onClick={() => router.push('/draws')}
            className="text-sm text-gray-300 hover:text-emerald-400 transition relative group"
          >
            Draws
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-400 transition-all group-hover:w-full"></span>
          </button>

          <button
            onClick={() => router.push('/subscribe')}
            className="bg-emerald-500 text-black px-4 py-2 rounded-full text-sm font-semibold
            hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 transition"
          >
            Subscribe
          </button>

        </div>
      </nav>

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-20">

        {/* HERO */}
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-4">
            The Platform
          </p>

          <h1
            className="text-5xl md:text-6xl font-bold mb-6 hover:scale-105 transition"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How It <span className="text-emerald-400 italic">Works</span>
          </h1>

          <p className="text-gray-300 max-w-lg mx-auto text-sm leading-relaxed">
            A premium ecosystem where your golf performance turns into rewards while supporting meaningful causes.
          </p>
        </div>

        {/* STEPS */}
        <div className="space-y-10 relative">

          {/* vertical glowing line */}
          <div className="hidden md:block absolute left-12 top-0 bottom-0 w-[2px]
            bg-gradient-to-b from-emerald-500/0 via-emerald-400 to-emerald-500/0 opacity-40" />

          {steps.map((s, i) => (
            <div
              key={i}
              className="relative flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-8 
              bg-white/5 border border-white/10 rounded-2xl
              hover:scale-[1.02] hover:border-emerald-400/40
              hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]
              transition duration-300"
            >

              {/* ICON */}
              <div className="shrink-0 z-10 w-16 h-16 rounded-full 
                bg-emerald-500/10 border-2 border-emerald-500/30 
                flex items-center justify-center
                hover:scale-110 hover:bg-emerald-500/20 transition"
              >
                <span className="text-2xl">{s.icon}</span>
              </div>

              {/* TEXT */}
              <div className="flex-1">
                <p
                  className="text-3xl font-bold text-emerald-400/20 mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.num}
                </p>

                <h3 className="text-2xl font-bold mb-3 hover:text-emerald-400 transition">
                  {s.title}
                </h3>

                <p className="text-gray-300 leading-relaxed text-sm">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button
            onClick={() => router.push('/subscribe')}
            className="bg-emerald-500 text-black px-10 py-4 rounded-full font-bold
            shadow-[0_0_25px_rgba(16,185,129,0.4)]
            hover:scale-110 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]
            transition duration-300"
          >
            Start Playing Now →
          </button>
        </div>

      </div>
    </main>
  )
}


