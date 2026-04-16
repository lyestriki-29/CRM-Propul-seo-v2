import type { CommTaskPriority, CommTaskStatus } from '../../../../types/project-v2'

export const PRIORITY_CONFIG: Record<CommTaskPriority, {
  label: string
  dot: string
  border: string
  bg: string
  badge: string
  badgeBg: string
}> = {
  critique: { label: 'Critique', dot: '#f87171', border: '#f87171', bg: '#1f1515', badge: 'text-red-400',   badgeBg: 'bg-red-950/60 border border-red-900' },
  haute:    { label: 'Haute',    dot: '#fb923c', border: '#fb923c', bg: '#1f1a10', badge: 'text-orange-400', badgeBg: 'bg-orange-950/60 border border-orange-900' },
  moyenne:  { label: 'Moyenne',  dot: '#facc15', border: '#facc15', bg: '#1f1f10', badge: 'text-yellow-400', badgeBg: 'bg-yellow-950/60 border border-yellow-900' },
  faible:   { label: 'Faible',   dot: '#4ade80', border: '#4ade80', bg: '#101f15', badge: 'text-green-400',  badgeBg: 'bg-green-950/60 border border-green-900' },
  urgent:   { label: 'Critique', dot: '#f87171', border: '#f87171', bg: '#1f1515', badge: 'text-red-400',   badgeBg: 'bg-red-950/60 border border-red-900' },
  high:     { label: 'Haute',    dot: '#fb923c', border: '#fb923c', bg: '#1f1a10', badge: 'text-orange-400', badgeBg: 'bg-orange-950/60 border border-orange-900' },
  medium:   { label: 'Moyenne',  dot: '#facc15', border: '#facc15', bg: '#1f1f10', badge: 'text-yellow-400', badgeBg: 'bg-yellow-950/60 border border-yellow-900' },
  low:      { label: 'Faible',   dot: '#4ade80', border: '#4ade80', bg: '#101f15', badge: 'text-green-400',  badgeBg: 'bg-green-950/60 border border-green-900' },
}

export const STATUS_CONFIG: Record<CommTaskStatus, {
  label: string
  badge: string
  badgeBg: string
  dot: string
}> = {
  todo:        { label: 'À faire',  badge: 'text-slate-400', badgeBg: 'bg-slate-900/60 border border-slate-700', dot: '#64748b' },
  in_progress: { label: 'En cours', badge: 'text-violet-400', badgeBg: 'bg-violet-950/60 border border-violet-800', dot: '#a78bfa' },
  review:      { label: 'Revue',    badge: 'text-amber-400',  badgeBg: 'bg-amber-950/60 border border-amber-800', dot: '#fbbf24' },
  done:        { label: 'Terminé',  badge: 'text-green-400',  badgeBg: 'bg-green-950/60 border border-green-800', dot: '#4ade80' },
}

export function projectAbbr(name: string): string {
  return name.slice(0, 3).toUpperCase()
}
