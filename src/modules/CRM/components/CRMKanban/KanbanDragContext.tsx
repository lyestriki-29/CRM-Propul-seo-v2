import { ContactRow } from '../../../../types/supabase-types';

export function sortContacts(contacts: ContactRow[]): ContactRow[] {
  return [...contacts].sort((a, b) => {
    if (a.next_activity_date && b.next_activity_date) {
      return new Date(a.next_activity_date).getTime() - new Date(b.next_activity_date).getTime();
    }
    if (a.next_activity_date && !b.next_activity_date) return -1;
    if (!a.next_activity_date && b.next_activity_date) return 1;
    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
  });
}

export function getDateColor(activityDate: string): string {
  const today = new Date();
  const activity = new Date(activityDate);
  today.setHours(0, 0, 0, 0);
  activity.setHours(0, 0, 0, 0);
  const diffTime = activity.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "text-red-600 font-semibold";
  if (diffDays === 0) return "text-green-600 font-semibold";
  return "text-orange-600";
}

export function formatDateWithContext(date: string): string {
  const today = new Date();
  const activityDate = new Date(date);
  const diffDays = Math.ceil((activityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === -1) return "Hier";
  if (diffDays < -1) return `Il y a ${Math.abs(diffDays)} jours`;
  if (diffDays === 1) return "Demain";
  return new Date(date).toLocaleDateString('fr-FR');
}
