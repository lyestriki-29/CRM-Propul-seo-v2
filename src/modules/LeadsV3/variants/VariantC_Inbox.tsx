import { useState, useMemo } from 'react'
import { Inbox } from 'lucide-react'
import { LeadCardV3, type LeadCardData } from '../components/LeadCardV3'

interface InboxColumn {
  id: string
  label: string
  color: string
}

interface Props {
  columns: InboxColumn[]
  leadStatus: Record<string, string>
  leads: LeadCardData[]
  onLeadClick: (id: string) => void
  /** Conversion lead → projet (bouton affiché uniquement si fourni + lead signé). */
  onConvert?: (data: LeadCardData) => void
  isLeadSigned?: (leadId: string) => boolean
  convertingId?: string | null
}

/**
 * Variante C — "Inbox" : liste verticale unique, filtres par statut (pills).
 * Pas de drag & drop. Cartes détaillées avec badge statut visible.
 */
export function VariantC_Inbox({ columns, leadStatus, leads, onLeadClick, onConvert, isLeadSigned, convertingId }: Props) {
  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setActiveStatuses(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const counts = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const c of columns) acc[c.id] = 0
    for (const l of leads) {
      const s = leadStatus[l.id]
      if (s && acc[s] !== undefined) acc[s] += 1
    }
    return acc
  }, [columns, leads, leadStatus])

  const filtered = useMemo(() => {
    if (activeStatuses.size === 0) return leads
    return leads.filter(l => activeStatuses.has(leadStatus[l.id] ?? ''))
  }, [leads, leadStatus, activeStatuses])

  return (
    <div className="space-y-5">
      {/* Pills statuts */}
      <div className="flex items-center gap-2 flex-wrap px-4 py-3 bg-[#0f0b1e] border border-[rgba(139,92,246,0.18)] rounded-[10px]">
        <span className="text-[11px] uppercase tracking-[0.08em] text-[#6b7280] font-semibold mr-1">
          Filtrer par statut
        </span>
        {columns.map(col => {
          const active = activeStatuses.has(col.id)
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => toggle(col.id)}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-semibold cursor-pointer transition-all duration-150 border"
              style={{
                color: col.color,
                borderColor: active ? col.color : 'transparent',
                background: active ? `${col.color}1A` : 'transparent',
                opacity: active ? 1 : 0.7,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: col.color, boxShadow: active ? `0 0 8px ${col.color}` : 'none' }}
              />
              {col.label}
              <span className="ml-1 text-[10px] text-[#9ca3af] tabular-nums">{counts[col.id]}</span>
            </button>
          )
        })}
        {activeStatuses.size > 0 && (
          <button
            type="button"
            onClick={() => setActiveStatuses(new Set())}
            className="ml-1 text-[11px] text-[#9ca3af] hover:text-[#A78BFA] underline-offset-2 hover:underline"
          >
            Tout afficher
          </button>
        )}
      </div>

      {/* Liste unique */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-[rgba(139,92,246,0.18)] rounded-xl bg-[#0f0b1e]">
          <Inbox className="h-10 w-10 text-[#6b7280] opacity-40 mb-3" />
          <p className="text-[13px] text-[#9ca3af]">Aucun lead ne correspond aux filtres</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Essayez de retirer un filtre pour élargir la sélection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(lead => {
            const eligible = onConvert && isLeadSigned?.(lead.id)
            return (
              <LeadCardV3
                key={lead.id}
                data={lead}
                showStatusBadge
                onClick={() => onLeadClick(lead.id)}
                onConvert={eligible ? onConvert : undefined}
                converting={convertingId === lead.id}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
