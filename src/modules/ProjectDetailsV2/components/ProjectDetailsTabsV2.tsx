import { useState } from 'react'
import { BarChart3, Settings, Wallet, MessageCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { SyntheseTab } from './SyntheseTab'
import { ProjectChecklist } from './ProjectChecklist'
import { ProjectBilling } from './ProjectBilling'
import { ProjectFollowUp } from './ProjectFollowUp'
import type { ProjectV2 } from '../../../types/project-v2'

type TabId = 'synthese' | 'production' | 'finances' | 'echanges'

const TABS: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: 'synthese',   label: 'Synthèse',   icon: BarChart3 },
  { id: 'production', label: 'Production',  icon: Settings },
  { id: 'finances',   label: 'Finances',    icon: Wallet },
  { id: 'echanges',   label: 'Échanges',    icon: MessageCircle },
]

export function ProjectDetailsTabsV2({ project }: { project: ProjectV2 }) {
  const [activeTab, setActiveTab] = useState<TabId>('synthese')

  const renderContent = () => {
    switch (activeTab) {
      case 'synthese':   return <SyntheseTab project={project} />
      case 'production': return <ProjectChecklist project={project} />
      case 'finances':   return <ProjectBilling     key={project.id} projectId={project.id} />
      case 'echanges':   return <ProjectFollowUp    key={project.id} projectId={project.id} />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-0.5 p-1.5 border-b border-[rgba(139,92,246,0.12)] bg-[#0a0a12] rounded-t-lg">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-[#7c3aed] text-white shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[rgba(139,92,246,0.08)]'
              )}>
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  )
}
