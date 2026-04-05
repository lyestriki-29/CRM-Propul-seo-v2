import { formatDistanceToNow, isToday, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDateRelative(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Aujourd'hui";
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } catch {
    return null;
  }
}

export function getDateColor(dateStr: string | null): string {
  if (!dateStr) return 'text-muted-foreground';
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'text-green-600';
    if (isPast(date)) return 'text-red-600';
    return 'text-orange-600';
  } catch {
    return 'text-muted-foreground';
  }
}
