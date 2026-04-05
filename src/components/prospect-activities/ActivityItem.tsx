import { ProspectActivity, ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_COLORS, ACTIVITY_PRIORITY_COLORS, ACTIVITY_STATUS_COLORS } from '@/types/prospect-activity';
import { formatFullDate, isActivityOverdue } from '../../utils/frenchDateUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTextWithLineBreaks } from '@/utils/textFormatting';
import { 
  Phone, 
  Calendar, 
  Mail, 
  UserCheck, 
  Monitor, 
  FileText, 
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const activityIcons = {
  call: Phone,
  meeting: Calendar,
  email: Mail,
  follow_up: UserCheck,
  demo: Monitor,
  proposal: FileText,
  other: MoreHorizontal,
};

interface ActivityItemProps {
  activity: ProspectActivity;
  onEdit?: (activity: ProspectActivity) => void;
  onDelete?: (activityId: string) => void;
  onMarkCompleted?: (activityId: string) => void;
  onMarkCancelled?: (activityId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onEdit,
  onDelete,
  onMarkCompleted,
  onMarkCancelled,
  showActions = true,
  compact = false
}) => {
  const Icon = activityIcons[activity.activity_type];
  
  const formatDate = (dateString: string) => {
    return formatFullDate(dateString);
  };

  const isOverdue = () => {
    return isActivityOverdue(activity.activity_date, activity.status);
  };

  const getStatusBadge = () => {
    const statusClass = ACTIVITY_STATUS_COLORS[activity.status];
    const statusLabel = activity.status === 'pending' ? 'En attente' : 
                       activity.status === 'completed' ? 'Terminé' : 'Annulé';
    
    return (
      <Badge className={`${statusClass} text-xs`}>
        {statusLabel}
      </Badge>
    );
  };

  const getPriorityBadge = () => {
    const priorityClass = ACTIVITY_PRIORITY_COLORS[activity.priority];
    const priorityLabel = activity.priority === 'low' ? 'Faible' : 
                         activity.priority === 'medium' ? 'Moyenne' : 'Élevée';
    
    return (
      <Badge variant="outline" className={`${priorityClass} text-xs`}>
        {priorityLabel}
      </Badge>
    );
  };

  const getTypeBadge = () => {
    const typeClass = ACTIVITY_TYPE_COLORS[activity.activity_type];
    const typeLabel = ACTIVITY_TYPE_LABELS[activity.activity_type];
    
    return (
      <Badge className={`${typeClass} text-xs`}>
        <Icon className="h-3 w-3 mr-1" />
        {typeLabel}
      </Badge>
    );
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 border-l-4 border-primary bg-surface-2 rounded-r">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{activity.title}</span>
          {getStatusBadge()}
        </div>
        <span className="text-xs text-muted-foreground">{formatDate(activity.activity_date)}</span>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 bg-surface-2 hover:shadow-md transition-shadow ${
      isOverdue() ? 'border-red-700 bg-red-900/20' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium text-foreground">{activity.title}</h4>
            {isOverdue() && (
              <Badge variant="destructive" className="text-xs">
                En retard
              </Badge>
            )}
          </div>
          
          {activity.description && (
            <p className="text-sm text-muted-foreground mb-3">{formatTextWithLineBreaks(activity.description)}</p>
          )}
          
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{formatDate(activity.activity_date)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {getTypeBadge()}
            {getPriorityBadge()}
            {getStatusBadge()}
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-1">
            {activity.status === 'pending' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkCompleted?.(activity.id)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                  title="Marquer comme terminé"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkCancelled?.(activity.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  title="Annuler"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(activity)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(activity.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}; 