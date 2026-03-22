import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import ChiliRating from '../components/ChiliRating'
import SectionDivider from '../components/SectionDivider'
import { REFERENCE_ENTRY, ENTRIES } from '../data/entries'

export default function ReferenceEntryScreen() {
  const navigate = useNavigate()
  const { slug } = useParams()

  // Find matching entry or fallback to the reference entry mock
  const libraryEntry = ENTRIES.find(e => e.slug === slug)
  const entry = REFERENCE_ENTRY // always use the rich mock for now

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-screen)' }}>
      {/* Header banner */}
      <HeaderBanner entry={entry} libraryEntry={libraryEntry} />

      {/* Main content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px 60px' }}>
        {/* Breadcrumb */}
        <nav style={{ padding: '16px 0 8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '12px',
              color: 'var(--color-text-breadcrumb)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</Link>
            {' > '}
            <span style={{ color: 'var(--color-accent-gold)', cursor: 'pointer' }} onClick={() => navigate(-1)}>
              {libraryEntry?.type || 'REFERENCE APP'}
            </span>
            {' > '}
            {entry.title}
          </span>
        </nav>
        <div style={{ height: '1px', background: 'var(--color-border-default)', marginBottom: '20px' }} />

        {/* Title section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--color-accent-crimson)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-serif)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '3px 12px',
              borderRadius: '16px',
              textTransform: 'uppercase',
            }}>
              RESERVE VARIETY
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '36px',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            margin: '0 0 12px',
          }}>
            {libraryEntry?.title || entry.title}
          </h1>

          <ChiliRating heat={libraryEntry?.heat || entry.heat} size={20} />

          <div style={{
            marginTop: '12px',
            background: '#2A2420',
            color: '#EAD69A',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            padding: '8px 14px',
            borderRadius: '6px',
            display: 'inline-block',
            letterSpacing: '0.04em',
          }}>
            {entry.productCode}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--color-border-default)', marginBottom: '28px' }} />

        {/* Tab-like navigation */}
        <TabNav slug={slug} active="overview" />

        {/* Architecture section */}
        <section style={{ marginBottom: '32px' }}>
          <SectionDivider label="ARCHITECTURE" />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '16px 0',
          }}>
            {entry.architecture.nodes.map((node, i) => (
              <React.Fragment key={i}>
                <div style={{
                  background: '#3E2B22',
                  color: '#F3E9D9',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                }}>
                  {node}
                </div>
                {i < entry.architecture.nodes.length - 1 && (
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
                    <path d="M4 8 L16 8 M12 4 L16 8 L12 12" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* File Map section */}
        <section style={{ marginBottom: '32px' }}>
          <SectionDivider label="FILE MAP" />
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            lineHeight: 1.8,
            padding: '12px 0',
          }}>
            {entry.fileMap.split('|').map((part, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <FolderIcon />
                <span>{part.trim()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Component Breakdown */}
        <section style={{ marginBottom: '32px' }}>
          <SectionDivider label="COMPONENT BREAKDOWN" />
          <table className="spec-table" style={{ width: '100%', marginTop: '12px' }}>
            <thead>
              <tr>
                <th>COMPONENT</th>
                <th>DESCRIPTION</th>
                <th>COMPLEXITY</th>
              </tr>
            </thead>
            <tbody>
              {entry.components.map((comp, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{comp.name}</td>
                  <td>{comp.desc}</td>
                  <td>
                    <ComplexityDots count={comp.complexity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Invariants */}
        <section style={{ marginBottom: '32px' }}>
          <SectionDivider label="INVARIANTS" />
          <table className="spec-table" style={{ width: '100%', marginTop: '12px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>DESCRIPTION</th>
                <th>SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {entry.invariants.map((inv, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', whiteSpace: 'nowrap' }}>{inv.id}</td>
                  <td>{inv.desc}</td>
                  <td><SeverityBadge level={inv.severity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          marginTop: '48px',
          letterSpacing: '0.06em',
        }}>
          SPICY SPECS REFERENCE COLLECTION // 2026
        </p>
      </div>
    </div>
  )
}

function HeaderBanner({ entry, libraryEntry }) {
  return (
    <div
      style={{
        background: '#6B241F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background asset */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
        <img
          src="/blueprints/reference-entry/assets/header-ornamental-frame.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Title */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#FFF4CB', letterSpacing: '0.04em' }}>
          SPICY SPECS
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '12px', color: 'rgba(255,244,203,0.7)', letterSpacing: '0.12em' }}>
          PATTERN LIBRARY · EST. 2026
        </div>
      </div>

      {/* Chili illustration */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <img
          src="/blueprints/reference-entry/assets/chili-pepper-illustration.png"
          alt="Chili Pepper"
          style={{ width: 56, height: 56, objectFit: 'contain' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Est badge */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,244,203,0.3)',
        padding: '6px 14px',
        borderRadius: '4px',
      }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '12px', color: '#FFF4CB', letterSpacing: '0.12em', fontWeight: 700 }}>
          EST. 2023
        </span>
      </div>
    </div>
  )
}

function TabNav({ slug, active }) {
  const navigate = useNavigate()
  const tabs = [
    { key: 'overview', label: 'OVERVIEW',        path: `/entry/${slug}` },
    { key: 'spec',     label: 'VIEW SPEC',        path: `/entry/${slug}/spec` },
    { key: 'notes',    label: 'COMMUNITY NOTES',  path: `/entry/${slug}/notes` },
  ]

  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '24px', borderBottom: '2px solid var(--color-border-default)' }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => navigate(tab.path)}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: active === tab.key ? 'var(--color-bg-header)' : 'transparent',
            color: active === tab.key ? '#FFFFFF' : 'var(--color-text-primary)',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            padding: '8px 20px',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
            marginBottom: '-2px',
            borderBottom: active === tab.key ? '2px solid var(--color-bg-header)' : '2px solid transparent',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function ComplexityDots({ count = 0, max = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: i < count ? 'var(--color-accent-crimson)' : 'var(--color-border-default)',
          }}
        />
      ))}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
        {count}/5
      </span>
    </div>
  )
}

function SeverityBadge({ level }) {
  const styles = {
    HIGH: { bg: '#B82E2E', color: '#FFFFFF' },
    MED:  { bg: '#D4A02E', color: '#FFFFFF' },
    LOW:  { bg: '#2E7D32', color: '#FFFFFF' },
  }
  const s = styles[level] || styles.MED

  return (
    <span style={{
      display: 'inline-block',
      background: s.bg,
      color: s.color,
      fontFamily: 'var(--font-serif)',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.06em',
      padding: '2px 10px',
      borderRadius: '12px',
      textTransform: 'uppercase',
    }}>
      {level}
    </span>
  )
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}
