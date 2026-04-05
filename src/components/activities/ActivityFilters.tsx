import { ActivityType } from '@/types/activity';

export interface ActivityFiltersProps {
  type?: ActivityType | 'all';
  status?: 'a_faire' | 'en_cours' | 'termine' | 'all';
  priority?: 'haute' | 'moyenne' | 'basse' | 'all';
  onTypeChange?: (type: ActivityType | 'all') => void;
  onStatusChange?: (status: 'a_faire' | 'en_cours' | 'termine' | 'all') => void;
  onPriorityChange?: (priority: 'haute' | 'moyenne' | 'basse' | 'all') => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  type = 'all',
  status = 'all',
  priority = 'all',
  onTypeChange,
  onStatusChange,
  onPriorityChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <select value={type} onChange={e => onTypeChange?.(e.target.value as ActivityType | 'all')} className="border rounded px-2 py-1">
        <option value="all">Tous types</option>
        <option value="projet">Projet</option>
        <option value="prospect">Prospect</option>
      </select>
      <select value={status} onChange={e => onStatusChange?.(e.target.value as any)} className="border rounded px-2 py-1">
        <option value="all">Tous statuts</option>
        <option value="a_faire">À faire</option>
        <option value="en_cours">En cours</option>
        <option value="termine">Terminé</option>
      </select>
      <select value={priority} onChange={e => onPriorityChange?.(e.target.value as any)} className="border rounded px-2 py-1">
        <option value="all">Toutes priorités</option>
        <option value="haute">Haute</option>
        <option value="moyenne">Moyenne</option>
        <option value="basse">Basse</option>
      </select>
    </div>
  );
}; 