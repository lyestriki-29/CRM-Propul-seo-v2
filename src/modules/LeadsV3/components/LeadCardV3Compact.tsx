import type { LeadCardData } from './LeadCardV3'

interface Props {
  data: LeadCardData
  onClick?: () => void
}

/**
 * Ligne compacte (variante B) : une seule ligne dense ~30px.
 * Filet vertical coloré par statut + entreprise + contact + montant.
 */
export function LeadCardV3Compact({ data, onClick }: Props) {
  const title = data.company || data.contact || 'Lead sans nom'

  return (
    <article
      onClick={onClick}
      className="relative flex items-center gap-2 pl-3 pr-2 py-1.5 bg-[#070512] border border-[rgba(139,92,246,0.18)] rounded-[5px] cursor-pointer transition-all duration-150 hover:border-[rgba(139,92,246,0.35)] hover:bg-[#1a1430] overflow-hidden min-h-[30px]"
    >
      {/* Filet vertical coloré */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: data.statusColor }}
      />

      {/* Nom entreprise */}
      <span className="text-[11px] font-semibold text-[#ede9fe] flex-1 min-w-0 truncate">
        {title}
      </span>

      {/* Contact */}
      {data.contact && data.company && (
        <span className="text-[10px] text-[#9ca3af] hidden md:inline truncate max-w-[140px]">
          {data.contact}
        </span>
      )}

      {/* Assignée */}
      {data.assignee && (
        <span className="text-[10px] text-[#6b7280] hidden lg:inline truncate max-w-[120px]">
          {data.assignee}
        </span>
      )}

      {/* Montant */}
      {data.amount !== null && data.amount > 0 && (
        <span className="text-[10px] font-semibold text-[#10b981] tabular-nums shrink-0">
          {data.amount.toLocaleString('fr-FR')} €
        </span>
      )}
    </article>
  )
}
