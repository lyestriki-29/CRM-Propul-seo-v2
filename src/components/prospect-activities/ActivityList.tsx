
import React from 'react';
import { formatFullDate, formatRelativeDate, isActivityOverdue } from '../../utils/frenchDateUtils';

// Types d'activités locaux
type ActivityType = 'call' | 'meeting' | 'email' | 'follow_up' | 'demo' | 'proposal' | 'note' | 'reminder' | 'other';
type ActivityPriority = 'low' | 'medium' | 'high';
type ActivityStatus = 'pending' | 'completed' | 'cancelled';

interface ProspectActivity {
  id: string;
  prospect_id: string;
  title: string;
  description?: string;
  activity_date: string;
  activity_type: ActivityType;
  priority: ActivityPriority;
  status: ActivityStatus;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Labels français pour les types d'activités
const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: '📞 Appel téléphonique',
  meeting: '📅 Rendez-vous',
  email: '📧 Email de suivi',
  follow_up: '🔄 Relance',
  demo: '💻 Démonstration',
  proposal: '📋 Proposition',
  note: '📝 Note/Mémo',
  reminder: '⏰ Rappel',
  other: '📌 Autre'
};

// Labels français pour les priorités
const ACTIVITY_PRIORITY_LABELS: Record<ActivityPriority, string> = {
  high: '🔴 Haute',
  medium: '🟡 Moyenne',
  low: '🟢 Basse'
};

// Labels français pour les statuts
const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  pending: '⏳ Programmé',
  completed: '✅ Terminé',
  cancelled: '❌ Annulé'
};

// Couleurs pour les types d'activités
const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  call: 'bg-blue-900/40 text-blue-300',
  meeting: 'bg-green-900/40 text-green-300',
  email: 'bg-purple-900/40 text-purple-300',
  follow_up: 'bg-orange-900/40 text-orange-300',
  demo: 'bg-indigo-900/40 text-indigo-300',
  proposal: 'bg-yellow-900/40 text-yellow-300',
  note: 'bg-surface-3 text-muted-foreground',
  reminder: 'bg-red-900/40 text-red-300',
  other: 'bg-surface-3 text-muted-foreground'
};

// Couleurs pour les priorités
const ACTIVITY_PRIORITY_COLORS: Record<ActivityPriority, string> = {
  high: 'bg-red-900/40 text-red-300',
  medium: 'bg-yellow-900/40 text-yellow-300',
  low: 'bg-green-900/40 text-green-300'
};

// Couleurs pour les statuts
const ACTIVITY_STATUS_COLORS: Record<ActivityStatus, string> = {
  pending: 'bg-blue-900/40 text-blue-300',
  completed: 'bg-green-900/40 text-green-300',
  cancelled: 'bg-surface-3 text-muted-foreground'
};

interface ActivityListProps {
  activities: ProspectActivity[];
  onEdit?: (activity: ProspectActivity) => void;
  onDelete?: (activityId: string) => void;
  onMarkCompleted?: (activityId: string) => void;
  onMarkCancelled?: (activityId: string) => void;
  loading?: boolean;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onEdit,
  onDelete,
  onMarkCompleted,
  onMarkCancelled,
  loading = false
}) => {
  // Utiliser les fonctions centralisées pour le formatage des dates

  const sortedActivities = [...activities].sort((a, b) => {
    // Trier par date (plus récent en premier)
    return new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime();
  });

  const upcomingActivities = sortedActivities.filter(activity =>
    activity.status === 'pending' && new Date(activity.activity_date) >= new Date()
  );

  const pastActivities = sortedActivities.filter(activity =>
    activity.status !== 'pending' || new Date(activity.activity_date) < new Date()
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Chargement des activités...</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Aucune activité</h3>
        <p className="text-muted-foreground">Commencez par créer votre première activité pour ce prospect.</p>
      </div>
    );
  }

  const ActivityItem = ({ activity }: { activity: ProspectActivity }) => {
    const isOverdue = isActivityOverdue(activity.activity_date, activity.status);

    return (
      <div className={`border rounded-lg p-4 transition-colors duration-200 ${
        isOverdue
          ? 'border-red-700 bg-red-900/20'
          : 'border-border bg-surface-2'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${ACTIVITY_TYPE_COLORS[activity.activity_type]}`}>
                {ACTIVITY_TYPE_LABELS[activity.activity_type]}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${ACTIVITY_PRIORITY_COLORS[activity.priority]}`}>
                {ACTIVITY_PRIORITY_LABELS[activity.priority]}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${ACTIVITY_STATUS_COLORS[activity.status]}`}>
                {ACTIVITY_STATUS_LABELS[activity.status]}
              </span>
            </div>

            <h4 className="font-medium text-foreground mb-1">{activity.title}</h4>

            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">{formatRelativeDate(activity.activity_date)}</span>
              {isOverdue && (
                <span className="ml-2 text-red-400 font-medium">• En retard</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {formatFullDate(activity.activity_date)}
            </p>

            {activity.description && (
              <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">{activity.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            {activity.status === 'pending' && (
              <>
                {onMarkCompleted && (
                  <button
                    onClick={() => onMarkCompleted(activity.id)}
                    className="text-green-400 hover:text-green-300 text-sm font-medium p-1 rounded hover:bg-green-900/30 transition-colors duration-200"
                    title="Marquer comme terminé"
                  >
                    ✓
                  </button>
                )}
                {onMarkCancelled && (
                  <button
                    onClick={() => onMarkCancelled(activity.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium p-1 rounded hover:bg-red-900/30 transition-colors duration-200"
                    title="Annuler"
                  >
                    ✗
                  </button>
                )}
              </>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(activity)}
                className="text-primary hover:text-primary/80 text-sm font-medium p-1 rounded hover:bg-primary/10 transition-colors duration-200"
                title="Modifier"
              >
                ✏️
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(activity.id)}
                className="text-red-400 hover:text-red-300 text-sm font-medium p-1 rounded hover:bg-red-900/30 transition-colors duration-200"
                title="Supprimer"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Activités à venir */}
      {upcomingActivities.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3 flex items-center">
            <span className="mr-2">📅</span>
            Activités à venir ({upcomingActivities.length})
          </h3>
          <div className="space-y-3">
            {upcomingActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}

      {/* Activités passées */}
      {pastActivities.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3 flex items-center">
            <span className="mr-2">📋</span>
            Historique ({pastActivities.length})
          </h3>
          <div className="space-y-3">
            {pastActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
