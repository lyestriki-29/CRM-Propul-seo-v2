import { useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { StatusComm, ProjectV2 } from '../../../types/project-v2'

type CommProject = ProjectV2 & { comm_status: StatusComm }

interface CommCalendarViewProps {
  projects: CommProject[]
  onProjectClick: (project: CommProject) => void
}

const STATUS_COLORS: Record<StatusComm, string> = {
  prospect:      '#64748b',
  brief_creatif: '#0ea5e9',
  devis_envoye:  '#3b82f6',
  signe:         '#8b5cf6',
  en_production: '#f59e0b',
  actif:         '#10b981',
  termine:       '#22c55e',
  perdu:         '#ef4444',
}

const STATUS_LABELS: Record<StatusComm, string> = {
  prospect:      'Prospect',
  brief_creatif: 'Brief créatif',
  devis_envoye:  'Devis envoyé',
  signe:         'Signé',
  en_production: 'En production',
  actif:         'Actif',
  termine:       'Terminé',
  perdu:         'Perdu',
}

export function CommCalendarView({ projects, onProjectClick }: CommCalendarViewProps) {
  const events = useMemo(() => {
    return projects
      .filter(p => p.start_date)
      .map(p => ({
        id: p.id,
        title: p.name,
        start: p.start_date,
        end: p.end_date ?? undefined,
        backgroundColor: STATUS_COLORS[p.comm_status] + '22',
        borderColor: STATUS_COLORS[p.comm_status],
        textColor: STATUS_COLORS[p.comm_status],
        extendedProps: { project: p },
      }))
  }, [projects])

  return (
    <div className="mt-6 px-4 pb-6">
      <h2 className="text-sm font-semibold text-foreground mb-3">Calendrier des projets</h2>

      {/* Légende */}
      <div className="flex flex-wrap gap-3 mb-4">
        {(Object.keys(STATUS_COLORS) as StatusComm[]).map(status => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: STATUS_COLORS[status] }}
            />
            <span className="text-[10px] text-muted-foreground">{STATUS_LABELS[status]}</span>
          </div>
        ))}
      </div>

      <div className="bg-surface-2 rounded-xl border border-border p-3">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="fr"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek',
          }}
          events={events}
          eventClick={(info) => {
            info.jsEvent.stopPropagation()
            onProjectClick(info.event.extendedProps.project as CommProject)
          }}
          height="auto"
          dayMaxEvents={3}
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
          }}
          hiddenDays={[0]}
          moreLinkContent={(args) => (
            <span className="text-xs font-semibold text-primary">+ {args.num} autres</span>
          )}
        />
      </div>
    </div>
  )
}
