import { useState, useEffect } from 'react'
import { FileSpreadsheet, Save, CheckCircle2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { PDFDownloadLink } from '@react-pdf/renderer'
import type { BriefStatus } from '../../../types/project-v2'
import { useBriefV2 } from '../../ProjectsManagerV2/hooks/useBriefV2'
import { ShareBriefButton } from './ShareBriefButton'
import { BriefPDFDocument } from './BriefPDFDocument'

const STATUS_CONFIG: Record<BriefStatus, { label: string; color: string }> = {
  draft:     { label: 'Brouillon',  color: 'bg-gray-500/20 text-gray-400' },
  submitted: { label: 'Reçu',       color: 'bg-blue-500/20 text-blue-300' },
  validated: { label: 'Validé',     color: 'bg-green-500/20 text-green-300' },
  frozen:    { label: 'Figé',       color: 'bg-blue-500/20 text-blue-300' },
}

interface BriefField {
  key: string
  label: string
  placeholder: string
  rows?: number
}

const FIELDS: BriefField[] = [
  { key: 'objective',         label: 'Objectif',                  placeholder: 'Quel est l\'objectif principal du projet ?',        rows: 3 },
  { key: 'target_audience',   label: 'Cible',                     placeholder: 'Qui sont les utilisateurs cibles ?',               rows: 2 },
  { key: 'pages',             label: 'Pages / Fonctionnalités',   placeholder: 'Listez les pages ou fonctionnalités attendues...', rows: 3 },
  { key: 'techno',            label: 'Technologie',               placeholder: 'Stack technique retenue...',                      rows: 2 },
  { key: 'design_references', label: 'Références design',         placeholder: 'URLs, inspirations visuelles...',                 rows: 2 },
  { key: 'notes',             label: 'Notes complémentaires',     placeholder: 'Toute information utile...',                      rows: 3 },
]

const BRIEF_FIELD_KEYS = ['objective', 'target_audience', 'pages', 'techno', 'design_references', 'notes'] as const

interface ProjectBriefProps {
  projectId: string
}

export function ProjectBrief({ projectId }: ProjectBriefProps) {
  const { brief, loading, projectName, saveBrief } = useBriefV2(projectId)
  const [status, setStatus] = useState<BriefStatus>('draft')
  const [fields, setFields] = useState<Record<string, string>>({
    objective: '', target_audience: '', pages: '', techno: '', design_references: '', notes: '',
  })
  const [forceEdit, setForceEdit] = useState(false)

  useEffect(() => {
    if (!brief) return
    setStatus(brief.status ?? 'draft')
    setFields({
      objective:         brief.objective         ?? '',
      target_audience:   brief.target_audience   ?? '',
      pages:             brief.pages             ?? '',
      techno:            brief.techno            ?? '',
      design_references: brief.design_references ?? '',
      notes:             brief.notes             ?? '',
    })
  }, [brief])

  const handleSave = async () => {
    try {
      await saveBrief({ ...fields, status })
      toast.success('Brief sauvegardé')
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const isSubmitted = brief?.status === 'submitted'
  const isReadOnly = (isSubmitted && !forceEdit) || status === 'frozen'
  const statusConf = STATUS_CONFIG[status]

  // Vérifie les données sauvegardées (brief Supabase), pas les champs locaux non encore sauvegardés
  const hasBriefContent = !!brief && BRIEF_FIELD_KEYS.some(k => (brief[k] ?? '').trim().length > 0)
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'projet'

  if (loading) {
    return <div className="text-sm text-muted-foreground py-4">Chargement…</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-foreground">Brief & Spécifications</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {isSubmitted && !forceEdit && (
            <div className="flex items-center gap-1.5 text-xs text-blue-300">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              {brief.submitted_at ? `Reçu le ${new Date(brief.submitted_at).toLocaleDateString('fr-FR')}` : 'Brief reçu'}
            </div>
          )}
          <span className={`text-xs px-2 py-0.5 rounded ${statusConf.color}`}>{statusConf.label}</span>
          {!isSubmitted && (
            <select
              value={status}
              onChange={e => setStatus(e.target.value as BriefStatus)}
              className="bg-surface-2 border border-border rounded-md px-2 py-1 text-xs text-foreground"
            >
              <option value="draft">Brouillon</option>
              <option value="validated">Validé</option>
              <option value="frozen">Figé</option>
            </select>
          )}
          {/* Bouton formulaire vierge — toujours visible */}
          <PDFDownloadLink
            document={
              <BriefPDFDocument
                projectName={projectName || 'Projet'}
                brief={brief}
                mode="blank"
              />
            }
            fileName={`brief-vierge-${slug}.pdf`}
          >
            {({ loading: pdfLoading, url }) => (
              <a
                href={url ?? undefined}
                download={`brief-vierge-${slug}.pdf`}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-2 border border-border rounded-md text-xs text-foreground hover:bg-surface-3 transition-colors aria-disabled:opacity-50 no-underline"
                aria-disabled={pdfLoading || !url}
                onClick={e => { if (pdfLoading || !url) e.preventDefault() }}
              >
                <Download className="h-3 w-3" />
                {pdfLoading ? 'Génération…' : 'Formulaire vierge'}
              </a>
            )}
          </PDFDownloadLink>

          {/* Bouton récapitulatif — visible si brief non vide */}
          {hasBriefContent && (
            <PDFDownloadLink
              document={
                <BriefPDFDocument
                  projectName={projectName || 'Projet'}
                  brief={brief}
                  mode="filled"
                  submittedAt={brief?.submitted_at}
                />
              }
              fileName={`brief-recap-${slug}.pdf`}
            >
              {({ loading: pdfLoading, url }) => (
                <a
                  href={url ?? undefined}
                  download={`brief-recap-${slug}.pdf`}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs text-indigo-300 hover:bg-indigo-500/20 transition-colors aria-disabled:opacity-50 no-underline"
                  aria-disabled={pdfLoading || !url}
                  onClick={e => { if (pdfLoading || !url) e.preventDefault() }}
                >
                  <Download className="h-3 w-3" />
                  {pdfLoading ? 'Génération…' : 'Récapitulatif'}
                </a>
              )}
            </PDFDownloadLink>
          )}

          <ShareBriefButton projectId={projectId} />
        </div>
      </div>

      <div className="space-y-3">
        {FIELDS.map(field => (
          <div key={field.key} className="bg-surface-2 border border-border rounded-lg p-3">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              {field.label}
            </label>
            <textarea
              value={fields[field.key]}
              onChange={e => setFields(prev => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              rows={field.rows ?? 2}
              disabled={isReadOnly}
              className="w-full bg-transparent text-sm text-foreground placeholder-muted-foreground/50 resize-none focus:outline-none disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      {isSubmitted && !forceEdit && (
        <button
          onClick={() => setForceEdit(true)}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Modifier quand même
        </button>
      )}

      {(!isSubmitted || forceEdit) && status !== 'frozen' && (
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Save className="h-4 w-4" />
          Sauvegarder le brief
        </button>
      )}

      {status === 'frozen' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface-2 border border-border rounded-lg p-3">
          <FileSpreadsheet className="h-4 w-4 shrink-0" />
          Le brief est figé. Changez le statut pour le modifier.
        </div>
      )}
    </div>
  )
}
