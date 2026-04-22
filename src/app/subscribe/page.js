'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Subscribe() {
  const router = useRouter()
  const [selected, setSelected] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const plans = [
    { id: 'monthly', label: 'Monthly', price: '£9.99', period: '/month', desc: 'Flexible billing. Cancel anytime.', savings: null },
    { id: 'yearly', label: 'Yearly', price: '£89.99', period: '/year', desc: 'Best value plan for serious players.', savings: 'Save 25%' },
  ]

  const handleSubscribe = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const renewalDate = new Date()
    renewalDate.setMonth(renewalDate.getMonth() + (selected === 'monthly' ? 1 : 12))

    const { error } = await supabase.from('subscriptions').upsert({
      user_id: user.id,
      plan: selected,
      status: 'active',
      renewal_date: renewalDate.toISOString().split('T')[0]
    }, { onConflict: 'user_id' })

    if (!error) {
      await supabase.from('profiles').update({
        subscription_plan: selected,
        subscription_status: 'active'
      }).eq('id', user.id)

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen text-white relative overflow-hidden bg-black">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e"
          className="w-full h-full object-cover opacity-20 scale-105"
          alt="golf"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* glow blobs */}
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-green-400/10 blur-3xl rounded-full" />
      </div>

      {/* NAV */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-6 border-b border-white/10">
        <span onClick={() => router.push('/')} className="text-xl font-bold cursor-pointer">
          ⛳ Golf<span className="text-emerald-400">Heroes</span>
        </span>
        <button onClick={() => router.push('/auth/login')}
          className="text-sm text-gray-400 hover:text-white transition">
          Login
        </button>
      </nav>

      {/* CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">

        {/* HEADER */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-emerald-400 uppercase mb-4">
            Membership Plans
          </p>

          <h1 className="text-5xl font-bold mb-4">
            Join the <span className="text-emerald-400 italic">Elite Club</span> ⛳
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto">
            Compete, win prizes, and contribute to meaningful causes — all through one premium golf experience.
          </p>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mb-10 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <p className="text-emerald-400 font-semibold text-lg">
              🎉 Membership Activated! Redirecting...
            </p>
          </div>
        )}

        {/* PLANS */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {plans.map(p => (
            <div
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-300 backdrop-blur-xl border 
              ${selected === p.id
                  ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 scale-[1.03]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
            >

              {p.savings && (
                <span className="absolute top-5 right-5 bg-emerald-400 text-black text-xs px-3 py-1 rounded-full font-bold">
                  💰 {p.savings}
                </span>
              )}

              <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">
                {p.label}
              </p>

              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold">{p.price}</span>
                <span className="text-gray-500 text-sm">{p.period}</span>
              </div>

              <p className="text-gray-400 text-sm mb-6">{p.desc}</p>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center 
                ${selected === p.id ? 'border-emerald-400 bg-emerald-400' : 'border-white/20'}`}>
                {selected === p.id && <div className="w-2 h-2 bg-black rounded-full" />}
              </div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">
            What You Get
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {[
              '⛳ Track your golf scores',
              '🎰 Enter monthly prize draws',
              '❤️ Support charities automatically',
              '📊 Performance insights dashboard',
              '🏆 Verified winners system',
              '🔄 Cancel anytime, no lock-in'
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <span className="text-emerald-400">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-black text-lg transition-all duration-300 
          bg-emerald-400 hover:bg-emerald-300 shadow-lg hover:shadow-emerald-400/30"
        >
          {loading ? 'Processing...' : `Join Now (${selected === 'monthly' ? 'Monthly' : 'Yearly'}) 🚀`}
        </button>

        <p className="text-center text-gray-600 text-xs mt-5">
          🔒 Secure · Cancel anytime · No hidden fees
        </p>
      </div>
    </main>
  )
}


