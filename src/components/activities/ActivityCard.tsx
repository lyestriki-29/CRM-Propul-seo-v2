import { Activity } from '@/types/activity';
import { formatParis } from '@/utils/timezone';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatTextWithLineBreaks } from '../../utils/textFormatting';

const typeColors = {
  projet: 'bg-blue-100 text-blue-800',
  prospect: 'bg-green-100 text-green-800',
};

const priorityColors = {
  haute: 'border-red-500',
  moyenne: 'border-yellow-500',
  basse: 'border-muted-foreground',
};

export interface ActivityCardProps {
  activity: Activity;
  onMarkDone?: (id: string) => void;
  onEdit?: (id: string) => void;
  onPostpone?: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onMarkDone, onEdit, onPostpone }) => {
  return (
    <div
      className={`rounded-lg p-4 mb-2 border shadow-sm flex flex-col gap-2 ${priorityColors[activity.priority]} ${typeColors[activity.type]}`}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold text-base">{activity.title}</div>
        <Badge className={typeColors[activity.type]}>{activity.type === 'projet' ? 'Projet' : 'Prospect'}</Badge>
      </div>
      <div className="text-sm text-muted-foreground">{formatTextWithLineBreaks(activity.description)}</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{formatParis(activity.date_utc, 'dd/MM/yyyy HH:mm')}</span>
        <Badge variant="outline">{activity.status.replace('_', ' ')}</Badge>
        <Badge variant="outline">Priorité : {activity.priority}</Badge>
      </div>
      <div className="flex gap-2 mt-2">
        {onMarkDone && activity.status !== 'termine' && (
          <Button size="sm" variant="success" onClick={() => onMarkDone(activity.id)}>
            Marquer terminé
          </Button>
        )}
        {onPostpone && (
          <Button size="sm" variant="outline" onClick={() => onPostpone(activity.id)}>
            Reporter
          </Button>
        )}
        {onEdit && (
          <Button size="sm" variant="outline" onClick={() => onEdit(activity.id)}>
            Modifier
          </Button>
        )}
      </div>
    </div>
  );
}; 