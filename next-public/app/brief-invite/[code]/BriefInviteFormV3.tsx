'use client'

/**
 * V3 — "Velvet Portal"
 * Soft aurora. Animated gradient borders. Progress + floating labels.
 * Font: Outfit (all weights)
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

const BG = '#09090f'

function GradientCard({
  children, focused, filled, index,
}: { children: React.ReactNode; focused: boolean; filled: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', borderRadius: 16, padding: 1 }}
    >
      {/* Animated gradient border */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 16,
        background: focused
          ? 'linear-gradient(135deg, #818cf8, #34d399, #f472b6, #818cf8)'
          : filled
            ? 'linear-gradient(135deg, rgba(129,140,248,0.5), rgba(52,211,153,0.5))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
        backgroundSize: '300% 300%',
        animation: focused ? 'gradientShift 3s ease infinite' : 'none',
        transition: 'background 0.4s ease',
      }} />
      <div style={{
        position: 'relative',
        background: focused ? 'rgba(15,10,28,0.95)' : 'rgba(15,10,28,0.98)',
        borderRadius: 15,
        padding: '16px 18px',
        transition: 'background 0.3s',
      }}>
        {children}
      </div>
    </motion.div>
  )
}

function FieldCard({
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
    <GradientCard focused={focused} filled={filled} index={index}>
      <label style={{
        display: 'block',
        fontFamily: "'Outfit', sans-serif",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        marginBottom: 10,
        transition: 'color 0.3s',
        color: focused ? '#a5b4fc' : filled ? 'rgba(165,180,252,0.6)' : 'rgba(255,255,255,0.3)',
      }}>
        {field.label}
        {'required' in field && field.required && (
          <span style={{ color: '#f472b6', marginLeft: 6 }}>*</span>
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
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 300,
        }}
      />
    </GradientCard>
  )
}

export function BriefInviteFormV3({ code, companyName }: { code: string; companyName: string }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map(f => [f.key, '']))
  )
  const [companyInput, setCompanyInput] = useState(companyName)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companyFocused, setCompanyFocused] = useState(false)

  const filledCount = FIELDS.filter(f => values[f.key]?.trim()).length
  const progress = Math.round((filledCount / FIELDS.length) * 100)

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
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 28, padding: 40 }}>
          {/* Animated success ring */}
          <div style={{ position: 'relative', width: 80, height: 80 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'linear-gradient(135deg, #818cf8, #34d399)',
              animation: 'spin 3s linear infinite',
              padding: 2,
            }}>
              <div style={{ background: BG, borderRadius: '50%', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 28 }}>✓</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 26, color: 'white', marginBottom: 10 }}>Brief transmis !</h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 300 }}>
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes gradientShift {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>

      {/* Sticky progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.05)', zIndex: 100 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #818cf8, #34d399)',
            boxShadow: '0 0 8px rgba(129,140,248,0.6)',
          }}
        />
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '52px 20px 100px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 44 }}>
          {/* Logo pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 40,
            marginBottom: 28,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg, #818cf8, #f472b6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'white', fontFamily: "'Outfit', sans-serif",
            }}>P</div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.03em' }}>Propulseo</span>
          </div>

          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 30, color: 'white', marginBottom: 10, letterSpacing: '-0.01em' }}>
            Brief de projet
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Décrivez votre projet en quelques minutes.<br />Plus c&apos;est précis, mieux on peut vous accompagner.
          </p>

          {/* Progress label */}
          {filledCount > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#818cf8', marginTop: 16, fontWeight: 500 }}>
              {progress}% complété
            </motion.p>
          )}
        </motion.div>

        {/* Company */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ marginBottom: 16, position: 'relative', borderRadius: 16, padding: 1, background: companyFocused ? 'linear-gradient(135deg, #818cf8, #f472b6)' : 'rgba(255,255,255,0.06)' }}>
          <div style={{ background: 'rgba(15,10,28,0.98)', borderRadius: 15, padding: '14px 18px' }}>
            <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: companyFocused ? '#a5b4fc' : 'rgba(255,255,255,0.3)', marginBottom: 8, transition: 'color 0.3s' }}>
              Votre entreprise
            </label>
            <input
              value={companyInput}
              onChange={e => setCompanyInput(e.target.value)}
              onFocus={() => setCompanyFocused(true)}
              onBlur={() => setCompanyFocused(false)}
              placeholder="Nom de votre entreprise"
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
            />
          </div>
        </motion.div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FIELDS.map((field, i) => (
            <FieldCard key={field.key} field={field} index={i}
              value={values[field.key]} onChange={v => setValues(prev => ({ ...prev, [field.key]: v }))} />
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ marginTop: 16, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#f87171', fontWeight: 400 }}>
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          onClick={handleSubmit} disabled={submitting}
          whileHover={{ scale: 1.01, boxShadow: '0 8px 32px rgba(129,140,248,0.3)' }}
          whileTap={{ scale: 0.99 }}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '16px 24px',
            background: submitting
              ? 'rgba(129,140,248,0.2)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
            backgroundSize: '200% 200%',
            border: 'none',
            borderRadius: 12,
            color: 'white',
            fontSize: 14,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            letterSpacing: '0.03em',
          }}
        >
          {submitting ? 'Envoi en cours…' : 'Envoyer le brief →'}
        </motion.button>

        <p style={{ textAlign: 'center', fontFamily: "'Outfit', sans-serif", fontWeight: 300, fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 20 }}>
          Propulseo · Agence digitale
        </p>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: BG, overflowX: 'hidden', position: 'relative' }}>
      {/* Aurora orbs */}
      <div style={{ position: 'fixed', top: -150, left: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -100, right: -80, width: 450, height: 450, background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '45%', left: '55%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      {children}
    </div>
  )
}
