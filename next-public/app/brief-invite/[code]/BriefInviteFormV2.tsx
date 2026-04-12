'use client'

/**
 * V2 — "Blueprint"
 * Technical editorial. Navy + electric cyan. Monospace precision.
 * Font: IBM Plex Mono (labels) + IBM Plex Sans (body)
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitBriefInvite } from './actions'

const FIELDS = [
  { key: 'objective',         label: 'Objectif du projet',                placeholder: "Décrivez l'objectif principal de votre projet",        required: true, rows: 4 },
  { key: 'target_audience',   label: 'Cible & utilisateurs',              placeholder: 'Qui sont vos utilisateurs cibles ?',                rows: 3 },
  { key: 'pages',             label: 'Pages & fonctionnalités',           placeholder: 'Listez les pages ou fonctionnalités attendues…',   rows: 4 },
  { key: 'techno',            label: 'Technologie / stack',               placeholder: 'Stack technique ou préférences…',    rows: 2 },
  { key: 'design_references', label: 'Références visuelles',              placeholder: 'URLs, inspirations, exemples de sites…', rows: 3 },
  { key: 'notes',             label: 'Notes complémentaires',             placeholder: "Toute information utile pour l'équipe…",           rows: 3 },
] as const

const CYAN = '#22d3ee'
const CYAN_DIM = 'rgba(34,211,238,0.15)'
const BG = '#070d14'
const CARD = 'rgba(255,255,255,0.03)'
const BORDER = 'rgba(255,255,255,0.07)'
const BORDER_ACTIVE = 'rgba(34,211,238,0.35)'

function FieldBlock({
  field, index, value, onChange,
}: {
  field: typeof FIELDS[number]; index: number; value: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const filled = value.trim().length > 0

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 + index * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 0, alignItems: 'stretch' }}
    >
      {/* Step number */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 18,
        borderRight: `1px solid ${focused ? BORDER_ACTIVE : BORDER}`,
        transition: 'border-color 0.3s',
        paddingRight: 0,
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: focused ? CYAN : filled ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.15)',
          transition: 'color 0.3s',
          letterSpacing: '0.05em',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        {filled && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ width: 1, flex: 1, background: `linear-gradient(to bottom, ${CYAN}, transparent)`, marginTop: 8, opacity: 0.4 }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{
        padding: '14px 0 14px 20px',
        background: focused ? CYAN_DIM : 'transparent',
        borderBottom: `1px solid ${BORDER}`,
        transition: 'background 0.3s',
      }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: focused ? CYAN : filled ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.3)',
          marginBottom: 10,
          transition: 'color 0.3s',
        }}>
          {field.label}
          {'required' in field && field.required && (
            <span style={{ color: CYAN, fontSize: 14, lineHeight: 1 }}>·</span>
          )}
        </label>
        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={field.placeholder}
          rows={field.rows}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
            lineHeight: 1.7,
            resize: 'none',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 300,
          }}
        />
      </div>
    </motion.div>
  )
}

export function BriefInviteFormV2({ code, companyName }: { code: string; companyName: string }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map(f => [f.key, '']))
  )
  const [companyInput, setCompanyInput] = useState(companyName)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    if (!values.objective.trim()) { setError("L'objectif du projet est requis."); return }
    setSubmitting(true); setError(null)
    const result = await submitBriefInvite(code, companyInput || companyName, values)
    if (result.ok) setSubmitted(true)
    else setError('Une erreur est survenue. Veuillez réessayer.')
    setSubmitting(false)
  }, [code, companyInput, companyName, values])

  if (submitted) {
    return (
      <Shell>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minHeight: '100vh', padding: '60px 40px', maxWidth: 560, margin: '0 auto' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: CYAN, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 24 }}>STATUS · TRANSMITTED</span>
          <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 36, fontWeight: 300, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>Brief<br />reçu.</h2>
          <div style={{ width: 40, height: 1, background: CYAN, marginBottom: 20, opacity: 0.6 }} />
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.8 }}>
            L&apos;équipe Propulseo a bien reçu votre brief.<br />Nous reviendrons vers vous très prochainement.
          </p>
        </motion.div>
      </Shell>
    )
  }

  return (
    <Shell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Top bar */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderBottom: `1px solid ${BORDER}`, marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>PROPULSEO</span>
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>BRIEF_FORM_v1.0</span>
        </motion.div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: CYAN, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
            Nouveau projet
          </p>
          <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 40, fontWeight: 300, color: 'white', lineHeight: 1.15, marginBottom: 0 }}>
            Brief de<br />
            <span style={{ fontWeight: 500 }}>projet.</span>
          </h1>
        </motion.div>

        {/* Company */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{ display: 'grid', gridTemplateColumns: '48px 1fr', marginBottom: 0 }}>
          <div style={{ borderRight: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>00</span>
          </div>
          <div style={{ padding: '14px 0 14px 20px', borderBottom: `1px solid ${BORDER}` }}>
            <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
              Entreprise
            </label>
            <input
              value={companyInput}
              onChange={e => setCompanyInput(e.target.value)}
              placeholder="Nom de votre entreprise"
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300 }}
            />
          </div>
        </motion.div>

        {/* Fields */}
        {FIELDS.map((field, i) => (
          <FieldBlock key={field.key} field={field} index={i}
            value={values[field.key]} onChange={v => setValues(prev => ({ ...prev, [field.key]: v }))} />
        ))}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ margin: '16px 0 0 68px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#f87171' }}>
              ✕ {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: '48px 1fr', marginTop: 0 }}>
          <div style={{ borderRight: `1px solid ${BORDER}` }} />
          <div style={{ padding: '32px 0 80px 20px' }}>
            <motion.button
              onClick={handleSubmit}
              disabled={submitting}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: submitting ? 'rgba(34,211,238,0.08)' : CYAN,
                border: 'none',
                borderRadius: 4,
                padding: '14px 28px',
                color: submitting ? CYAN : '#070d14',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {submitting ? 'TRANSMISSION…' : 'ENVOYER →'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: BG, overflowX: 'hidden', position: 'relative' }}>
      {/* Grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        opacity: 0.4,
      }} />
      {/* Cyan glow top-right */}
      <div style={{ position: 'fixed', top: -100, right: -100, width: 400, height: 400, background: `radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
      {children}
    </div>
  )
}
