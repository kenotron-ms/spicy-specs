import React, { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import FilterBar from '../components/FilterBar'
import CategoryTag from '../components/CategoryTag'
import { ENTRIES } from '../data/entries'

export default function SearchResultsScreen() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery   = searchParams.get('q') || ''

  const [query,  setQuery]  = useState(initialQuery)
  const [filter, setFilter] = useState('ALL')

  const results = useMemo(() => {
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-screen)' }}>
      <AppHeader variant="compact" />

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        activeFilter={filter}
        onFilterChange={setFilter}
        count={results.length}
      />

      {/* Results list */}
      <div style={{ padding: '0 32px 48px' }}>
        {results.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          results.map((entry, i) => (
            <ResultRow
              key={entry.id}
              entry={entry}
              index={i}
              onClick={() => navigate(`/entry/${entry.slug}`)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function ResultRow({ entry, index, onClick }) {
  const isOdd = index % 2 === 0

  return (
    <div
      onClick={onClick}
      style={{
        background: isOdd ? 'var(--color-bg-row-odd)' : 'var(--color-bg-row-even)',
        borderBottom: '1px solid var(--color-border-divider)',
        padding: '16px 20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,151,91,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.background = isOdd ? 'var(--color-bg-row-odd)' : 'var(--color-bg-row-even)' }}
    >
      {/* Row icon */}
      <div style={{ flexShrink: 0, paddingTop: '3px' }}>
        <RowCategoryIcon type={entry.type} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Tag + Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <CategoryTag type={entry.type} size="sm" />
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}>
            {entry.title}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '14px',
          color: 'var(--color-text-primary)',
          margin: '0 0 6px',
          lineHeight: 1.5,
        }}>
          {entry.description}
        </p>

        {/* Meta + Link row */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}>
            {entry.meta}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-text-link)',
            textDecoration: 'underline',
          }}>
            {entry.url}
          </span>
        </div>
      </div>
    </div>
  )
}

function RowCategoryIcon({ type }) {
  const colors = {
    SPEC:        '#A83232',
    ANTIPATTERN: '#1E5A2D',
    REFERENCE:   '#C9975B',
    PATTERN:     '#8B7355',
    PHILOSOPHY:  '#2D2D2D',
  }
  const color = colors[type] || '#A83232'

  return (
    <div style={{ width: 24, height: 24, position: 'relative', flexShrink: 0 }}>
      {/* Try actual row icon asset */}
      <img
        src="/blueprints/search-results/assets/row-category-icon.png"
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'block'
        }}
      />
      {/* SVG fallback — ornamental diamond icon */}
      <svg style={{ display: 'none', width: '100%', height: '100%' }} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" fill={color} opacity="0.2" />
        <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" stroke={color} strokeWidth="1.2" />
        <circle cx="12" cy="12" r="2.5" fill={color} opacity="0.7" />
      </svg>
    </div>
  )
}

function EmptyState({ query }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 32px', color: 'var(--color-text-muted)' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block' }} aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M8 11 h6 M11 8 v6" />
      </svg>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700 }}>No entries found</p>
      {query && <p style={{ fontFamily: 'var(--font-serif)', fontSize: '14px' }}>No results for "{query}"</p>}
    </div>
  )
}
