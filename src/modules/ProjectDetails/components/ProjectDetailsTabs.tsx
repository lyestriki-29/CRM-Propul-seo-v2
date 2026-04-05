import { useState } from 'react'
import {
  LayoutDashboard, CheckSquare, Clock, Key, FileText, FileSpreadsheet, Receipt,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { ProjectOverview } from './ProjectOverview'
import { ProjectChecklist } from './ProjectChecklist'
import { ProjectTimeline } from './ProjectTimeline'
import { ProjectAccesses } from './ProjectAccesses'
import { ProjectDocuments } from './ProjectDocuments'
import { ProjectBrief } from './ProjectBrief'
import { ProjectBilling } from './ProjectBilling'
import type { ProjectV2 } from '../../../types/project-v2'

type TabId = 'overview' | 'checklist' | 'timeline' | 'accesses' | 'documents' | 'brief' | 'billing'

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview',   label: 'Vue d\'ensemble', icon: LayoutDashboard  },
  { id: 'checklist',  label: 'Checklist',        icon: CheckSquare      },
  { id: 'timeline',   label: 'Journal',          icon: Clock            },
  { id: 'accesses',   label: 'Accès',            icon: Key              },
  { id: 'documents',  label: 'Documents',        icon: FileText         },
  { id: 'brief',      label: 'Brief',            icon: FileSpreadsheet  },
  { id: 'billing',    label: 'Facturation',      icon: Receipt          },
]

interface ProjectDetailsTabsProps {
  project: ProjectV2
}

export function ProjectDetailsTabs({ project }: ProjectDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':   return <ProjectOverview project={project} />
      case 'checklist':  return <ProjectChecklist projectId={project.id} />
      case 'timeline':   return <ProjectTimeline projectId={project.id} />
      case 'accesses':   return <ProjectAccesses />
      case 'documents':  return <ProjectDocuments />
      case 'brief':      return <ProjectBrief />
      case 'billing':    return <ProjectBilling />
    }
  }

  return (
    <div className="space-y-4">
      {/* Onglets */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 border-b border-border min-w-max pb-0">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenu */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  )
}
