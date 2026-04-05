import { FileText, Upload, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { DocumentCategory } from '../../../types/project-v2'

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  contract:    'Contrat',
  brief:       'Brief',
  mockup:      'Maquette',
  report:      'Rapport',
  deliverable: 'Livrable',
  invoice:     'Facture',
  other:       'Autre',
}

const CATEGORY_COLORS: Record<DocumentCategory, string> = {
  contract:    'bg-blue-500/20 text-blue-300',
  brief:       'bg-purple-500/20 text-purple-300',
  mockup:      'bg-orange-500/20 text-orange-300',
  report:      'bg-teal-500/20 text-teal-300',
  deliverable: 'bg-green-500/20 text-green-300',
  invoice:     'bg-emerald-500/20 text-emerald-300',
  other:       'bg-gray-500/20 text-gray-400',
}

const MOCK_DOCUMENTS = [
  {
    id: 'doc-001', name: 'Brief_Client_V1.pdf', category: 'brief' as DocumentCategory,
    version: 1, file_size: 245000, mime_type: 'application/pdf',
    uploader_name: 'Alice Martin', created_at: '2026-03-15T10:00:00Z',
  },
  {
    id: 'doc-002', name: 'Maquettes_Desktop_V2.fig', category: 'mockup' as DocumentCategory,
    version: 2, file_size: 8200000, mime_type: 'application/figma',
    uploader_name: 'Carol Petit', created_at: '2026-03-22T14:30:00Z',
  },
]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
}

export function ProjectDocuments() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Documents</h3>
        <button
          onClick={() => toast.info('Upload disponible après connexion Supabase Storage')}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Uploader
        </button>
      </div>

      <div className="space-y-2">
        {MOCK_DOCUMENTS.map(doc => (
          <div key={doc.id} className="flex items-center gap-3 bg-surface-2 border border-border rounded-lg p-3 hover:border-border/80 transition-colors">
            <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                <span className="text-[10px] bg-surface-3 text-muted-foreground px-1.5 py-0.5 rounded shrink-0">
                  V{doc.version}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${CATEGORY_COLORS[doc.category]}`}>
                  {CATEGORY_LABELS[doc.category]}
                </span>
                <span className="text-[10px] text-muted-foreground">{formatSize(doc.file_size)}</span>
                <span className="text-[10px] text-muted-foreground">{doc.uploader_name}</span>
              </div>
            </div>
            <button
              onClick={() => toast.info('Téléchargement disponible après connexion Supabase Storage')}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {MOCK_DOCUMENTS.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
          <FileText className="h-10 w-10 opacity-30" />
          <p className="text-sm">Aucun document pour ce projet.</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Auto-versioning et upload Supabase Storage — Sprint 2
      </p>
    </div>
  )
}
