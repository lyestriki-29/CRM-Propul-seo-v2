import { useEffect, useMemo, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { ArrowLeft, Edit2, History, Pin, PinOff, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { buildExtensions } from '../lib/tiptap-extensions'
import { useIsProceduresAdmin } from '../hooks/useIsProceduresAdmin'
import { useProcedureCategories } from '../hooks/useProcedureCategories'
import { useProcedures } from '../hooks/useProcedures'
import { useResolvedContent } from '../hooks/useResolvedContent'
import type { Procedure, TipTapNode } from '../types'

interface ProcedureDetailProps {
  procedure: Procedure
  onBack: () => void
  onEdit: () => void
  onOpenRevisions: () => void
  onRefresh: (id: string) => Promise<Procedure | null>
}

export function ProcedureDetail({
  procedure,
  onBack,
  onEdit,
  onOpenRevisions,
  onRefresh,
}: ProcedureDetailProps) {
  const { isAdmin } = useIsProceduresAdmin()
  const { categories } = useProcedureCategories()
  const { togglePin, archive } = useProcedures()

  const [current, setCurrent] = useState<Procedure>(procedure)

  useEffect(() => {
    setCurrent(procedure)
  }, [procedure])

  const category = useMemo(
    () => categories.find((c) => c.id === current.category_id) ?? null,
    [categories, current.category_id]
  )

  const toc = useMemo(() => extractHeadings(current.content.content ?? []), [current.content])

  const { resolved } = useResolvedContent(current.content)

  const editor = useEditor(
    {
      editable: false,
      extensions: buildExtensions({ editable: false }),
      content: resolved,
    },
    [current.id, resolved]
  )

  useEffect(() => () => { editor?.destroy() }, [editor])

  const handleTogglePin = async () => {
    const ok = await togglePin(current.id, !current.is_pinned)
    if (ok) {
      toast.success(current.is_pinned ? 'Détachée' : 'Épinglée')
      const fresh = await onRefresh(current.id)
      if (fresh) setCurrent(fresh)
    } else {
      toast.error('Erreur')
    }
  }

  const handleArchive = async () => {
    if (!confirm(`Archiver la fiche "${current.title}" ?`)) return
    const ok = await archive(current.id)
    if (ok) {
      toast.success('Fiche archivée')
      onBack()
    } else {
      toast.error('Erreur')
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
          <button onClick={onBack} className="hover:text-foreground transition-colors">
            Procédures
          </button>
          {category && (
            <>
              <span>›</span>
              <span>{category.name}</span>
            </>
          )}
          <span>›</span>
          <span className="text-foreground truncate max-w-[300px]">{current.title}</span>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 max-w-3xl">
          <header className="mb-6 pb-4 border-b border-border/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-foreground mb-2">{current.title}</h1>
                {current.summary && (
                  <p className="text-muted-foreground text-sm leading-relaxed">{current.summary}</p>
                )}
              </div>
              {isAdmin && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleTogglePin}
                    className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                    title={current.is_pinned ? 'Détacher' : 'Épingler'}
                  >
                    {current.is_pinned ? (
                      <PinOff className="h-4 w-4" />
                    ) : (
                      <Pin className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={onOpenRevisions}
                    className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                    title="Historique"
                  >
                    <History className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Éditer
                  </button>
                  <button
                    onClick={handleArchive}
                    className="p-2 rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Archiver"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground">
              {category && (
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${category.color ?? '#8b5cf6'}1a`,
                    borderColor: `${category.color ?? '#8b5cf6'}55`,
                    color: category.color ?? undefined,
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: category.color ?? '#8b5cf6' }}
                  />
                  {category.name}
                </span>
              )}
              {current.tags.map((t) => (
                <span key={t} className="text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded">
                  #{t}
                </span>
              ))}
              <span className="ml-auto">
                Maj le {new Date(current.updated_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </header>

          <article
            className={cn(
              'prose prose-invert prose-sm max-w-none',
              'prose-headings:text-foreground prose-headings:font-semibold',
              'prose-h1:text-2xl prose-h2:text-xl prose-h3:text-base',
              'prose-p:text-foreground prose-p:leading-relaxed',
              'prose-strong:text-foreground',
              'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
              'prose-code:text-primary prose-code:before:content-none prose-code:after:content-none',
              'prose-code:bg-surface-3 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs',
              'prose-blockquote:border-l-primary/60 prose-blockquote:text-muted-foreground',
              'prose-li:text-foreground',
              'prose-img:rounded-md'
            )}
          >
            <EditorContent editor={editor} />
          </article>
        </div>

        {toc.length > 0 && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-6">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Sommaire
              </h3>
              <nav className="space-y-1">
                {toc.map((h, i) => (
                  <a
                    key={i}
                    href={`#${slugifyHeading(h.text)}`}
                    className={cn(
                      'block text-xs text-muted-foreground hover:text-primary transition-colors',
                      h.level === 3 && 'pl-3',
                      h.level >= 4 && 'pl-6'
                    )}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

function extractHeadings(nodes: TipTapNode[]): { level: number; text: string }[] {
  const result: { level: number; text: string }[] = []
  for (const n of nodes) {
    if (n.type === 'heading') {
      const level = (n.attrs?.level as number | undefined) ?? 2
      const text = (n.content ?? [])
        .map((c) => c.text ?? '')
        .join('')
        .trim()
      if (text) result.push({ level, text })
    }
  }
  return result
}

function slugifyHeading(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
