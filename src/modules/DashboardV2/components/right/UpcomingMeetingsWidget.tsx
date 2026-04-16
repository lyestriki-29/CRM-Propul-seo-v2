import { useEffect, useState } from 'react'
import { Calendar, Clock, Video, Users, AlertTriangle, RefreshCw } from 'lucide-react'
import { format, parseISO, isAfter, addDays, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { v2 } from '../../../../lib/supabase'
import { Skeleton } from '../../../../components/ui/skeleton'

interface Meeting {
  id: string
  content: string
  project_id: string | null
  metadata: {
    start?: string
    end?: string
    location?: string
    attendees?: string[]
  }
}

interface UpcomingMeetingsWidgetProps {
  onNavigateToProject: (id: string) => void
}

export function UpcomingMeetingsWidget({ onNavigateToProject }: UpcomingMeetingsWidgetProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMeetings = async () => {
    setError(null)
    setLoading(true)
    try {
      const { data, error: fetchError } = await v2
        .from('project_activities')
        .select('id, content, project_id, metadata')
        .eq('type', 'meeting')
        .order('created_at', { ascending: false })
        .limit(30)

      if (fetchError) throw fetchError

      const now = startOfDay(new Date())
      const limit = addDays(now, 7)

      const upcoming = ((data ?? []) as Meeting[])
        .filter(m => {
          if (!m.metadata?.start) return false
          const d = parseISO(m.metadata.start)
          return isAfter(d, now) && d.getTime() < limit.getTime()
        })
        .sort((a, b) =>
          parseISO(a.metadata.start!).getTime() - parseISO(b.metadata.start!).getTime()
        )
        .slice(0, 5)

      setMeetings(upcoming)
    } catch (_e) {
      setError('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMeetings() }, [])

  if (loading) return <Skeleton className="h-32 rounded-2xl" />

  return (
    <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <Calendar className="h-4 w-4 text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Prochains RDV</h3>
        <span className="ml-auto text-xs text-muted-foreground">{meetings.length} cette semaine</span>
      </div>

      {error && (
        <div className="flex items-center justify-between text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Erreur de chargement</span>
          <button onClick={fetchMeetings} className="hover:underline flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />Réessayer
          </button>
        </div>
      )}

      {!error && meetings.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">Aucun RDV cette semaine</p>
      )}

      <div className="space-y-2">
        {meetings.map(m => {
          const start = m.metadata.start ? parseISO(m.metadata.start) : null
          const end = m.metadata.end ? parseISO(m.metadata.end) : null
          const isGoogleMeet = m.metadata.location?.includes('meet.google')
          const attendeesCount = m.metadata.attendees?.length ?? 0

          return (
            <button
              key={m.id}
              onClick={() => m.project_id && onNavigateToProject(m.project_id)}
              disabled={!m.project_id}
              className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl bg-surface-1/50 border border-border/30 hover:border-border transition-colors disabled:cursor-default"
            >
              <div className="shrink-0 text-center min-w-[36px]">
                {start && (
                  <>
                    <p className="text-[10px] text-muted-foreground uppercase">{format(start, 'EEE', { locale: fr })}</p>
                    <p className="text-base font-bold text-white leading-none">{format(start, 'd')}</p>
                  </>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{m.content}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {start && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {format(start, 'HH:mm')}{end && ` – ${format(end, 'HH:mm')}`}
                    </span>
                  )}
                  {attendeesCount > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="h-2.5 w-2.5" />{attendeesCount}
                    </span>
                  )}
                  {isGoogleMeet && (
                    <span className="flex items-center gap-1 text-[10px] text-blue-400">
                      <Video className="h-2.5 w-2.5" />Meet
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
