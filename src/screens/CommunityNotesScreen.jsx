import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ChiliRating from '../components/ChiliRating'
import SectionDivider from '../components/SectionDivider'
import { COMMUNITY_NOTES_ENTRY, ENTRIES } from '../data/entries'

export default function CommunityNotesScreen() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const libraryEntry = ENTRIES.find(e => e.slug === slug)
  const data = COMMUNITY_NOTES_ENTRY

  const [handle, setHandle]   = useState('')
  const [note,   setNote]     = useState('')
  const [heat,   setHeat]     = useState(3)
  const [notes,  setNotes]    = useState(data.notes)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!handle.trim() || !note.trim()) return
    const newNote = {
      handle: handle.trim(),
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      heat,
      body: note.trim(),
    }
    setNotes(prev => [newNote, ...prev])
    setHandle('')
    setNote('')
    setHeat(3)
  }

  return (
    <div style={{ background: 'var(--color-bg-screen)', minHeight: '100vh' }}>
      {/* Header banner */}
      <CommunityBanner />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px 60px' }}>
        {/* Tab navigation */}
        <TabNav slug={slug} active="notes" navigate={navigate} />

        {/* ─── INVARIANTS SECTION ─────────────────────── */}
        <section style={{ marginBottom: '32px' }}>
          <SectionTitle>→ INVARIANTS ←</SectionTitle>
          <table className="spec-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>DESCRIPTION</th>
                <th>SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {data.invariants.map((inv, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', whiteSpace: 'nowrap' }}>{inv.id}</td>
                  <td>{inv.desc}</td>
                  <td><SeverityPill level={inv.severity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Divider />

        {/* ─── COMMUNITY NOTES SECTION ────────────────── */}
        <section style={{ marginBottom: '32px' }}>
          <SectionTitle>→ COMMUNITY NOTES ←</SectionTitle>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            {notes.map((note, i) => (
              <NoteCard key={i} note={note} />
            ))}
          </div>
        </section>

        <Divider />

        {/* ─── ADD NOTE SECTION ───────────────────────── */}
        <section>
          <SectionTitle>→ ADD YOUR NOTE ←</SectionTitle>

          <form onSubmit={handleSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Handle */}
            <FormField label="YOUR HANDLE">
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder="your handle..."
                style={inputStyle}
              />
            </FormField>

            {/* Note */}
            <FormField label="YOUR NOTE">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="share your findings..."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </FormField>

            {/* Heat rating */}
            <FormField label="HEAT RATING">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ChiliRating heat={heat} size={22} />
                <select
                  value={heat}
                  onChange={e => setHeat(Number(e.target.value))}
                  style={{ ...inputStyle, width: 'auto', padding: '8px 12px' }}
                >
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'chili' : 'chilies'}</option>
                  ))}
                </select>
              </div>
            </FormField>

            {/* Submit */}
            <div>
              <SubmitButton />
            </div>
          </form>
        </section>
      </div>

      {/* Bottom decorative border */}
      <BottomBorder />
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────

function CommunityBanner() {
  return (
    <header style={{ background: '#7B2B22', position: 'relative', overflow: 'hidden' }}>
      {/* Background asset */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
        <img
          src="/blueprints/community-notes/assets/header-ornate-banner.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Ornamental background texture */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
        <img
          src="/blueprints/community-notes/assets/main-background-texture.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 40px' }}>
        {/* Left scrollwork */}
        <ScrollworkSVG />

        {/* Center emblem */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'rgba(255,244,203,0.9)', letterSpacing: '0.2em' }}>SPICY</div>
          <ChiliSmallSVG />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'rgba(255,244,203,0.9)', letterSpacing: '0.2em' }}>SPECS</div>
        </div>

        {/* Right scrollwork (mirrored) */}
        <ScrollworkSVG mirror />
      </div>
    </header>
  )
}

function ScrollworkSVG({ mirror = false }) {
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      aria-hidden="true"
      style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
    >
      <path d="M5 20 Q20 5 40 20 Q60 35 80 20 Q100 5 115 20" stroke="rgba(255,244,203,0.45)" strokeWidth="1.5" fill="none" />
      {[40, 80].map(x => <circle key={x} cx={x} cy="20" r="3" fill="rgba(255,244,203,0.4)" />)}
      <circle cx="5" cy="20" r="2" fill="rgba(255,244,203,0.3)" />
      <circle cx="115" cy="20" r="2" fill="rgba(255,244,203,0.3)" />
    </svg>
  )
}

function ChiliSmallSVG() {
  return (
    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" aria-hidden="true">
      <path d="M12 5 C9 6 7 9 7.5 14 C8 18 10.5 22 12 27 C13.5 22 16 18 16.5 14 C17 9 15 6 12 5 Z" fill="rgba(255,244,203,0.8)" />
      <path d="M12 5 C12 3 14 2.5 15 3.5" stroke="rgba(255,244,203,0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function NoteCard({ note }) {
  return (
    <div className="note-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}>
            {note.handle}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}>
            {note.date}
          </span>
        </div>
        <ChiliRating heat={note.heat} size={16} />
      </div>

      {/* Body */}
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '15px',
        color: 'var(--color-text-primary)',
        lineHeight: 1.6,
        margin: 0,
      }}>
        {note.body}
      </p>
    </div>
  )
}

function SeverityPill({ level }) {
  const styles = {
    HIGH:   { bg: '#B03025', color: '#FFFFFF' },
    MEDIUM: { bg: '#C09040', color: '#FFFFFF' },
    LOW:    { bg: '#408040', color: '#FFFFFF' },
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
      borderRadius: '9999px',
      textTransform: 'uppercase',
    }}>
      {level}
    </span>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '18px',
      fontWeight: 700,
      color: 'var(--color-text-primary)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      margin: '0 0 14px',
      textAlign: 'center',
    }}>
      {children}
    </h2>
  )
}

function Divider() {
  return (
    <div style={{
      height: '2px',
      background: `linear-gradient(90deg, transparent, var(--color-accent-gold), transparent)`,
      margin: '32px 0',
    }} />
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontFamily: 'var(--font-serif)',
  fontSize: '15px',
  color: 'var(--color-text-primary)',
  background: '#E8D8B8',
  border: '2px solid var(--color-border-default)',
  borderRadius: '8px',
  outline: 'none',
  boxSizing: 'border-box',
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-serif)',
        fontSize: '14px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--color-text-primary)',
        marginBottom: '6px',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function SubmitButton() {
  return (
    <button
      type="submit"
      style={{
        background: '#7B2B22',
        color: '#F8F0E0',
        fontFamily: 'var(--font-serif)',
        fontSize: '16px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 40px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#A83232' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#7B2B22' }}
    >
      SUBMIT NOTE
    </button>
  )
}

function BottomBorder() {
  return (
    <div style={{ background: '#7B2B22', position: 'relative', overflow: 'hidden', height: '32px' }}>
      <img
        src="/blueprints/community-notes/assets/bottom-decorative-border.png"
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={e => { e.target.style.display = 'none' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 16px',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,244,203,0.35)' }} />
        <svg width="160" height="12" viewBox="0 0 160 12" fill="none" aria-hidden="true">
          <path d="M0 6 Q40 1 80 6 Q120 11 160 6" stroke="rgba(255,244,203,0.45)" strokeWidth="1" fill="none" />
          <circle cx="80" cy="6" r="2.5" fill="rgba(255,244,203,0.5)" />
        </svg>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,244,203,0.35)' }} />
      </div>
    </div>
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
            background: active === tab.key ? '#7B2B22' : 'transparent',
            color: active === tab.key ? '#FFFFFF' : 'var(--color-text-primary)',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            padding: '8px 18px',
            cursor: 'pointer',
            marginBottom: '-2px',
            borderBottom: active === tab.key ? '2px solid #7B2B22' : '2px solid transparent',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
