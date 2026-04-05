import { useState } from 'react';
import { ActivityList } from './ActivityList';
import { ActivityForm } from './ActivityForm';

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

interface ProspectActivitiesSectionProps {
  prospectId: string;
  prospectName: string;
  prospectType: 'lead' | 'client';
  users?: Array<{ id: string; name: string }>;
  compact?: boolean;
}

export const ProspectActivitiesSection: React.FC<ProspectActivitiesSectionProps> = ({
  prospectId,
  prospectName,
  prospectType,
  users = [],
  compact = false
}) => {
  const [activities, setActivities] = useState<ProspectActivity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ProspectActivity | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simuler des données d'activités pour la démonstration
  const demoActivities: ProspectActivity[] = [
    {
      id: '1',
      prospect_id: prospectId,
      title: 'Premier contact téléphonique',
      description: 'Appel de découverte pour comprendre les besoins du prospect',
      activity_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      activity_type: 'call',
      priority: 'high',
      status: 'pending',
      assigned_to: 'user-1',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      prospect_id: prospectId,
      title: 'Rendez-vous de présentation',
      description: 'Présentation détaillée de nos solutions',
      activity_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      activity_type: 'meeting',
      priority: 'high',
      status: 'pending',
      assigned_to: 'user-1',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      prospect_id: prospectId,
      title: 'Suivi après premier contact',
      description: 'Email de suivi avec documentation',
      activity_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      activity_type: 'email',
      priority: 'medium',
      status: 'completed',
      assigned_to: 'user-1',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Utiliser les données de démonstration
  const currentActivities = activities.length > 0 ? activities : demoActivities;

  const handleCreateActivity = async (data: Omit<ProspectActivity, 'id' | 'prospect_id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);

      // Simuler la création d'une activité
      const newActivity: ProspectActivity = {
        id: Date.now().toString(),
        prospect_id: prospectId,
        ...data,
        created_by: 'current-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setActivities(prev => [newActivity, ...prev]);
      setIsModalOpen(false);

      // Simuler un message de succès
      console.log('✅ Activité créée avec succès:', newActivity);

    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      setError('Impossible de créer l\'activité. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActivity = async (data: Partial<ProspectActivity>) => {
    if (!editingActivity) return;

    try {
      setLoading(true);
      setError(null);

      // Simuler la mise à jour d'une activité
      const updatedActivity: ProspectActivity = {
        ...editingActivity,
        ...data,
        updated_at: new Date().toISOString(),
      };

      setActivities(prev => prev.map(activity =>
        activity.id === editingActivity.id ? updatedActivity : activity
      ));

      setIsModalOpen(false);
      setEditingActivity(undefined);

      console.log('✅ Activité modifiée avec succès:', updatedActivity);

    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      setError('Impossible de modifier l\'activité. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;

    try {
      setLoading(true);
      setError(null);

      // Simuler la suppression
      setActivities(prev => prev.filter(activity => activity.id !== activityId));

      console.log('✅ Activité supprimée avec succès');

    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      setError('Impossible de supprimer l\'activité. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (activityId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simuler le marquage comme terminé
      setActivities(prev => prev.map(activity =>
        activity.id === activityId
          ? { ...activity, status: 'completed' as ActivityStatus, updated_at: new Date().toISOString() }
          : activity
      ));

      console.log('✅ Activité marquée comme terminée');

    } catch (error) {
      console.error('❌ Erreur lors du marquage:', error);
      setError('Impossible de marquer l\'activité comme terminée.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCancelled = async (activityId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simuler le marquage comme annulé
      setActivities(prev => prev.map(activity =>
        activity.id === activityId
          ? { ...activity, status: 'cancelled' as ActivityStatus, updated_at: new Date().toISOString() }
          : activity
      ));

      console.log('✅ Activité marquée comme annulée');

    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation:', error);
      setError('Impossible d\'annuler l\'activité.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditActivity = (activity: ProspectActivity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleNewActivity = () => {
    setEditingActivity(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingActivity(undefined);
  };

  const handleSubmit = (data: Omit<ProspectActivity, 'id' | 'prospect_id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    if (editingActivity) {
      handleUpdateActivity(data);
    } else {
      handleCreateActivity(data);
    }
  };

  const pendingCount = currentActivities.filter(a => a.status === 'pending').length;
  const completedCount = currentActivities.filter(a => a.status === 'completed').length;
  const overdueCount = currentActivities.filter(a =>
    a.status === 'pending' && new Date(a.activity_date) < new Date()
  ).length;

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-foreground flex items-center`}>
            <span className="mr-2">📋</span>
            Activités - {prospectName}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-900/40 text-blue-300 rounded-full text-xs font-medium">
              {currentActivities.length} total
            </span>
            <span className="px-2 py-1 bg-yellow-900/40 text-yellow-300 rounded-full text-xs font-medium">
              {pendingCount} en attente
            </span>
            <span className="px-2 py-1 bg-green-900/40 text-green-300 rounded-full text-xs font-medium">
              {completedCount} terminées
            </span>
            {overdueCount > 0 && (
              <span className="px-2 py-1 bg-red-900/40 text-red-300 rounded-full text-xs font-medium">
                {overdueCount} en retard
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleNewActivity}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors duration-200"
        >
          <span>+</span>
          <span>Nouvelle activité</span>
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Liste des activités */}
      <ActivityList
        activities={currentActivities}
        onEdit={handleEditActivity}
        onDelete={handleDeleteActivity}
        onMarkCompleted={handleMarkCompleted}
        onMarkCancelled={handleMarkCancelled}
        loading={loading}
      />

      {/* Modal pour créer/modifier une activité */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-8">
          <div className="bg-surface-2 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {editingActivity ? 'Modifier l\'activité' : 'Nouvelle activité'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <span className="sr-only">Fermer</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ActivityForm
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              initialData={editingActivity}
              loading={loading}
              users={users}
            />
          </div>
        </div>
      )}
    </div>
  );
};
