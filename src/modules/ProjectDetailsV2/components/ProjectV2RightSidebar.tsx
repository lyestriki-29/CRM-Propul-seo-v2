// src/modules/ProjectDetailsV2/components/ProjectV2RightSidebar.tsx
import { useProjectsV2Context } from '../../ProjectsManagerV2/context/ProjectsV2Context'
import { NextActionCard } from './NextActionCard'
import { AiSummaryCard } from './AiSummaryCard'
import { SharePortalButton } from './SharePortalButton'
import type { ProjectV2 } from '../../../types/project-v2'

interface Props {
  project: ProjectV2
  onRefresh: () => void
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
    <div className="flex flex-col gap-0">
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
