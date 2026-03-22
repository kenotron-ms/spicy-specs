import React from 'react'

/**
 * AppHeader — The ornate SPICY SPECS brand header
 * variant="hero"    → tall library homepage header (diamond frame, split title)
 * variant="compact" → inner screen header
 */
export default function AppHeader({ variant = 'hero' }) {
  if (variant === 'compact') {
    return (
      <header style={{ background: 'var(--color-bg-header)', boxShadow: 'var(--shadow-header)', overflow: 'hidden', position: 'relative' }}>
        {/* Scrollwork top */}
        <ScrollworkRail />

        {/* Center logo — diamond emblem with chili between SPICY and SPECS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0', gap: '0' }}>
          <DiamondEmblem size="compact" />
        </div>

        {/* Scrollwork bottom */}
        <ScrollworkRail flip />
      </header>
    )
  }

  // ── Hero variant ─────────────────────────────────────
  return (
    <header style={{ background: 'var(--color-bg-header)', position: 'relative', overflow: 'hidden' }}>
      {/* Full-width top decorative border rail */}
      <TopBorderRail />

      {/* Flanking scrollwork + center emblem */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 40px 12px', position: 'relative', zIndex: 1 }}>
        {/* Left scrollwork */}
        <HeroScrollwork />
        {/* Center diamond emblem */}
        <DiamondEmblem size="hero" />
        {/* Right scrollwork (mirrored) */}
        <HeroScrollwork mirror />
      </div>

      {/* Bottom border rail */}
      <BottomBorderRail />
    </header>
  )
}

// ── Diamond Emblem (center piece) ────────────────────────────────────────────

function DiamondEmblem({ size = 'hero' }) {
  const isHero = size === 'hero'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      padding: isHero ? '8px 32px' : '4px 16px',
    }}>
      {/* Outer diamond frame (SVG outline) */}
      <DiamondFrame isHero={isHero} />

      {/* SPICY text on top */}
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: isHero ? 'clamp(20px, 2.5vw, 28px)' : '14px',
        color: 'var(--color-text-header-pale)',
        letterSpacing: isHero ? '0.3em' : '0.2em',
        lineHeight: 1,
        marginBottom: isHero ? '6px' : '2px',
        position: 'relative',
        zIndex: 1,
      }}>
        SPICY
      </span>

      {/* Chili illustration */}
      <div style={{ position: 'relative', zIndex: 1, margin: isHero ? '4px 0' : '2px 0' }}>
        <ChiliHero size={isHero ? 60 : 32} />
      </div>

      {/* SPECS text below */}
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: isHero ? 'clamp(20px, 2.5vw, 28px)' : '14px',
        color: 'var(--color-text-header-pale)',
        letterSpacing: isHero ? '0.3em' : '0.2em',
        lineHeight: 1,
        marginTop: isHero ? '6px' : '2px',
        position: 'relative',
        zIndex: 1,
      }}>
        SPECS
      </span>

      {/* Subtitle below the emblem (hero only) */}
      {isHero && (
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '11px',
          color: 'rgba(255,244,203,0.65)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          margin: '10px 0 0',
          position: 'relative',
          zIndex: 1,
        }}>
          PATTERN LIBRARY · EST. 2026
        </p>
      )}
    </div>
  )
}

function DiamondFrame({ isHero }) {
  const w = isHero ? 160 : 90
  const h = isHero ? 140 : 80

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 160 140"
      fill="none"
      aria-hidden="true"
      style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
    >
      {/* Outer diamond */}
      <polygon
        points="80,4 154,70 80,136 6,70"
        stroke="rgba(255,244,203,0.4)"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Inner diamond */}
      <polygon
        points="80,12 146,70 80,128 14,70"
        stroke="rgba(255,244,203,0.25)"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Corner dots */}
      {[[80,4],[154,70],[80,136],[6,70]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="rgba(255,244,203,0.55)" />
      ))}
    </svg>
  )
}

// ── Scrollwork ────────────────────────────────────────────────────────────────

function HeroScrollwork({ mirror = false }) {
  return (
    <svg
      width="180"
      height="120"
      viewBox="0 0 180 120"
      fill="none"
      aria-hidden="true"
      style={{ transform: mirror ? 'scaleX(-1)' : 'none', flex: '0 0 auto' }}
    >
      {/* Main flowing curve */}
      <path d="M170 60 Q140 20 110 40 Q90 55 70 45 Q50 35 30 50 Q10 65 0 60"
        stroke="rgba(255,244,203,0.4)" strokeWidth="1.5" fill="none" />
      {/* Secondary curve */}
      <path d="M150 70 Q120 95 90 80 Q60 65 30 75 Q15 80 0 75"
        stroke="rgba(255,244,203,0.25)" strokeWidth="1" fill="none" />
      {/* Decorative nodes */}
      {[[110,40],[70,45],[30,50]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="rgba(255,244,203,0.45)" />
      ))}
      {/* Leaf/petal accents */}
      <ellipse cx="110" cy="40" rx="8" ry="4" fill="none" stroke="rgba(255,244,203,0.3)" strokeWidth="0.8" transform="rotate(-30 110 40)"/>
      <ellipse cx="70" cy="45" rx="8" ry="4" fill="none" stroke="rgba(255,244,203,0.3)" strokeWidth="0.8" transform="rotate(15 70 45)"/>
    </svg>
  )
}

function ScrollworkRail({ flip = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '3px 12px', transform: flip ? 'scaleY(-1)' : 'none' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,244,203,0.3)' }} />
      <svg width="180" height="12" viewBox="0 0 180 12" fill="none" aria-hidden="true">
        <path d="M0 6 Q22 1 45 6 Q67 11 90 6 Q112 1 135 6 Q157 11 180 6"
          stroke="rgba(255,244,203,0.45)" strokeWidth="1.2" fill="none" />
        {[45, 90, 135].map(x => (
          <circle key={x} cx={x} cy="6" r={x === 90 ? 2.5 : 2} fill="rgba(255,244,203,0.5)" />
        ))}
      </svg>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,244,203,0.3)' }} />
    </div>
  )
}

function TopBorderRail() {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: '18px', overflow: 'hidden' }}>
      {/* Repeating diamond-wave pattern */}
      <svg width="100%" height="18" viewBox="0 0 800 18" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <pattern id="topBorder" x="0" y="0" width="40" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 9 L10 2 L20 9 L30 2 L40 9" stroke="rgba(255,244,203,0.45)" strokeWidth="1.2" fill="none"/>
            <circle cx="20" cy="9" r="1.5" fill="rgba(255,244,203,0.5)" />
          </pattern>
        </defs>
        <rect width="800" height="18" fill="url(#topBorder)" />
        {/* Solid line */}
        <line x1="0" y1="17" x2="800" y2="17" stroke="rgba(255,244,203,0.25)" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

function BottomBorderRail() {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: '18px', overflow: 'hidden' }}>
      <svg width="100%" height="18" viewBox="0 0 800 18" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <pattern id="botBorder" x="0" y="0" width="40" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 9 L10 16 L20 9 L30 16 L40 9" stroke="rgba(255,244,203,0.45)" strokeWidth="1.2" fill="none"/>
            <circle cx="20" cy="9" r="1.5" fill="rgba(255,244,203,0.5)" />
          </pattern>
        </defs>
        <rect width="800" height="18" fill="url(#botBorder)" />
        <line x1="0" y1="1" x2="800" y2="1" stroke="rgba(255,244,203,0.25)" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

// ── Chili Illustration ────────────────────────────────────────────────────────

function ChiliHero({ size = 56 }) {
  return (
    <div style={{ width: size, height: size * 1.2, position: 'relative' }}>
      {/* Try actual asset */}
      <img
        src="/blueprints/library/assets/header-chili-illustration.png"
        alt="Chili pepper"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'block'
        }}
      />
      {/* Inline SVG fallback */}
      <svg
        style={{ display: 'none', width: '100%', height: '100%' }}
        viewBox="0 0 48 60"
        fill="none"
        aria-hidden="true"
      >
        {/* Stem */}
        <path d="M24 8 C24 4 27 3 29 5 C31 7 29 10 26 10"
          stroke="rgba(255,244,203,0.75)" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Body */}
        <path d="M24 10 C18 12 15 18 16 26 C17 33 21 40 24 52 C27 40 31 33 32 26 C33 18 30 12 24 10 Z"
          fill="rgba(255,244,203,0.85)" stroke="rgba(255,244,203,0.5)" strokeWidth="1" />
        {/* Highlight */}
        <path d="M21 16 C20 19 19.5 23 20 27"
          stroke="rgba(168,50,50,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
