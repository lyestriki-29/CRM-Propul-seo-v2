import { useMemo, useState } from 'react'
import { BookOpen, Plus, Search } from 'lucide-react'
import { useProcedures } from '../hooks/useProcedures'
import { useProcedureCategories } from '../hooks/useProcedureCategories'
import { useProcedureSearch } from '../hooks/useProcedureSearch'
import { useIsProceduresAdmin } from '../hooks/useIsProceduresAdmin'
import { CategoryChips } from './CategoryChips'
import { ProcedureCard } from './ProcedureCard'
import type { Procedure } from '../types'

interface ProceduresListProps {
  onOpen: (procedure: Procedure) => void
  onCreate: () => void
}

export function ProceduresList({ onOpen, onCreate }: ProceduresListProps) {
  const { procedures, loading } = useProcedures()
  const { categories, create: createCategory, remove: removeCategory } = useProcedureCategories()
  const { isAdmin } = useIsProceduresAdmin()

  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const { results: searchResults, loading: searching } = useProcedureSearch(query)

  const base = searchResults ?? procedures

  const filtered = useMemo(() => {
    return base.filter((p) => {
      if (selectedCategory && p.category_id !== selectedCategory) return false
      if (selectedTag && !p.tags.includes(selectedTag)) return false
      return true
    })
  }, [base, selectedCategory, selectedTag])

  const pinned = filtered.filter((p) => p.is_pinned)
  const others = filtered.filter((p) => !p.is_pinned)

  const allTags = useMemo(() => {
    const s = new Set<string>()
    procedures.forEach((p) => p.tags.forEach((t) => s.add(t)))
    return Array.from(s).sort()
  }, [procedures])

  const catById = useMemo(() => {
    const m = new Map(categories.map((c) => [c.id, c]))
    return m
  }, [categories])

  return (
    <div className="min-h-screen p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Procédures</h1>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/30">
              Wiki interne
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {procedures.length} fiche{procedures.length !== 1 ? 's' : ''} ·{' '}
            {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Nouvelle fiche
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une procédure…"
          className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
        />
        {searching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">…</span>
        )}
      </div>

      <CategoryChips
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        isAdmin={isAdmin}
        onCreate={createCategory}
        onDelete={removeCategory}
      />

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Tags :</span>
          {allTags.slice(0, 20).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={
                selectedTag === tag
                  ? 'text-[11px] bg-primary/20 text-primary px-2 py-0.5 rounded'
                  : 'text-[11px] text-muted-foreground hover:text-primary px-2 py-0.5 rounded hover:bg-primary/10 transition-colors'
              }
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-muted-foreground text-sm">Chargement…</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border/60 rounded-lg">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {query || selectedCategory || selectedTag
              ? 'Aucune fiche ne correspond aux filtres.'
              : 'Aucune procédure pour le moment.'}
          </p>
          {isAdmin && !query && !selectedCategory && !selectedTag && (
            <button
              onClick={onCreate}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Créer la première fiche
            </button>
          )}
        </div>
      )}

      {pinned.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            📌 Épinglées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {pinned.map((p) => (
              <ProcedureCard
                key={p.id}
                procedure={p}
                category={p.category_id ? catById.get(p.category_id) ?? null : null}
                onClick={() => onOpen(p)}
              />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div className="space-y-2">
          {pinned.length > 0 && (
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Toutes les fiches
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {others.map((p) => (
              <ProcedureCard
                key={p.id}
                procedure={p}
                category={p.category_id ? catById.get(p.category_id) ?? null : null}
                onClick={() => onOpen(p)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
