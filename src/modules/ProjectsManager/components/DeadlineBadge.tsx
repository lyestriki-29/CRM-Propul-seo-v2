import { differenceInDays, parseISO } from 'date-fns'

interface DeadlineBadgeProps {
  endDate: string | null
  className?: string
}

export function DeadlineBadge({ endDate, className = '' }: DeadlineBadgeProps) {
  if (!endDate) return null

  const days = differenceInDays(parseISO(endDate), new Date())

  let label: string
  let colorClass: string

  if (days < 0) {
    label = `En retard (${Math.abs(days)}j)`
    colorClass = 'bg-red-500/20 text-red-300 border-red-600'
  } else if (days <= 7) {
    label = `J-${days}`
    colorClass = 'bg-orange-500/20 text-orange-300 border-orange-600'
  } else {
    label = `J-${days}`
    colorClass = 'bg-green-500/20 text-green-300 border-green-600'
  }

  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${colorClass} ${className}`}
    >
      {label}
    </span>
  )
}
