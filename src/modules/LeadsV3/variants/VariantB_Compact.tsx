import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { LeadCardV3Compact } from '../components/LeadCardV3Compact'
import type { LeadCardData } from '../components/LeadCardV3'

interface CompactColumn {
  id: string
  label: string
  color: string
}

interface Props {
  columns: CompactColumn[]
  leadStatus: Record<string, string>
  leads: LeadCardData[]
  onLeadClick: (id: string) => void
  /** Change le statut via un select inline. */
  onStatusChange: (id: string, newStatus: string) => Promise<void>
}

export function VariantB_Compact({ columns, leadStatus, leads, onLeadClick, onStatusChange }: Props) {
  const byColumn = useMemo(() => {
    const acc: Record<string, LeadCardData[]> = {}
    for (const c of columns) acc[c.id] = []
    for (const l of leads) {
      const s = leadStatus[l.id]
      if (s && acc[s]) acc[s].push(l)
    }
    return acc
  }, [columns, leads, leadStatus])

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const toggle = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {columns.map(col => {
        const items = byColumn[col.id] ?? []
        const isCollapsed = collapsed.has(col.id)
        return (
          <section
            key={col.id}
            className="bg-[#0f0b1e] border border-[rgba(139,92,246,0.18)] rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(col.id)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#1a1430] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5 text-[#6b7280]" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-[#A78BFA]" />
                )}
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: col.color, boxShadow: `0 0 6px ${col.color}` }}
                />
                <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#ede9fe]">
                  {col.label}
                </span>
                <span className="text-[11px] font-semibold text-[#9ca3af] tabular-nums">
                  ({items.length})
                </span>
              </div>
            </button>

            {!isCollapsed && (
              <div className="px-3 pb-3 space-y-1">
                {items.length === 0 ? (
                  <p className="text-[11px] text-[#6b7280] italic px-2 py-3">Aucun lead dans cette colonne</p>
                ) : (
                  items.map(lead => (
                    <CompactRow
                      key={lead.id}
                      lead={lead}
                      currentStatus={col.id}
                      columns={columns}
                      onClick={() => onLeadClick(lead.id)}
                      onStatusChange={onStatusChange}
                    />
                  ))
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

interface RowProps {
  lead: LeadCardData
  currentStatus: string
  columns: CompactColumn[]
  onClick: () => void
  onStatusChange: (id: string, newStatus: string) => Promise<void>
}

function CompactRow({ lead, currentStatus, columns, onClick, onStatusChange }: RowProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <LeadCardV3Compact data={lead} onClick={onClick} />
      </div>
      <select
        value={currentStatus}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => { void onStatusChange(lead.id, e.target.value) }}
        className="h-[26px] pl-2 pr-6 bg-[#070512] border border-[rgba(139,92,246,0.18)] rounded text-[10px] text-[#ede9fe] font-medium cursor-pointer appearance-none hover:border-[rgba(139,92,246,0.35)] focus:outline-none focus:border-[#8B5CF6] shrink-0"
      >
        {columns.map(c => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
    </div>
  )
}
