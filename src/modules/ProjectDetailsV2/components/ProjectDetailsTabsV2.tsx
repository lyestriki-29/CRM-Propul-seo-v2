import { useState } from 'react'
import { LayoutDashboard, CheckSquare, Clock, FileText, Receipt, ClipboardList, Mail } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { ProjectOverview } from './ProjectOverview'
import { ProjectChecklist } from './ProjectChecklist'
import { ProjectTimeline } from './ProjectTimeline'
import { ProjectDocuments } from './ProjectDocuments'
import { ProjectBilling } from './ProjectBilling'
import { ProjectFollowUp } from './ProjectFollowUp'
import { ProjectEmailRules } from './ProjectEmailRules'
import type { ProjectV2 } from '../../../types/project-v2'

type TabId = 'overview' | 'checklist' | 'timeline' | 'documents' | 'billing' | 'followup' | 'gmail'

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview',  label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'checklist', label: 'Checklist',        icon: CheckSquare },
  { id: 'timeline',  label: 'Journal',          icon: Clock },
  { id: 'documents', label: 'Documents',        icon: FileText },
  { id: 'billing',   label: 'Facturation',      icon: Receipt },
  { id: 'followup',  label: 'Suivi',            icon: ClipboardList },
  { id: 'gmail',     label: 'Gmail',            icon: Mail },
]

export function ProjectDetailsTabsV2({ project }: { project: ProjectV2 }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':  return <ProjectOverview project={project} />
      case 'checklist': return <ProjectChecklist project={project} />
      case 'timeline':  return <ProjectTimeline projectId={project.id} />
      case 'documents': return <ProjectDocuments projectId={project.id} />
      case 'billing':   return <ProjectBilling     key={project.id} projectId={project.id} />
      case 'followup':  return <ProjectFollowUp    key={project.id} projectId={project.id} />
      case 'gmail':     return <ProjectEmailRules  key={project.id} projectId={project.id} />
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 border-b border-border min-w-max">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}>
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  )
}
