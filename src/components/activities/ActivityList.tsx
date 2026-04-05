import { Activity } from '@/types/activity';
import { ActivityCard } from './ActivityCard';

export interface ActivityListProps {
  activities: Activity[];
  onMarkDone?: (id: string) => void;
  onEdit?: (id: string) => void;
  onPostpone?: (id: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onMarkDone, onEdit, onPostpone }) => {
  if (!activities.length) {
    return <div className="text-muted-foreground text-sm py-4">Aucune activité prévue</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      {activities.map(activity => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onMarkDone={onMarkDone}
          onEdit={onEdit}
          onPostpone={onPostpone}
        />
      ))}
    </div>
  );
}; 