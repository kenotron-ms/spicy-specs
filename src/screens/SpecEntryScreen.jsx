import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import ChiliRating from '../components/ChiliRating'
import SectionDivider from '../components/SectionDivider'
import { SPEC_ENTRY, ENTRIES } from '../data/entries'

export default function SpecEntryScreen() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const libraryEntry = ENTRIES.find(e => e.slug === slug)
  const spec = SPEC_ENTRY

  return (
    <div style={{ background: 'var(--color-bg-screen)', minHeight: '100vh' }}>
      {/* Branding header — deep crimson with filigree */}
      <BrandingHeader />

      {/* Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 60px' }}>
        {/* Tab navigation */}
        <TabNav slug={slug} active="spec" navigate={navigate} />

        {/* Nav/Title section */}
        <div style={{ marginBottom: '24px' }}>
          {/* Breadcrumb */}
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '12px',
            color: 'var(--color-text-breadcrumb)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: '0 0 8px',
          }}>
            {spec.breadcrumb}
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            color: 'var(--color-text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: '0 0 12px',
          }}>
            {libraryEntry?.title || spec.title}
          </h1>

          {/* Subtitle + heat rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {spec.subtitle}
            </span>
            <ChiliRating heat={libraryEntry?.heat || spec.heat} size={18} />
          </div>

          {/* Spec number */}
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            margin: '0 0 12px',
            textTransform: 'uppercase',
          }}>
            {spec.specNumber}
          </p>

          {/* Front code banner */}
          <div className="code-panel" style={{ display: 'inline-block', padding: '6px 14px', fontSize: '12px' }}>
            {spec.federatedUrl}
          </div>
        </div>

        {/* Architecture section */}
        <section style={{ marginBottom: '28px' }}>
          <SectionDivider label="ARCHITECTURE" />
          <div className="arch-flowchart" style={{ flexWrap: 'nowrap', gap: '4px', overflowX: 'auto', padding: '12px 0' }}>
            {spec.archFlow.map((node, i) => (
              <React.Fragment key={i}>
                <div className="arch-box">{node}</div>
                {i < spec.archFlow.length - 1 && (
                  <span className="arch-arrow" aria-hidden="true">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Design Decisions section */}
        <section style={{ marginBottom: '28px' }}>
          <SectionDivider label="DESIGN DECISIONS" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
            {/* v1 API panel */}
            <div className="code-panel">
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-text-on-dark)',
                marginBottom: '8px',
                opacity: 0.8,
              }}>
                {spec.designDecisions.v1.label}
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px', lineHeight: 1.6 }}>
                {spec.designDecisions.v1.code}
              </pre>
            </div>
            {/* v2 API panel */}
            <div className="code-panel">
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-accent-gold)',
                marginBottom: '8px',
              }}>
                {spec.designDecisions.v2.label}
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px', lineHeight: 1.6 }}>
                {spec.designDecisions.v2.code}
              </pre>
            </div>
          </div>
        </section>

        {/* Invariants section */}
        <section style={{ marginBottom: '28px' }}>
          <SectionDivider label="INVARIANTS" />
          <table className="spec-table" style={{ width: '100%', marginTop: '12px' }}>
            <thead>
              <tr>
                <th>INVARIANT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {spec.invariants.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{row.name}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Anti-pattern registry */}
        <section style={{ marginBottom: '40px' }}>
          <SectionDivider label="ANTI-PATTERN REGISTRY" />
          <table className="spec-table" style={{ width: '100%', marginTop: '12px' }}>
            <thead>
              <tr>
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {spec.antiPatterns.map((ap, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{ap.name}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{ap.desc}</td>
                  <td><SeverityBadge level={ap.severity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}

function BrandingHeader() {
  return (
    <header style={{ background: '#963434', position: 'relative', overflow: 'hidden' }}>
      {/* Background filigree asset */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
        <img
          src="/blueprints/spec-entry/assets/ornate-filigree-header.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '14px 32px' }}>
        {/* Diamond chili emblem */}
        <div style={{
          width: 36, height: 36,
          background: 'rgba(255,244,203,0.12)',
          border: '1.5px solid rgba(255,244,203,0.4)',
          borderRadius: '4px',
          transform: 'rotate(45deg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(-45deg)' }} aria-hidden="true">
            <path d="M10 3 C8 4 6 6 6.5 10 C7 13 9 15.5 10 18 C11 15.5 13 13 13.5 10 C14 6 12 4 10 3 Z" fill="rgba(255,244,203,0.85)" />
            <path d="M10 3 C10 1.5 11.5 1 12.5 2" stroke="rgba(255,244,203,0.7)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: '#EAD69A',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}>
          SPICY SPECS
        </h1>
      </div>
    </header>
  )
}

function TabNav({ slug, active, navigate }) {
  const tabs = [
    { key: 'overview', label: 'OVERVIEW',       path: `/entry/${slug}` },
    { key: 'spec',     label: 'SPEC',            path: `/entry/${slug}/spec` },
    { key: 'notes',    label: 'COMMUNITY NOTES', path: `/entry/${slug}/notes` },
  ]

  return (
    <div style={{ display: 'flex', gap: '2px', margin: '16px 0', borderBottom: '2px solid var(--color-border-default)' }}>
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
            background: active === tab.key ? '#963434' : 'transparent',
            color: active === tab.key ? '#FFFFFF' : 'var(--color-text-primary)',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            padding: '8px 18px',
            cursor: 'pointer',
            marginBottom: '-2px',
            borderBottom: active === tab.key ? '2px solid #963434' : '2px solid transparent',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function SeverityBadge({ level }) {
  const styles = {
    HIGH:   { bg: '#E8AFAF', color: '#5A0000' },
    MEDIUM: { bg: '#EAD69A', color: '#3D2A00' },
    LOW:    { bg: '#B7D1B5', color: '#1A3D1A' },
  }
  const s = styles[level] || styles.MEDIUM

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
