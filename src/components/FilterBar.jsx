import React, { useState } from 'react'

const FILTERS = [
  { key: 'ALL',         label: '[ALL]',          textColor: '#FFFFFF', activeText: '#FFFFFF' },
  { key: 'SPEC',        label: '[SPEC]',         textColor: '#A83232' },
  { key: 'ANTIPATTERN', label: '[ANTI-PATTERN]', textColor: '#1E5A2D' },
  { key: 'REFERENCE',   label: '[REFERENCE APP]',textColor: '#8B7355' },
  { key: 'PATTERN',     label: '[PATTERN]',      textColor: '#8B7355' },
  { key: 'PHILOSOPHY',  label: '[PHILOSOPHY]',   textColor: '#6D6D6D' },
]

/**
 * FilterBar — search input + entry count + category filter chips
 * @param {string}   query        - current search query
 * @param {function} onQueryChange
 * @param {string}   activeFilter - currently active filter key
 * @param {function} onFilterChange
 * @param {number}   count        - number of entries showing
 */
export default function FilterBar({ query = '', onQueryChange, activeFilter = 'ALL', onFilterChange, count = 0 }) {
  return (
    <div
      style={{
        background: 'var(--color-bg-filter-bar)',
        borderBottom: '1px solid var(--color-border-divider)',
        padding: '12px 48px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid var(--color-border-card)',
            borderRadius: 'var(--radius-input)',
            padding: '6px 12px',
            minWidth: '200px',
            flex: '1 1 180px',
            maxWidth: '300px',
          }}
        >
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={e => onQueryChange?.(e.target.value)}
            placeholder="SEARCH ENTRIES..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              width: '100%',
              letterSpacing: '0.04em',
            }}
          />
        </div>

        {/* Entry count */}
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
          }}
        >
          SHOWING {count} ENTRIES
        </span>

        {/* Filter chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f.key
            return (
              <button
                key={f.key}
                onClick={() => onFilterChange?.(f.key)}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  background: isActive ? 'var(--color-bg-header)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : f.textColor,
                  border: `1px solid ${isActive ? 'var(--color-bg-header)' : 'var(--color-border-card)'}`,
                  borderRadius: '3px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** Search magnifying glass SVG icon */
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
