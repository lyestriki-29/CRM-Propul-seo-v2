import { useState, useRef, useEffect, useMemo } from 'react'
import {
  FileText, Upload, Download, Trash2, X, Mail,
  Folder, FolderOpen, Search, ChevronDown, ChevronRight,
  FileImage, FileSpreadsheet, Archive, Receipt, ClipboardList, Briefcase,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../../lib/utils'
import { v2 } from '../../../lib/supabase'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { DocumentCategory } from '../../../types/project-v2'

// ─── Config catégories ───────────────────────────────────────────────────────

const CATEGORIES: Record<DocumentCategory, {
  label: string
  color: string
  bg: string
  icon: typeof FileText
}> = {
  contract:    { label: 'Contrats',     color: 'text-blue-300',    bg: 'bg-blue-500/10 border-blue-500/30',    icon: ClipboardList },
  invoice:     { label: 'Factures',     color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: Receipt },
  brief:       { label: 'Briefs',       color: 'text-purple-300',  bg: 'bg-purple-500/10 border-purple-500/30', icon: FileText },
  report:      { label: 'Rapports',     color: 'text-teal-300',    bg: 'bg-teal-500/10 border-teal-500/30',    icon: FileSpreadsheet },
  mockup:      { label: 'Maquettes',    color: 'text-orange-300',  bg: 'bg-orange-500/10 border-orange-500/30', icon: FileImage },
  deliverable: { label: 'Livrables',    color: 'text-green-300',   bg: 'bg-green-500/10 border-green-500/30',  icon: Archive },
  other:       { label: 'Autres',       color: 'text-gray-400',    bg: 'bg-gray-500/10 border-gray-500/30',    icon: Briefcase },
}

const CATEGORY_ORDER: DocumentCategory[] = ['contract', 'invoice', 'brief', 'report', 'mockup', 'deliverable', 'other']

// ─── Détection automatique ───────────────────────────────────────────────────

function inferCategory(filename: string, mimeType?: string | null, emailSubject?: string): DocumentCategory {
  const name = filename.toLowerCase()
  const subject = (emailSubject ?? '').toLowerCase()
  const mime = (mimeType ?? '').toLowerCase()

  // Factures
  if (/facture|invoice|devis|acompte|solde|payment|paiement/.test(name + subject)) return 'invoice'
  // Contrats
  if (/contrat|contract|accord|agreement|cgv|cgvu|nda|mandat/.test(name + subject)) return 'contract'
  // Briefs / CDC
  if (/brief|cahier.des.charges|cdc|spec|specification|onboarding/.test(name + subject)) return 'brief'
  // Rapports
  if (/rapport|report|audit|analyse|analytics|bilan|review|mensuel|hebdo/.test(name + subject)) return 'report'
  // Maquettes / design
  if (/maquette|mockup|wireframe|prototype|design|figma|sketch|xd/.test(name) || mime.includes('figma')) return 'mockup'
  // Livrables
  if (/livrable|deliverable|livraison|export|final|v\d+/.test(name + subject) || mime === 'application/zip') return 'deliverable'
  // Mime-based fallback
  if (mime.includes('image')) return 'mockup'
  if (mime.includes('spreadsheet') || mime.includes('excel') || name.endsWith('.xlsx') || name.endsWith('.xls')) return 'report'
  if (mime.includes('pdf')) {
    if (/contrat|contract/.test(name + subject)) return 'contract'
    if (/facture|invoice|devis/.test(name + subject)) return 'invoice'
  }
  return 'other'
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Doc {
  id: string
  project_id: string
  name: string
  category: DocumentCategory
  version: string | null
  file_path: string | null
  file_size: number | null
  mime_type: string | null
  uploader_name: string | null
  source: string
  gmail_metadata: { message_id: string; attachment_id: string; subject: string; from: string } | null
  created_at: string
}

type SortKey = 'date' | 'name' | 'size'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function ProjectDocuments({ projectId }: { projectId: string }) {
  const [docs, setDocs]           = useState<Doc[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [sortKey, setSortKey]     = useState<SortKey>('date')
  const [openFolders, setOpenFolders] = useState<Set<DocumentCategory>>(new Set(CATEGORY_ORDER))
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDocs = async () => {
    const { data } = await v2
      .from('project_documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    setDocs((data as Doc[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchDocs() }, [projectId])

  // Filtrage + tri
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return docs
      .filter(d => !q || d.name.toLowerCase().includes(q) || (d.uploader_name ?? '').toLowerCase().includes(q))
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name)
        if (sortKey === 'size') return (b.file_size ?? 0) - (a.file_size ?? 0)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [docs, search, sortKey])

  // Groupés par catégorie
  const grouped = useMemo(() => {
    const map = new Map<DocumentCategory, Doc[]>()
    for (const cat of CATEGORY_ORDER) map.set(cat, [])
    for (const doc of filtered) {
      const cat = doc.category in CATEGORIES ? doc.category : 'other'
      map.get(cat as DocumentCategory)!.push(doc)
    }
    return map
  }, [filtered])

  const toggleFolder = (cat: DocumentCategory) => {
    setOpenFolders(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const existingVersions = docs
      .filter(d => d.name.toLowerCase() === file.name.toLowerCase())
      .map(d => parseInt(d.version ?? '1'))
    const version = String(existingVersions.length > 0 ? Math.max(...existingVersions) + 1 : 1)
    const { error } = await v2.from('project_documents').insert({
      project_id: projectId,
      name: file.name,
      category: inferCategory(file.name, file.type),
      version,
      file_size: file.size,
      mime_type: file.type || null,
      uploader_name: 'Admin',
      source: 'upload',
    })
    if (!error) { toast.success(`"${file.name}" ajouté`); fetchDocs() }
    else toast.error('Erreur lors de l\'ajout')
    e.target.value = ''
  }

  const handleDelete = async (doc: Doc) => {
    await v2.from('project_documents').delete().eq('id', doc.id)
    setDocs(prev => prev.filter(d => d.id !== doc.id))
    setConfirmDeleteId(null)
    toast.success('Document supprimé')
  }

  const getDownloadUrl = (doc: Doc): string | null => {
    if (doc.source === 'gmail' && doc.gmail_metadata) {
      const { message_id, attachment_id } = doc.gmail_metadata
      return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-get-attachment?messageId=${message_id}&attachmentId=${attachment_id}&filename=${encodeURIComponent(doc.name)}&mimeType=${encodeURIComponent(doc.mime_type ?? 'application/octet-stream')}`
    }
    return doc.file_path ?? null
  }

  const hasGmail = docs.some(d => d.source === 'gmail')

  if (loading) return <div className="py-12 text-center text-sm text-muted-foreground">Chargement…</div>

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Documents</h3>
          <span className="text-xs text-muted-foreground">{docs.length} fichier{docs.length !== 1 ? 's' : ''}</span>
          {hasGmail && (
            <span className="text-[10px] text-blue-400 flex items-center gap-0.5 bg-blue-500/10 px-1.5 py-0.5 rounded">
              <Mail className="h-2.5 w-2.5" /> Gmail sync
            </span>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Uploader
        </button>
      </div>

      {/* Barre recherche + tri */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un document…"
            className="w-full pl-8 pr-3 py-1.5 bg-surface-2 border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className="bg-surface-2 border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none"
        >
          <option value="date">Plus récent</option>
          <option value="name">Nom</option>
          <option value="size">Taille</option>
        </select>
      </div>

      {/* Dossiers GED */}
      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
          <FileText className="h-10 w-10 opacity-30" />
          <p className="text-sm">Aucun document pour ce projet.</p>
          <p className="text-xs opacity-60">Les PJ des emails apparaissent ici après une sync Gmail.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {CATEGORY_ORDER.map(cat => {
            const catDocs = grouped.get(cat) ?? []
            if (catDocs.length === 0) return null
            const conf    = CATEGORIES[cat]
            const Icon    = conf.icon
            const isOpen  = openFolders.has(cat)

            return (
              <div key={cat} className={cn('rounded-lg border overflow-hidden', conf.bg)}>
                {/* En-tête dossier */}
                <button
                  onClick={() => toggleFolder(cat)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/5 transition-colors"
                >
                  {isOpen
                    ? <FolderOpen className={cn('h-4 w-4 shrink-0', conf.color)} />
                    : <Folder className={cn('h-4 w-4 shrink-0', conf.color)} />
                  }
                  <span className={cn('text-sm font-medium flex-1 text-left', conf.color)}>{conf.label}</span>
                  <span className="text-xs text-muted-foreground">{catDocs.length}</span>
                  {isOpen
                    ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  }
                </button>

                {/* Documents */}
                {isOpen && (
                  <div className="border-t border-white/10 divide-y divide-white/5">
                    {catDocs.map(doc => {
                      const url = getDownloadUrl(doc)
                      return (
                        <div key={doc.id}>
                          <div className="flex items-center gap-3 px-3 py-2.5 bg-surface-1/50 hover:bg-surface-2/50 transition-colors">
                            <FileText className="h-6 w-6 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground truncate">{doc.name}</p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                {doc.version && (
                                  <span className="text-[10px] bg-surface-3 text-muted-foreground px-1.5 py-0.5 rounded">V{doc.version}</span>
                                )}
                                {doc.source === 'gmail' && (
                                  <span className="text-[10px] text-blue-400 flex items-center gap-0.5">
                                    <Mail className="h-2.5 w-2.5" /> Gmail
                                  </span>
                                )}
                                {doc.file_size != null && (
                                  <span className="text-[10px] text-muted-foreground">{formatSize(doc.file_size)}</span>
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {format(parseISO(doc.created_at), 'd MMM yyyy', { locale: fr })}
                                </span>
                                {doc.uploader_name && (
                                  <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{doc.uploader_name}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {url ? (
                                <a href={url} target="_blank" rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground transition-colors p-1" title="Télécharger"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              ) : (
                                <button onClick={() => toast.info('Fichier non disponible')}
                                  className="text-muted-foreground/40 p-1 cursor-not-allowed"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              )}
                              <button onClick={() => setConfirmDeleteId(doc.id)}
                                className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {confirmDeleteId === doc.id && (
                            <div className="flex items-center justify-between gap-2 px-3 py-2 bg-red-500/10 border-t border-red-500/20">
                              <p className="text-xs text-red-300">Supprimer ce document ?</p>
                              <div className="flex gap-2">
                                <button onClick={() => handleDelete(doc)}
                                  className="px-2.5 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                                >Supprimer</button>
                                <button onClick={() => setConfirmDeleteId(null)}
                                  className="px-2.5 py-1 border border-border rounded text-xs text-muted-foreground hover:bg-surface-3 transition-colors"
                                ><X className="h-3 w-3" /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && search && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Aucun document pour "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
