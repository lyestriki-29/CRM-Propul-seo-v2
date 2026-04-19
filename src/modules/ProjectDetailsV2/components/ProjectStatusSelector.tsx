import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useProjectsV2Context } from '../../ProjectsManagerV2/context/ProjectsV2Context'
import type { ProjectV2, StatusSiteWeb, StatusERP, StatusComm, ProjectStatusV2 } from '../../../types/project-v2'

// Config statuts réutilisée depuis ProjectStatusBadge
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  prospect:       { label: 'Prospect',           className: 'bg-slate-500/20 text-slate-300 border-slate-600' },
  brief_received: { label: 'Brief reçu',         className: 'bg-blue-500/20 text-blue-300 border-blue-600' },
  quote_sent:     { label: 'Devis envoyé',       className: 'bg-indigo-500/20 text-indigo-300 border-indigo-600' },
  in_progress:    { label: 'En cours',           className: 'bg-green-500/20 text-green-300 border-green-600' },
  review:         { label: 'Recette',            className: 'bg-orange-500/20 text-orange-300 border-orange-600' },
  delivered:      { label: 'Livré',              className: 'bg-teal-500/20 text-teal-300 border-teal-600' },
  maintenance:    { label: 'Maintenance',        className: 'bg-purple-500/20 text-purple-300 border-purple-600' },
  on_hold:        { label: 'En pause',           className: 'bg-yellow-500/20 text-yellow-300 border-yellow-600' },
  closed:         { label: 'Clôturé',            className: 'bg-gray-500/20 text-gray-400 border-gray-600' },
  devis_envoye:     { label: 'Devis envoyé',     className: 'bg-indigo-500/20 text-indigo-300 border-indigo-600' },
  signe:            { label: 'Signé',             className: 'bg-violet-500/20 text-violet-300 border-violet-600' },
  en_production:    { label: 'En production',     className: 'bg-amber-500/20 text-amber-300 border-amber-600' },
  livre:            { label: 'Livré',             className: 'bg-teal-500/20 text-teal-300 border-teal-600' },
  perdu:            { label: 'Perdu',             className: 'bg-red-500/20 text-red-400 border-red-600' },
  analyse_besoins:  { label: 'Analyse besoins',   className: 'bg-cyan-500/20 text-cyan-300 border-cyan-600' },
  en_developpement: { label: 'En développement',  className: 'bg-green-500/20 text-green-300 border-green-600' },
  recette:          { label: 'Recette',           className: 'bg-orange-500/20 text-orange-300 border-orange-600' },
  brief_creatif:    { label: 'Brief créatif',     className: 'bg-pink-500/20 text-pink-300 border-pink-600' },
  actif:            { label: 'Actif',             className: 'bg-emerald-500/20 text-emerald-300 border-emerald-600' },
  termine:          { label: 'Terminé',           className: 'bg-gray-500/20 text-gray-400 border-gray-600' },
}

const SITEWEB_STATUSES: StatusSiteWeb[] = ['prospect', 'devis_envoye', 'signe', 'en_production', 'livre', 'perdu']
const ERP_STATUSES: StatusERP[] = ['prospect', 'analyse_besoins', 'devis_envoye', 'signe', 'en_developpement', 'recette', 'livre', 'perdu']
const COMM_STATUSES: StatusComm[] = ['prospect', 'brief_creatif', 'devis_envoye', 'signe', 'en_production', 'actif', 'termine', 'perdu']
const GENERAL_STATUSES: ProjectStatusV2[] = ['prospect', 'brief_received', 'quote_sent', 'in_progress', 'review', 'delivered', 'maintenance', 'on_hold', 'closed']

interface ModuleConfig {
  dbField: string
  statuses: string[]
  currentStatus: string
}

function getModuleConfig(project: ProjectV2): ModuleConfig {
  const mainType = project.presta_type?.[0]

  if (mainType === 'site_web' || mainType === 'web') {
    return {
      dbField: 'status',
      statuses: SITEWEB_STATUSES,
      currentStatus: project.sw_status ?? project.status ?? 'prospect',
    }
  }
  if (mainType === 'erp' || mainType === 'erp_v2') {
    return {
      dbField: 'status',
      statuses: ERP_STATUSES,
      currentStatus: project.erp_status ?? project.status ?? 'prospect',
    }
  }
  if (mainType === 'communication') {
    return {
      dbField: 'comm_status',
      statuses: COMM_STATUSES,
      currentStatus: project.comm_status ?? project.status ?? 'prospect',
    }
  }

  return {
    dbField: 'status',
    statuses: GENERAL_STATUSES,
    currentStatus: project.status ?? 'prospect',
  }
}

interface Props {
  project: ProjectV2
  onStatusChanged?: () => void
}

export function ProjectStatusSelector({ project, onStatusChanged }: Props) {
  const { updateProject } = useProjectsV2Context()
  const config = getModuleConfig(project)
  const current = STATUS_CONFIG[config.currentStatus] ?? { label: config.currentStatus, className: 'bg-slate-500/20 text-slate-300 border-slate-600' }

  const handleChange = async (newStatus: string) => {
    if (newStatus === config.currentStatus) return
    await updateProject(project.id, { [config.dbField]: newStatus })
    toast.success(`Phase mise à jour : ${STATUS_CONFIG[newStatus]?.label ?? newStatus}`)
    onStatusChanged?.()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 group cursor-pointer">
          <Badge
            variant="outline"
            className={`${current.className} border text-xs px-2 py-0.5 transition-all group-hover:ring-1 group-hover:ring-[rgba(139,92,246,0.3)]`}
          >
            {current.label}
          </Badge>
          <ChevronDown className="h-3 w-3 text-[#9ca3af] group-hover:text-[#ede9fe] transition-colors" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-52 bg-[#0f0f1a] border-[rgba(139,92,246,0.2)]"
      >
        {config.statuses.map(status => {
          const cfg = STATUS_CONFIG[status] ?? { label: status, className: '' }
          const isActive = status === config.currentStatus
          return (
            <DropdownMenuItem
              key={status}
              onClick={() => handleChange(status)}
              className={`flex items-center gap-2 cursor-pointer ${isActive ? 'bg-[rgba(139,92,246,0.1)]' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full ${cfg.className.split(' ')[0].replace('/20', '')}`} />
              <span className={`text-xs ${isActive ? 'text-[#ede9fe] font-semibold' : 'text-[#9ca3af]'}`}>
                {cfg.label}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
