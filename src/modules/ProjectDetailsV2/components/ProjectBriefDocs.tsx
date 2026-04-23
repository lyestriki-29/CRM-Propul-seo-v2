import { useState } from 'react'
import { FileText, FolderOpen } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { ProjectBrief } from './ProjectBrief'
import { ProjectDocuments } from './ProjectDocuments'

type SubTab = 'brief' | 'documents'

export function ProjectBriefDocs({ projectId }: { projectId: string }) {
  const [tab, setTab] = useState<SubTab>('brief')

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-border flex-1">
        <TabBtn active={tab === 'brief'} onClick={() => setTab('brief')} icon={<FileText className="h-3.5 w-3.5" />}>
          Brief client
        </TabBtn>
        <TabBtn active={tab === 'documents'} onClick={() => setTab('documents')} icon={<FolderOpen className="h-3.5 w-3.5" />}>
          Documents
        </TabBtn>
      </div>

      {tab === 'brief' && <ProjectBrief projectId={projectId} />}
      {tab === 'documents' && <ProjectDocuments projectId={projectId} />}
    </div>
  )
}

function TabBtn({ active, onClick, icon, children }: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      )}
    >
      {icon}
      {children}
    </button>
  )
}
