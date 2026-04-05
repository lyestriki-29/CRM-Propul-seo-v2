// src/modules/ProjectDetailsV2/components/ProjectV2RightSidebar.tsx
import { User, Mail, Phone, MapPin, Briefcase, Copy, ExternalLink } from 'lucide-react'
import { useProjectsV2Context } from '../../ProjectsManagerV2/context/ProjectsV2Context'
import { NextActionCard } from './NextActionCard'
import { AiSummaryCard } from './AiSummaryCard'
import { SharePortalButton } from './SharePortalButton'
import { useProjectClient } from '../hooks/useProjectClient'
import type { ProjectV2 } from '../../../types/project-v2'

interface Props {
  project: ProjectV2
  onRefresh: () => void
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

function ContactCard({ project }: { project: ProjectV2 }) {
  const { client, loading } = useProjectClient(project.client_id)

  const displayName = client?.name ?? project.client_name

  return (
    <div className="border-b border-[rgba(139,92,246,0.15)] py-4 px-4">
      <p className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-3">Contact client</p>

      {loading && (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 w-32 bg-[rgba(139,92,246,0.1)] rounded" />
          <div className="h-3 w-48 bg-[rgba(139,92,246,0.1)] rounded" />
        </div>
      )}

      {!loading && !displayName && (
        <p className="text-xs text-[#9ca3af] italic">Aucun client associé</p>
      )}

      {!loading && displayName && (
        <div className="space-y-3">
          {/* Avatar + nom */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.2)] flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#ede9fe] truncate">{displayName}</p>
              {client?.sector && (
                <p className="text-[10px] text-[#9ca3af] truncate">{client.sector}</p>
              )}
            </div>
          </div>

          {/* Coordonnées */}
          <div className="space-y-1.5">
            {client?.phone && (
              <div className="flex items-center gap-2 group">
                <Phone className="h-3 w-3 text-[#9ca3af] shrink-0" />
                <a
                  href={`tel:${client.phone}`}
                  className="text-xs text-[#ede9fe] hover:text-[#A78BFA] transition-colors truncate flex-1"
                >
                  {client.phone}
                </a>
                <button
                  onClick={() => copyToClipboard(client.phone!)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copier"
                >
                  <Copy className="h-3 w-3 text-[#9ca3af] hover:text-[#ede9fe]" />
                </button>
              </div>
            )}

            {client?.email && (
              <div className="flex items-center gap-2 group">
                <Mail className="h-3 w-3 text-[#9ca3af] shrink-0" />
                <a
                  href={`mailto:${client.email}`}
                  className="text-xs text-[#ede9fe] hover:text-[#A78BFA] transition-colors truncate flex-1"
                >
                  {client.email}
                </a>
                <button
                  onClick={() => copyToClipboard(client.email!)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copier"
                >
                  <Copy className="h-3 w-3 text-[#9ca3af] hover:text-[#ede9fe]" />
                </button>
              </div>
            )}

            {client?.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 text-[#9ca3af] shrink-0 mt-0.5" />
                <p className="text-xs text-[#9ca3af] leading-tight">{client.address}</p>
              </div>
            )}

            {!client?.phone && !client?.email && (
              <p className="text-[10px] text-[#9ca3af] italic">Coordonnées non renseignées</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function ProjectV2RightSidebar({ project, onRefresh }: Props) {
  const { updateProject } = useProjectsV2Context()

  const handleNextActionUpdate = async (updates: {
    next_action_label: string | null
    next_action_due: string | null
  }) => {
    await updateProject(project.id, updates)
    onRefresh()
  }

  return (
    <div className="flex flex-col">
      {/* Fiche contact client */}
      <ContactCard project={project} />

      {/* Prochaine action */}
      <div className="border-b border-[rgba(139,92,246,0.15)] p-4">
        <NextActionCard project={project} onUpdate={handleNextActionUpdate} />
      </div>

      {/* Résumé IA */}
      <div className="border-b border-[rgba(139,92,246,0.15)] p-4">
        <AiSummaryCard project={project} onRefresh={onRefresh} />
      </div>

      {/* Portail client */}
      <div className="p-4">
        <SharePortalButton project={project} onRefresh={onRefresh} />
      </div>
    </div>
  )
}
