import React from 'react'

const TAG_STYLES = {
  SPEC:        { bg: '#A83232', color: '#FFFFFF' },
  ANTIPATTERN: { bg: '#1E5A2D', color: '#FFFFFF' },
  REFERENCE:   { bg: '#C9975B', color: '#FFFFFF' },
  PATTERN:     { bg: '#8B7355', color: '#FFFFFF' },
  PHILOSOPHY:  { bg: '#2D2D2D', color: '#FFFFFF' },
}

const TYPE_LABELS = {
  SPEC:        'SPEC',
  ANTIPATTERN: 'ANTI-PATTERN',
  REFERENCE:   'REFERENCE APP',
  PATTERN:     'PATTERN',
  PHILOSOPHY:  'PHILOSOPHY',
}

/**
 * CategoryTag — small coloured label badge for entry type
 * @param {string} type - one of SPEC | ANTIPATTERN | REFERENCE | PATTERN | PHILOSOPHY
 * @param {string} size - 'sm' | 'md'
 */
export default function CategoryTag({ type = 'SPEC', size = 'sm' }) {
  const style = TAG_STYLES[type] || TAG_STYLES.SPEC
  const label = TYPE_LABELS[type] || type

  const padding  = size === 'sm' ? '2px 8px' : '4px 12px'
  const fontSize = size === 'sm' ? '11px' : '13px'

  return (
    <span
      style={{
        display: 'inline-block',
        background: style.bg,
        color: style.color,
        padding,
        fontSize,
        fontFamily: 'var(--font-serif)',
        fontWeight: 700,
        letterSpacing: '0.06em',
        borderRadius: '3px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  )
}
