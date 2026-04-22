'use client'
import { useState } from "react";
import Link from "next/link";

const hoverStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .charity-card {
    padding: 2rem;
    border-radius: 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    color: #fff;
    display: block;
    cursor: pointer;
  }
  .charity-card:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: rgba(74,222,128,0.45);
    background: rgba(74,222,128,0.07);
    box-shadow: 0 16px 48px rgba(74,222,128,0.15), 0 0 0 1px rgba(74,222,128,0.2);
  }
  .charity-card:hover .glow-overlay { opacity: 1 !important; }
  .charity-card:hover .card-emoji-badge {
    transform: scale(1.15) rotate(-5deg);
    box-shadow: 0 0 28px rgba(74,222,128,0.4);
    background: rgba(74,222,128,0.22);
  }
  .charity-card:hover .card-arrow {
    transform: translateX(5px);
    color: #86efac;
  }
  .charity-card:hover .card-title { color: #e0fce8; }

  .card-emoji-badge {
    width: 56px; height: 56px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.7rem;
    background: rgba(74,222,128,0.12);
    border: 1px solid rgba(74,222,128,0.25);
    box-shadow: 0 0 18px rgba(74,222,128,0.15);
    margin-bottom: 1rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    transition: color 0.3s ease;
  }

  .card-arrow {
    margin-top: 1.2rem;
    font-size: 0.75rem;
    color: #4ade80;
    transition: transform 0.3s ease, color 0.2s ease;
    display: inline-block;
  }

  .glow-overlay {
    position: absolute; inset: 0;
    background: radial-gradient(circle at top left, rgba(74,222,128,0.08), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .featured-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2.5rem;
    border-radius: 20px;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.25);
    backdrop-filter: blur(12px);
    color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .featured-card:hover {
    transform: translateY(-4px);
    background: rgba(74,222,128,0.13);
    border-color: rgba(74,222,128,0.5);
    box-shadow: 0 20px 60px rgba(74,222,128,0.2), 0 0 0 1px rgba(74,222,128,0.3);
  }
  .featured-card:hover .featured-emoji { transform: scale(1.2) rotate(8deg); }
  .featured-card:hover .featured-cta {
    background: #22c55e;
    transform: scale(1.05);
    box-shadow: 0 0 24px rgba(74,222,128,0.4);
  }

  .featured-emoji {
    font-size: 3rem;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    display: inline-block;
  }
  .featured-cta {
    background: #4ade80;
    color: #000;
    padding: 0.8rem 1.8rem;
    border-radius: 100px;
    font-weight: 600;
    font-size: 0.95rem;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.3s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .nav-link {
    opacity: 0.7;
    color: #fff;
    transition: opacity 0.2s ease, color 0.2s ease;
    position: relative;
    cursor: pointer;
  }
  .nav-link:hover { opacity: 1; color: #86efac; }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0;
    width: 0; height: 1px;
    background: #4ade80;
    transition: width 0.25s ease;
  }
  .nav-link:hover::after { width: 100%; }

  .nav-subscribe {
    color: #4ade80 !important;
    font-weight: 600;
    opacity: 1 !important;
    padding: 0.4rem 1rem;
    border: 1px solid rgba(74,222,128,0.35);
    border-radius: 100px;
    transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }
  .nav-subscribe:hover {
    background: rgba(74,222,128,0.12);
    box-shadow: 0 0 16px rgba(74,222,128,0.25);
    transform: scale(1.04);
  }
  .nav-subscribe::after { display: none; }

  .stat-block {
    padding: 2rem;
    text-align: center;
    transition: background 0.3s ease;
  }
  .stat-block:hover { background: rgba(74,222,128,0.05); }
  .stat-value {
    color: #4ade80;
    font-size: 2rem;
    font-weight: 700;
    transition: transform 0.3s ease;
    display: inline-block;
  }
  .stat-block:hover .stat-value { transform: scale(1.08); }
`;

const charities = [
  { id: 1, name: "Green Earth Foundation", description: "Restoring ecosystems worldwide, one tree at a time.", is_featured: true, emoji: "🌍" },
  { id: 2, name: "Children First", description: "Education & nutrition support for children in need.", is_featured: false, emoji: "🧒" },
  { id: 3, name: "Ocean Cleanup Project", description: "Removing plastic waste from our oceans daily.", is_featured: false, emoji: "🐋" },
  { id: 4, name: "Veterans Support Fund", description: "Housing & healthcare for those who served.", is_featured: false, emoji: "🎖️" },
  { id: 5, name: "Hunger Relief Network", description: "Fighting food insecurity in local communities.", is_featured: false, emoji: "🍽️" },
  { id: 6, name: "Wildlife Sanctuary Trust", description: "Protecting endangered species and habitats.", is_featured: false, emoji: "🦁" },
];

export default function Charities() {
  const featured = charities.find((c) => c.is_featured);
  const others = charities.filter((c) => !c.is_featured);

  return (
    <main style={{ background: "#050705", color: "#fff", minHeight: "100vh" }}>
      <style>{hoverStyles}</style>

      {/* BACKGROUND */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <img
          src="https://th.bing.com/th/id/OIP.uKjGCFSrXSddTRIpW6yHigHaFk?w=237&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) contrast(1.1)" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at top, rgba(74,222,128,0.15), transparent 60%),
                       linear-gradient(180deg, rgba(0,0,0,0.3), #050705)`
        }} />
      </div>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 10 }}>

        {/* NAVBAR */}
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.5rem 3rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          background: "rgba(0,0,0,0.4)"
        }}>
          <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", cursor: "pointer", textDecoration: "none", color: "#fff" }}>
            ⛳ Golf<span style={{ color: "#4ade80" }}>Heroes</span>
          </Link>
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.9rem", alignItems: "center" }}>
            <Link href="/draws" className="nav-link">🎯 Draws</Link>
            <Link href="/auth/login" className="nav-link">🔐 Login</Link>
            <Link href="/subscribe" className="nav-link nav-subscribe">🚀 Subscribe</Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ textAlign: "center", padding: "6rem 2rem 3rem" }}>
          <p style={{ color: "#4ade80", letterSpacing: "0.3em", fontSize: "0.75rem" }}>
            🌍 IMPACT · ⛳ GOLF · ❤️ COMMUNITY
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3rem,6vw,5rem)",
            marginTop: "1.5rem", lineHeight: 1.15
          }}>
            Choose a Cause That<br />
            <span style={{ color: "#4ade80", fontStyle: "italic" }}>Matters to You ❤️</span>
          </h1>
          <p style={{ maxWidth: 520, margin: "1.5rem auto", opacity: 0.6, lineHeight: 1.6 }}>
            🏌️ Turn your golf game into real-world impact by supporting meaningful charities.
          </p>
        </section>

        {/* FEATURED CARD */}
        {featured && (
          <div style={{ padding: "0 2rem", marginBottom: "4rem" }}>
            <Link href="/subscribe" className="featured-card" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <span className="featured-emoji">{featured.emoji}</span>
                <div>
                  <p style={{ color: "#4ade80", fontSize: "0.7rem", letterSpacing: "0.2em", marginBottom: "0.4rem" }}>
                    ⭐ FEATURED CHARITY
                  </p>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem" }}>
                    {featured.name}
                  </h2>
                  <p style={{ opacity: 0.6, maxWidth: 500, marginTop: "0.5rem" }}>
                    {featured.description}
                  </p>
                </div>
              </div>
              <span className="featured-cta">❤️ Support →</span>
            </Link>
          </div>
        )}

        {/* CHARITY GRID */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          padding: "0 2rem 4rem"
        }}>
          {others.map((c) => (
            <Link key={c.id} href="/subscribe" className="charity-card" style={{ textDecoration: "none" }}>
              <div className="card-emoji-badge">{c.emoji}</div>
              <h3 className="card-title">{c.name}</h3>
              <p style={{ opacity: 0.55, fontSize: "0.9rem", marginTop: "0.5rem", lineHeight: 1.5 }}>
                {c.description}
              </p>
              <span className="card-arrow">🤝 Support this cause →</span>
              <div className="glow-overlay" />
            </Link>
          ))}
        </section>

        {/* IMPACT BAR */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.4)"
        }}>
          {[
            { v: "10%+", l: "💰 Donation Rate" },
            { v: "12", l: "🌍 Active Charities" },
            { v: "£9.6K", l: "❤️ Monthly Impact" },
          ].map((s, i) => (
            <div key={i} className="stat-block">
              <div className="stat-value">{s.v}</div>
              <p style={{ opacity: 0.5, fontSize: "0.75rem", marginTop: "0.3rem" }}>{s.l}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}