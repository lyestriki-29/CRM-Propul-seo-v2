'use client'

/**
 * V1 — "Obsidian Court" — Propulseo Edition
 * Fond #0a0118, accents indigo/violet, serif élégant.
 * Font: Cormorant Garamond + Jost
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitBriefInvite } from './actions'

const FIELDS = [
  { key: 'objective',         label: 'Objectif du projet',         placeholder: "Décrivez l'objectif principal de votre projet",       required: true, rows: 4 },
  { key: 'target_audience',   label: 'Cible & utilisateurs',        placeholder: 'Qui sont vos utilisateurs cibles ?',                 rows: 3 },
  { key: 'pages',             label: 'Pages & fonctionnalités',     placeholder: 'Listez les pages ou fonctionnalités attendues…',    rows: 4 },
  { key: 'techno',            label: 'Technologies utilisées',      placeholder: 'Ex: WordPress, Shopify, React, no-code… ou aucune préférence',  rows: 2 },
  { key: 'design_references', label: 'Références visuelles',        placeholder: 'URLs, inspirations, exemples de sites…',            rows: 3 },
  { key: 'notes',             label: 'Notes complémentaires',       placeholder: "Toute information utile pour l'équipe…",            rows: 3 },
] as const

const INDIGO       = '#818cf8'
const INDIGO_MED   = '#6366f1'
const INDIGO_DIM   = 'rgba(129,140,248,0.18)'
const INDIGO_GLOW  = 'rgba(129,140,248,0.05)'
const PURPLE       = '#a855f7'
const BG           = '#0a0118'
const SURFACE      = 'rgba(255,255,255,0.025)'
const BORDER       = 'rgba(255,255,255,0.06)'

const LOGO_URL = 'https://lh3.googleusercontent.com/pw/AP1GczN1Fx4MCRF05ZyLZ8eE7yq6l3O04S9H5NUlRQng3NGehC4bVTl4SA0EdX8yJ4cEgMGjbPkELigm1WxcMBR8QCh4QSMgDVikjqv8mizSPn2r-zv-pKbMK10JVMTK4Fo1kd4VUXASX_owtWiT6X6cRao=w590-h423-s-no-gm?authuser=0'

function LogoMark() {
  const [imgOk, setImgOk] = useState(true)
  return imgOk ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_URL}
      alt="Propulseo"
      onError={() => setImgOk(false)}
      style={{ height: 36, width: 'auto', objectFit: 'contain' }}
    />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 30, height: 30,
        background: `linear-gradient(135deg, ${INDIGO_MED}, ${PURPLE})`,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: 'white', fontSize: 17, fontWeight: 600 }}>P</span>
      </div>
      <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, color: 'rgba(255,255,255,0.9)', fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Propulseo</span>
    </div>
  )
}

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative' }}
    >
      {/* Accent left border */}
      <div style={{
        position: 'absolute', left: 0, top: 12, bottom: 12, width: 2,
        background: focused
          ? `linear-gradient(to bottom, ${INDIGO_MED}, ${PURPLE})`
          : filled ? 'rgba(129,140,248,0.45)' : BORDER,
        borderRadius: 2,
        transition: 'background 0.3s ease',
      }} />

      <div style={{
        padding: '16px 20px 16px 24px',
        background: focused ? INDIGO_GLOW : SURFACE,
        border: `1px solid ${focused ? INDIGO_DIM : BORDER}`,
        borderLeft: 'none',
        borderRadius: '0 10px 10px 0',
        transition: 'all 0.3s ease',
      }}>
        <label style={{
          display: 'block',
          fontFamily: "'Jost', sans-serif",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          color: focused ? INDIGO : filled ? 'rgba(129,140,248,0.65)' : 'rgba(255,255,255,0.3)',
          marginBottom: 10,
          transition: 'color 0.3s ease',
        }}>
          {field.label}
          {'required' in field && field.required && (
            <span style={{ color: PURPLE, marginLeft: 6, opacity: 0.9 }}>*</span>
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
            color: 'rgba(255,255,255,0.85)',
            fontSize: 14,
            lineHeight: 1.7,
            resize: 'none',
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
          }}
        />
      </div>
    </motion.div>
  )
}

export function BriefInviteFormV1({ code, companyName }: { code: string; companyName: string }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map(f => [f.key, '']))
  )
  const [companyInput, setCompanyInput] = useState(companyName)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companyFocused, setCompanyFocused] = useState(false)

  const filledCount = FIELDS.filter(f => values[f.key]?.trim()).length

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
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 32, padding: 40 }}
        >
          <LogoMark />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56,
              border: `1.5px solid ${INDIGO}`,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              color: INDIGO, fontSize: 22,
              boxShadow: `0 0 20px rgba(129,140,248,0.2)`,
            }}>✓</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: 'white', marginBottom: 12 }}>Brief transmis</h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
              L&apos;équipe Propulseo a bien reçu votre brief.<br />Nous reviendrons vers vous très prochainement.
            </p>
          </div>
        </motion.div>
      </Shell>
    )
  }

  return (
    <Shell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
        ::placeholder { color: rgba(255,255,255,0.18) !important; }
      `}</style>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '60px 24px 100px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 52 }}>
          <LogoMark />
          <div style={{ width: 36, height: 1.5, background: `linear-gradient(90deg, ${INDIGO_MED}, ${PURPLE})`, margin: '20px auto', borderRadius: 2 }} />
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: 'white', letterSpacing: '0.02em', marginBottom: 10 }}>
            Brief de projet
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}>
            Décrivez votre projet avec précision — chaque détail compte.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const }}>Progression</span>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, color: INDIGO }}>{filledCount}/{FIELDS.length}</span>
          </div>
          <div style={{ height: 1, background: BORDER, position: 'relative', borderRadius: 1 }}>
            <motion.div
              animate={{ width: `${(filledCount / FIELDS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: `linear-gradient(90deg, ${INDIGO_MED}, ${PURPLE})`, borderRadius: 1 }}
            />
          </div>
        </motion.div>

        {/* Company */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ marginBottom: 24, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
            background: companyFocused ? `linear-gradient(to bottom, ${INDIGO_MED}, ${PURPLE})` : BORDER,
            borderRadius: 2, transition: 'background 0.3s',
          }} />
          <div style={{
            padding: '14px 16px 14px 24px',
            background: companyFocused ? INDIGO_GLOW : SURFACE,
            border: `1px solid ${companyFocused ? INDIGO_DIM : BORDER}`,
            borderLeft: 'none',
            borderRadius: '0 10px 10px 0',
            transition: 'all 0.3s',
          }}>
            <label style={{ display: 'block', fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: companyFocused ? INDIGO : 'rgba(255,255,255,0.3)', marginBottom: 8, transition: 'color 0.3s' }}>
              Entreprise
            </label>
            <input
              value={companyInput}
              onChange={e => setCompanyInput(e.target.value)}
              onFocus={() => setCompanyFocused(true)}
              onBlur={() => setCompanyFocused(false)}
              placeholder="Nom de votre entreprise"
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            />
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, opacity: 0.35 }}>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: INDIGO, letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>Votre projet</span>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FIELDS.map((field, i) => (
            <FieldBlock key={field.key} field={field} index={i}
              value={values[field.key]} onChange={v => setValues(prev => ({ ...prev, [field.key]: v }))} />
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ marginTop: 16, fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#f87171', fontWeight: 300 }}>
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          onClick={handleSubmit} disabled={submitting}
          whileHover={{ scale: 1.01, boxShadow: `0 8px 28px rgba(99,102,241,0.3)` }}
          whileTap={{ scale: 0.99 }}
          style={{
            marginTop: 32,
            width: '100%',
            padding: '16px 32px',
            background: submitting
              ? 'rgba(99,102,241,0.15)'
              : `linear-gradient(135deg, ${INDIGO_MED}, ${PURPLE})`,
            border: `1px solid ${submitting ? INDIGO_DIM : 'transparent'}`,
            borderRadius: 8,
            color: submitting ? INDIGO : 'white',
            fontSize: 12,
            fontFamily: "'Jost', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {submitting ? 'Envoi en cours…' : 'Soumettre le brief'}
        </motion.button>

        <p style={{ textAlign: 'center', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 24, letterSpacing: '0.06em' }}>
          Propulseo · Agence digitale
        </p>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: BG, overflowX: 'hidden', position: 'relative' }}>
      {/* Noise */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      {/* Orbs */}
      <div style={{ position: 'fixed', top: -150, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -100, right: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      {children}
    </div>
  )
}
