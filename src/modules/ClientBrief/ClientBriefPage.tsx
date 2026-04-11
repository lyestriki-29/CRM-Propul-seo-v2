// src/modules/ClientBrief/ClientBriefPage.tsx
import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Send } from 'lucide-react'
import { useBriefByToken } from '@/modules/ProjectsManagerV2/hooks/useBriefV2'
import type { BriefFields } from '@/modules/ProjectsManagerV2/hooks/useBriefV2'

interface FieldDef {
  key: keyof BriefFields
  label: string
  placeholder: string
  required?: boolean
  rows: number
}

const FIELDS: FieldDef[] = [
  { key: 'objective',         label: 'Objectif du projet',                  placeholder: 'Quel est l\'objectif principal du projet ?',        required: true, rows: 4 },
  { key: 'target_audience',   label: 'Cible / utilisateurs',                placeholder: 'Qui sont les utilisateurs cibles ?',                rows: 3 },
  { key: 'pages',             label: 'Pages / Fonctionnalités attendues',   placeholder: 'Listez les pages ou fonctionnalités souhaitées...', rows: 4 },
  { key: 'techno',            label: 'Technologie / stack',                 placeholder: 'Stack technique ou préférences technologiques...', rows: 2 },
  { key: 'design_references', label: 'Références design',                   placeholder: 'URLs, inspirations visuelles, exemples de sites...', rows: 3 },
  { key: 'notes',             label: 'Notes complémentaires',               placeholder: 'Toute information utile pour l\'équipe...',         rows: 3 },
]

interface ClientBriefPageProps {
  token: string
}

export function ClientBriefPage({ token }: ClientBriefPageProps) {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
    document.body.style.background = '#ffffff'
    return () => {
      // Restore dark mode if this component ever unmounts within the CRM layout
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
      document.body.style.background = ''
    }
  }, [])

  const { data, loading, error, submitBrief } = useBriefByToken(token)
  const [fields, setFields] = useState<Record<keyof BriefFields, string>>({
    objective: '', target_audience: '', pages: '', techno: '', design_references: '', notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const alreadySubmitted = data?.brief?.submitted_at != null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fields.objective.trim()) {
      setValidationError('Le champ "Objectif du projet" est obligatoire.')
      return
    }
    setValidationError(null)
    setSubmitting(true)
    const ok = await submitBrief({
      objective:         fields.objective.trim()         || null,
      target_audience:   fields.target_audience.trim()   || null,
      pages:             fields.pages.trim()             || null,
      techno:            fields.techno.trim()            || null,
      design_references: fields.design_references.trim() || null,
      notes:             fields.notes.trim()             || null,
    })
    setSubmitting(false)
    if (ok) {
      setSubmitted(true)
    } else {
      setValidationError('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Chargement du formulaire…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Lien invalide</h1>
          <p className="text-slate-500">{error ?? 'Ce lien est invalide ou a été désactivé.'}</p>
        </div>
      </div>
    )
  }

  if (submitted || alreadySubmitted) {
    const submittedDate = data.brief?.submitted_at
      ? new Date(data.brief.submitted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : null

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-5" />
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            {alreadySubmitted && !submitted ? 'Brief déjà transmis' : 'Merci !'}
          </h1>
          <p className="text-slate-500 leading-relaxed">
            {alreadySubmitted && !submitted
              ? `Votre brief a déjà été transmis${submittedDate ? ` le ${submittedDate}` : ''}. L'équipe Propul'SEO l'a bien reçu.`
              : 'Votre brief a bien été transmis à l\'équipe Propul\'SEO. Nous reviendrons vers vous rapidement.'}
          </p>
          {alreadySubmitted && !submitted && data.brief && (
            <div className="mt-8 text-left space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vos réponses</p>
              {FIELDS.map(f => {
                const val = data.brief?.[f.key as keyof typeof data.brief] as string | null | undefined
                if (!val) return null
                return (
                  <div key={f.key} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 mb-1">{f.label}</p>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{val}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-md">
            Propul'SEO
          </span>
          <span className="text-sm font-bold text-slate-800">{data.projectName}</span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-4 py-10 text-center">
        <p className="text-indigo-200 text-[11px] font-semibold tracking-widest uppercase mb-2">Formulaire de brief</p>
        <h1 className="text-white text-2xl font-extrabold">{data.projectName}</h1>
        <p className="text-indigo-200 text-sm mt-2 max-w-md mx-auto">
          Merci de remplir ce formulaire pour nous aider à bien comprendre votre projet. Seul le champ "Objectif" est obligatoire.
        </p>
      </div>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map(field => (
            <div key={field.key} className="bg-white border border-slate-200 rounded-2xl p-5">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                value={fields[field.key]}
                onChange={e => setFields(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                rows={field.rows}
                className="w-full text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none"
              />
            </div>
          ))}

          {validationError && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {validationError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3.5 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Envoi en cours…</>
              : <><Send className="w-4 h-4" /> Envoyer le brief</>
            }
          </button>
        </form>
      </main>

      <footer className="max-w-2xl mx-auto px-4 pb-10 flex items-center justify-center gap-2 text-xs text-slate-400">
        <span className="font-semibold text-indigo-600">Propul'SEO</span>
        <span>·</span>
        <span>Formulaire sécurisé</span>
        <span>·</span>
        <span>🔒 Accès par lien unique</span>
      </footer>
    </div>
  )
}
