import type { PrestaType } from '../../../types/project-v2'

const PRESTA_CONFIG: Record<PrestaType, { label: string; className: string }> = {
  web:  { label: 'Web',  className: 'bg-blue-500/20 text-blue-300 border-blue-600' },
  seo:  { label: 'SEO',  className: 'bg-green-500/20 text-green-300 border-green-600' },
  erp:  { label: 'ERP',  className: 'bg-orange-500/20 text-orange-300 border-orange-600' },
  saas: { label: 'SaaS', className: 'bg-violet-500/20 text-violet-300 border-violet-600' },
}

interface PrestaBadgeProps {
  type: PrestaType
  size?: 'sm' | 'md'
}

export function PrestaBadge({ type, size = 'sm' }: PrestaBadgeProps) {
  const config = PRESTA_CONFIG[type]
  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${config.className} ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'
      }`}
    >
      {config.label}
    </span>
  )
}

interface PrestaListProps {
  types: PrestaType[]
  size?: 'sm' | 'md'
}

export function PrestaList({ types, size = 'sm' }: PrestaListProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {types.map(t => (
        <PrestaBadge key={t} type={t} size={size} />
      ))}
    </div>
  )
}
