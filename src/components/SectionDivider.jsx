import React from 'react'

/**
 * SectionDivider — ornamental Victorian-style section heading with diamond dividers
 * @param {string} label - section heading text
 * @param {string} color - line color (default: gold)
 */
export default function SectionDivider({ label, color }) {
  const lineColor = color || 'var(--color-border-divider)'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '20px 0 12px',
      }}
    >
      {/* Left line + diamond */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ flex: 1, height: '1px', background: lineColor }} />
        <div
          style={{
            width: 7,
            height: 7,
            background: 'var(--color-accent-gold)',
            transform: 'rotate(45deg)',
            flexShrink: 0,
          }}
        />
        <div style={{ width: 28, height: '1px', background: lineColor }} />
      </div>

      {/* Section label */}
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-primary)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>

      {/* Right line + diamond */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: 28, height: '1px', background: lineColor }} />
        <div
          style={{
            width: 7,
            height: 7,
            background: 'var(--color-accent-gold)',
            transform: 'rotate(45deg)',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, height: '1px', background: lineColor }} />
      </div>
    </div>
  )
}
