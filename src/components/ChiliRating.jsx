import React from 'react'

/**
 * ChiliRating — renders up to 5 chili pepper icons (filled/empty)
 * Uses actual PNG assets from blueprints; SVG fallback if assets 404.
 *
 * @param {number} heat - number of filled chilies (0-5)
 * @param {number} max  - total icons shown (default 5)
 * @param {number} size - icon size in px (default 18)
 */
export default function ChiliRating({ heat = 0, max = 5, size = 18 }) {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
      aria-label={`Heat rating: ${heat} out of ${max}`}
      role="img"
    >
      {Array.from({ length: max }, (_, i) => (
        <ChiliIcon key={i} filled={i < heat} size={size} />
      ))}
    </div>
  )
}

function ChiliIcon({ filled, size }) {
  const assetSrc = filled
    ? '/blueprints/reference-entry/assets/chili-rating-filled.png'
    : '/blueprints/reference-entry/assets/chili-rating-outline.png'

  return (
    <div style={{ width: size, height: size, flexShrink: 0, position: 'relative' }}>
      {/* Actual asset */}
      <img
        src={assetSrc}
        alt=""
        width={size}
        height={size}
        style={{ display: 'block', objectFit: 'contain' }}
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'block'
        }}
      />
      {/* SVG fallback */}
      <svg
        style={{
          display: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
        }}
        viewBox="0 0 24 28"
        fill={filled ? 'var(--color-chili-filled)' : 'none'}
        stroke={filled ? 'var(--color-chili-filled)' : 'var(--color-chili-empty)'}
        strokeWidth="1.6"
        aria-hidden="true"
      >
        {/* Body */}
        <path d="M12 5 C9 6 7 9 7.5 14 C8 18 10.5 22 12 27 C13.5 22 16 18 16.5 14 C17 9 15 6 12 5 Z" />
        {/* Stem */}
        <path d="M12 5 C12 3 14 2.5 15 3.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}
