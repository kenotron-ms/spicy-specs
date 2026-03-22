import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import FilterBar from '../components/FilterBar'
import ChiliRating from '../components/ChiliRating'
import { ENTRIES } from '../data/entries'

// Banner colors per type
const BANNER_COLORS = {
  SPEC:        '#A83232',
  ANTIPATTERN: '#1E5A2D',
  REFERENCE:   '#C9975B',
  PATTERN:     '#8B7355',
  PHILOSOPHY:  '#2D2D2D',
}
const TYPE_LABELS = {
  SPEC:        'SPEC',
  ANTIPATTERN: 'ANTI-PATTERN',
  REFERENCE:   'REFERENCE APP',
  PATTERN:     'PATTERN',
  PHILOSOPHY:  'PHILOSOPHY',
}

export default function LibraryScreen() {
  const navigate  = useNavigate()
  const [query,   setQuery]  = useState('')
  const [filter,  setFilter] = useState('ALL')

  const filtered = useMemo(() => {
    let list = ENTRIES
    if (filter !== 'ALL') list = list.filter(e => e.type === filter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [query, filter])

  const handleCardClick = (entry) => {
    navigate(`/entry/${entry.slug}`)
  }

  const handleSearch = (q) => {
    setQuery(q)
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-screen)' }}>
      <AppHeader variant="hero" />

      <FilterBar
        query={query}
        onQueryChange={q => setQuery(q)}
        activeFilter={filter}
        onFilterChange={setFilter}
        count={filtered.length}
      />

      {/* Card Grid */}
      <div
        style={{
          padding: '28px 48px 48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '20px',
        }}
      >
        {filtered.map(entry => (
          <EntryCard key={entry.id} entry={entry} onClick={() => handleCardClick(entry)} />
        ))}
      </div>
    </div>
  )
}

function EntryCard({ entry, onClick }) {
  const bannerColor = BANNER_COLORS[entry.type] || '#A83232'
  const typeLabel   = TYPE_LABELS[entry.type]   || entry.type

  return (
    <article
      className="entry-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      style={{
        background: 'var(--color-bg-card)',
        backgroundImage: 'url(/blueprints/library/assets/parchment-background-texture.png)',
        backgroundSize: '300px 300px',
        border: '2px solid var(--color-accent-gold)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Corner ornaments */}
      <CornerOrnaments color={bannerColor} />

      {/* Category banner */}
      <div
        style={{
          background: bannerColor,
          padding: '7px 12px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '12px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '160px' }}>
        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
            margin: 0,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            flex: '0 0 auto',
          }}
        >
          {entry.title}
        </h2>

        {/* Divider flourish */}
        <DividerFlourish color={bannerColor} />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Heat rating */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ChiliRating heat={entry.heat} size={18} />
        </div>

        {/* Metadata */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          }}
        >
          {entry.meta}
        </p>
      </div>

      {/* URL button */}
      <div
        style={{
          background: '#2D2D2D',
          padding: '6px 12px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
        >
          {entry.url}
        </span>
      </div>
    </article>
  )
}

function DividerFlourish({ color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
      {/* Try actual asset */}
      <img
        src="/blueprints/library/assets/card-divider-flourish.png"
        alt=""
        style={{ width: '100%', height: 'auto', maxHeight: '16px', objectFit: 'contain', display: 'block' }}
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
      {/* SVG fallback */}
      <div style={{ display: 'none', alignItems: 'center', gap: '4px', width: '100%' }}>
        <div style={{ flex: 1, height: '1px', background: `${color}55` }} />
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
          <path d="M9 1 Q6 5 3 5 Q6 5 9 9 Q12 5 15 5 Q12 5 9 1 Z" fill={color} opacity="0.7" />
        </svg>
        <div style={{ flex: 1, height: '1px', background: `${color}55` }} />
      </div>
    </div>
  )
}

function CornerOrnaments({ color }) {
  // Victorian-style corner bracket ornaments using SVG
  const corners = [
    { top: 3, left: 3,   rotate: 0 },
    { top: 3, right: 3,  rotate: 90 },
    { bottom: 3, right: 3, rotate: 180 },
    { bottom: 3, left: 3,  rotate: 270 },
  ]

  return (
    <>
      {corners.map((c, i) => {
        const { rotate, ...posStyle } = c
        return (
          <div key={i} style={{ position: 'absolute', width: 14, height: 14, ...posStyle, zIndex: 2 }} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
              {/* L-shaped bracket with flourish */}
              <path d="M1 13 L1 2 Q1 1 2 1 L13 1" stroke={`${color}90`} strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <circle cx="1" cy="1" r="1.5" fill={`${color}80`} />
              <path d="M1 6 Q3 4 5 6" stroke={`${color}50`} strokeWidth="0.8" fill="none" />
            </svg>
          </div>
        )
      })}
    </>
  )
}
