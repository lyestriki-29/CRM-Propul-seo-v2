import { Badge } from '@/components/ui/badge'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  // Core
  prospect:       { label: 'Prospect',      className: 'bg-slate-500/20 text-slate-300 border-slate-600' },
  brief_received: { label: 'Brief reçu',    className: 'bg-blue-500/20 text-blue-300 border-blue-600' },
  quote_sent:     { label: 'Devis envoyé',  className: 'bg-indigo-500/20 text-indigo-300 border-indigo-600' },
  in_progress:    { label: 'En cours',      className: 'bg-green-500/20 text-green-300 border-green-600' },
  review:         { label: 'Recette',       className: 'bg-orange-500/20 text-orange-300 border-orange-600' },
  delivered:      { label: 'Livré',         className: 'bg-teal-500/20 text-teal-300 border-teal-600' },
  maintenance:    { label: 'Maintenance',   className: 'bg-purple-500/20 text-purple-300 border-purple-600' },
  on_hold:        { label: 'En pause',      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-600' },
  closed:         { label: 'Clôturé',       className: 'bg-gray-500/20 text-gray-400 border-gray-600' },
  // SiteWeb / ERP
  devis_envoye:     { label: 'Devis envoyé',    className: 'bg-indigo-500/20 text-indigo-300 border-indigo-600' },
  signe:            { label: 'Signé',            className: 'bg-violet-500/20 text-violet-300 border-violet-600' },
  en_production:    { label: 'En production',    className: 'bg-amber-500/20 text-amber-300 border-amber-600' },
  livre:            { label: 'Livré',            className: 'bg-teal-500/20 text-teal-300 border-teal-600' },
  perdu:            { label: 'Perdu',            className: 'bg-red-500/20 text-red-400 border-red-600' },
  // ERP spécifiques
  analyse_besoins:  { label: 'Analyse besoins',  className: 'bg-cyan-500/20 text-cyan-300 border-cyan-600' },
  en_developpement: { label: 'En développement', className: 'bg-green-500/20 text-green-300 border-green-600' },
  recette:          { label: 'Recette',          className: 'bg-orange-500/20 text-orange-300 border-orange-600' },
  // Communication
  brief_creatif:    { label: 'Brief créatif',    className: 'bg-pink-500/20 text-pink-300 border-pink-600' },
  actif:            { label: 'Actif',            className: 'bg-emerald-500/20 text-emerald-300 border-emerald-600' },
  termine:          { label: 'Terminé',          className: 'bg-gray-500/20 text-gray-400 border-gray-600' },
}

const FALLBACK_CONFIG = { label: 'Inconnu', className: 'bg-slate-500/20 text-slate-300 border-slate-600' }

interface ProjectStatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

export function ProjectStatusBadge({ status, size = 'md' }: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? FALLBACK_CONFIG
  return (
    <Badge
      variant="outline"
      className={`${config.className} border ${size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'}`}
    >
      {config.label}
    </Badge>
  )
}
