import { useEffect, useMemo, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { ArrowLeft, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { buildExtensions } from '../lib/tiptap-extensions'
import { ProcedureToolbar } from './ProcedureToolbar'
import { TagInput } from './TagInput'
import { useProcedureCategories } from '../hooks/useProcedureCategories'
import { useProcedures } from '../hooks/useProcedures'
import { useResolvedContent } from '../hooks/useResolvedContent'
import type { Procedure, TipTapDoc } from '../types'

interface ProcedureEditorProps {
  /** null = création, sinon édition */
  procedure: Procedure | null
  onBack: () => void
  onSaved: (p: Procedure) => void
  allTags: string[]
}

const EMPTY_DOC: TipTapDoc = { type: 'doc', content: [] }

export function ProcedureEditor({ procedure, onBack, onSaved, allTags }: ProcedureEditorProps) {
  const { categories } = useProcedureCategories()
  const { create, update } = useProcedures()

  const [title, setTitle] = useState(procedure?.title ?? '')
  const [summary, setSummary] = useState(procedure?.summary ?? '')
  const [categoryId, setCategoryId] = useState<string | null>(procedure?.category_id ?? null)
  const [tags, setTags] = useState<string[]>(procedure?.tags ?? [])
  const [saving, setSaving] = useState(false)

  const initialContent = useMemo<TipTapDoc>(
    () => procedure?.content ?? EMPTY_DOC,
    [procedure?.id]
  )

  const { resolved } = useResolvedContent(initialContent)

  const editor = useEditor(
    {
      extensions: buildExtensions(),
      content: resolved,
      editorProps: {
        attributes: {
          class:
            'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[400px] ' +
            'prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground ' +
            'prose-strong:text-foreground prose-a:text-primary prose-code:text-primary ' +
            'prose-code:bg-surface-3 prose-code:px-1 prose-code:py-0.5 prose-code:rounded ' +
            'prose-code:before:content-none prose-code:after:content-none ' +
            'prose-blockquote:border-l-primary/60 prose-img:rounded-md',
        },
      },
    },
    [procedure?.id, resolved]
  )

  useEffect(() => () => { editor?.destroy() }, [editor])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Le titre est obligatoire')
      return
    }
    if (!editor) return
    setSaving(true)
    const content = editor.getJSON() as TipTapDoc
    const payload = {
      title: title.trim(),
      summary: summary.trim() || null,
      category_id: categoryId,
      tags,
      content,
    }
    const result = procedure
      ? await update(procedure.id, payload)
      : await create(payload)
    setSaving(false)
    if (result) {
      toast.success(procedure ? 'Fiche mise à jour' : 'Fiche créée')
      onSaved(result)
    } else {
      toast.error('Erreur à la sauvegarde')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-surface-1">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-semibold text-foreground">
            {procedure ? 'Éditer la fiche' : 'Nouvelle fiche'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-muted-foreground hover:bg-surface-2 text-sm"
          >
            <X className="h-3.5 w-3.5" />
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium',
              saving && 'opacity-60 cursor-not-allowed'
            )}
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-border/40 bg-surface-1 space-y-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Acheter un nom de domaine sur Namecheap"
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-foreground text-base font-medium focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Résumé</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="1-2 lignes décrivant la procédure…"
            rows={2}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-foreground text-sm focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Catégorie</label>
            <select
              value={categoryId ?? ''}
              onChange={(e) => setCategoryId(e.target.value || null)}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-foreground text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="">— Sans catégorie —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Tags</label>
            <TagInput value={tags} onChange={setTags} suggestions={allTags} />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-surface-1">
        <ProcedureToolbar editor={editor} procedureId={procedure?.id ?? null} />
        <div className="px-6 py-6 max-w-4xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
