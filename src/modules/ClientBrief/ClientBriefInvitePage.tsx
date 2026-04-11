// src/modules/ClientBrief/ClientBriefInvitePage.tsx
import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Send, Loader2, Building2 } from 'lucide-react'
import { useBriefInvitation } from '@/modules/ProjectsManagerV2/hooks/useBriefInvitation'

const LOGO_URL = 'https://lh3.googleusercontent.com/pw/AP1GczN1Fx4MCRF05ZyLZ8eE7yq6l3O04S9H5NUlRQng3NGehC4bVTl4SA0EdX8yJ4cEgMGjbPkELigm1WxcMBR8QCh4QSMgDVikjqv8mizSPn2r-zv-pKbMK10JVMTK4Fo1kd4VUXASX_owtWiT6X6cRao=w590-h423-s-no-gm?authuser=0'

interface FieldDef {
  key: string
  label: string
  placeholder: string
  required?: boolean
  rows: number
}

const FIELDS: FieldDef[] = [
  { key: 'objective',         label: 'Objectif du projet',                placeholder: "Quel est l'objectif principal du projet ?",        required: true, rows: 4 },
  { key: 'target_audience',   label: 'Cible / utilisateurs',              placeholder: 'Qui sont les utilisateurs cibles ?',                rows: 3 },
  { key: 'pages',             label: 'Pages / Fonctionnalités attendues', placeholder: 'Listez les pages ou fonctionnalités souhaitées…',   rows: 4 },
  { key: 'techno',            label: 'Technologie / stack',               placeholder: 'Stack technique ou préférences technologiques…',    rows: 2 },
  { key: 'design_references', label: 'Références design',                 placeholder: 'URLs, inspirations visuelles, exemples de sites…', rows: 3 },
  { key: 'notes',             label: 'Notes complémentaires',             placeholder: "Toute information utile pour l'équipe…",           rows: 3 },
]

const RECAP_LABELS: Record<string, string> = {
  objective: 'Objectif du projet',
  target_audience: 'Cible / utilisateurs',
  pages: 'Pages / Fonctionnalités attendues',
  techno: 'Technologie / stack',
  design_references: 'Références design',
  notes: 'Notes complémentaires',
}

function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])
  return ref
}

interface FieldCardProps {
  field: FieldDef
  index: number
  value: string
  onChange: (v: string) => void
}

function FieldCard({ field, index, value, onChange }: FieldCardProps) {
  const [focused, setFocused] = useState(false)
  const ref = useAutoResize(value)
  const filled = value.trim().length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1.5px solid ${focused ? '#a5b4fc' : filled ? 'rgba(167,243,208,0.8)' : 'rgba(255,255,255,0.95)'}`,
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: focused
          ? '0 6px 24px rgba(99,102,241,0.18)'
          : filled
          ? '0 2px 12px rgba(34,197,94,0.08)'
          : '0 2px 16px rgba(99,102,241,0.07)',
        transition: 'all 0.25s ease',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <AnimatePresence mode="wait">
        {filled ? (
          <motion.div key="check"
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ width: 24, height: 24, borderRadius: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }}
          >✓</motion.div>
        ) : (
          <motion.div key="num"
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ width: 24, height: 24, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}
          >{index + 1}</motion.div>
        )}
      </AnimatePresence>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4c1d95', marginBottom: 5 }}>
          {field.label}{field.required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
        </div>
        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={field.placeholder}
          rows={field.rows}
          style={{ fontSize: 11, color: '#374151', width: '100%', resize: 'none', outline: 'none', background: 'transparent', border: 'none', lineHeight: 1.7 }}
        />
      </div>
    </motion.div>
  )
}

const PAGE_BG: React.CSSProperties = {
  background: 'linear-gradient(160deg,#ede9fe 0%,#f0f9ff 50%,#fdf4ff 100%)',
  minHeight: '100vh',
  backgroundAttachment: 'fixed',
}

const HEADER_STYLE: React.CSSProperties = {
  position: 'sticky', top: 0, zIndex: 10,
  backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
  background: 'rgba(255,255,255,0.75)',
  borderBottom: '1px solid rgba(255,255,255,0.9)',
  height: 60, display: 'flex', alignItems: 'center',
  justifyContent: 'space-between', padding: '0 20px',
}

interface ClientBriefInvitePageProps {
  token: string
}

export function ClientBriefInvitePage({ token }: ClientBriefInvitePageProps) {
  const { data, loading, error, submitInvitation, alreadySubmitted } = useBriefInvitation(token)
  const [companyName, setCompanyName] = useState('')
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(FIELDS.map(f => [f.key, '']))
  )
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (data?.company_name) setCompanyName(data.company_name)
  }, [data])

  const filledCount = FIELDS.filter(f => values[f.key]?.trim()).length
  const companyFilled = companyName.trim().length > 0

  const handleSubmit = useCallback(async () => {
    if (!companyFilled) return
    setSubmitting(true)
    const ok = await submitInvitation(companyName.trim(), values)
    setSubmitting(false)
    if (ok) setSubmitted(true)
  }, [companyName, companyFilled, values, submitInvitation])

  const Header = () => (
    <div style={HEADER_STYLE}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={LOGO_URL} alt="Propul'SEO" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 8 }} />
        <span style={{ fontSize: 13, fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Propul'SEO</span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {companyName || 'Nouveau projet'}
      </span>
    </div>
  )

  const Footer = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 20px 18px', fontSize: 10, color: '#94a3b8' }}>
      <img src={LOGO_URL} alt="" style={{ width: 14, height: 14, objectFit: 'contain', borderRadius: 3, opacity: 0.6 }} />
      <span style={{ fontWeight: 700, color: '#6366f1' }}>Propul'SEO</span>
      <span>·</span>
      <span>🔒 Lien unique sécurisé</span>
    </div>
  )

  if (loading) {
    return (
      <div style={{ ...PAGE_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 32, height: 32, color: '#6366f1', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={PAGE_BG}>
        <Header />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', gap: 12, padding: 24 }}>
          <AlertCircle style={{ width: 40, height: 40, color: '#ef4444' }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Lien invalide ou expiré</p>
          <p style={{ fontSize: 12, color: '#64748b' }}>{error}</p>
        </div>
      </div>
    )
  }

  if (alreadySubmitted || submitted) {
    return (
      <div style={PAGE_BG}>
        <Header />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ maxWidth: 480, margin: '0 auto', padding: '32px 16px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(34,197,94,0.25)', fontSize: 24 }}>✓</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', margin: '0 0 6px' }}>
              {alreadySubmitted ? 'Brief déjà transmis !' : 'Brief transmis !'}
            </h2>
            <p style={{ fontSize: 12, color: '#64748b' }}>Votre projet a été créé. Notre équipe vous contactera bientôt.</p>
          </div>
          {submitted && (
            <>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Vos réponses</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1.5px solid rgba(167,243,208,0.8)', borderRadius: 14, padding: '12px 16px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Entreprise / Projet</div>
                  <div style={{ fontSize: 11, color: '#374151' }}>{companyName}</div>
                </div>
                {FIELDS.map(f => values[f.key]?.trim() ? (
                  <div key={f.key} style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1.5px solid rgba(167,243,208,0.8)', borderRadius: 14, padding: '12px 16px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{RECAP_LABELS[f.key]}</div>
                    <div style={{ fontSize: 11, color: '#374151', whiteSpace: 'pre-wrap' }}>{values[f.key]}</div>
                  </div>
                ) : null)}
              </div>
            </>
          )}
        </motion.div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={PAGE_BG}>
      <Header />

      {/* Barre de progression */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {FIELDS.map((f, i) => (
            <div key={f.key} style={{
              height: 4, flex: 1, borderRadius: 4,
              background: i < filledCount
                ? 'linear-gradient(to right,#6366f1,#a855f7)'
                : i === filledCount
                ? 'linear-gradient(to right,#6366f1,#a855f7)'
                : 'rgba(99,102,241,0.12)',
              opacity: i === filledCount ? 0.35 : 1,
            }} />
          ))}
        </div>
        <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 700, marginTop: 6 }}>
          {filledCount} / {FIELDS.length} champs remplis
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '20px 20px 16px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', marginBottom: 5 }}>Parlez-nous de votre projet</h2>
        <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>Remplissez ce formulaire pour nous aider à bien comprendre votre besoin. Seul le nom de l'entreprise et l'objectif sont obligatoires.</p>
      </div>

      {/* Champ entreprise */}
      <div style={{ padding: '0 16px 10px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1.5px solid ${companyFilled ? 'rgba(167,243,208,0.8)' : '#a5b4fc'}`,
            borderRadius: 16,
            padding: '14px 16px',
            boxShadow: companyFilled ? '0 2px 12px rgba(34,197,94,0.08)' : '0 6px 24px rgba(99,102,241,0.15)',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: 8, background: companyFilled ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
            <Building2 style={{ width: 12, height: 12, color: '#fff' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4c1d95', marginBottom: 5 }}>
              Nom de l'entreprise / projet <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="Ex: Boulangerie Martin, SaaS RH, Refonte Site…"
              style={{ fontSize: 11, color: '#374151', width: '100%', outline: 'none', background: 'transparent', border: 'none', lineHeight: 1.7 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Champs brief */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FIELDS.map((field, i) => (
          <FieldCard
            key={field.key}
            field={field}
            index={i}
            value={values[field.key]}
            onChange={v => setValues(prev => ({ ...prev, [field.key]: v }))}
          />
        ))}
      </div>

      {/* Bouton envoyer */}
      <div style={{ padding: '14px 16px' }}>
        <button
          onClick={handleSubmit}
          disabled={submitting || !companyFilled}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg,#6366f1,#a855f7)',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: 14,
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: submitting || !companyFilled ? 'not-allowed' : 'pointer',
            opacity: submitting || !companyFilled ? 0.5 : 1,
            boxShadow: '0 6px 20px rgba(99,102,241,0.38)',
            letterSpacing: 0.2,
          }}
        >
          {submitting ? (
            <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
          ) : (
            <Send style={{ width: 14, height: 14 }} />
          )}
          {submitting ? 'Envoi en cours…' : 'Envoyer le brief'}
        </button>
      </div>

      <Footer />
    </div>
  )
}
