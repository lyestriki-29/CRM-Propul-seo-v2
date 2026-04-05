import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Euro,
  FileText,
  MessageSquare,
  Edit,
  CheckCircle,
  Plus,
  Clock,
  Trash2,
  Copy,
} from 'lucide-react';
import { useActivities, ActivityType, ActivityPriority } from '../../hooks/useActivities';
import { useStore } from '../../store/useStore';
import { formatTextWithLineBreaks } from '../../utils/textFormatting';
import { formatFullDate, formatRelativeDate, createFrenchDateTime } from '../../utils/frenchDateUtils';

interface SimpleClientDetailsProps {
  clientId: string;
  onBack: () => void;
  onEdit: (clientId: string) => void;
}

export const SimpleClientDetails: React.FC<SimpleClientDetailsProps> = ({
  clientId,
  onBack,
  onEdit,
}) => {
  const { clients } = useStore();
  const client = clients.find(c => c.id === clientId);

  // Fonction pour copier le texte dans le presse-papiers
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`✅ ${type} copié:`, text);
    } catch (err) {
      console.error(`❌ Erreur lors de la copie du ${type}:`, err);
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log(`✅ ${type} copié (méthode fallback):`, text);
    }
  };
  
  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Client non trouvé</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-surface-10 text-white rounded hover:bg-surface-3"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
        </div>
        <button
          onClick={() => onEdit(clientId)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          <Edit className="h-4 w-4" />
          <span>Modifier</span>
        </button>
      </div>

      {/* Client Info */}
      <div className="bg-surface-1 rounded-lg shadow-sm border border-border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Secteur</p>
                <p className="font-medium">{client.sector}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(client.email, 'Email')}
                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                title="Copier l'email"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(client.phone, 'Téléphone')}
                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                title="Copier le téléphone"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{client.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Euro className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">CA Total</p>
                <p className="font-medium">{client.total_revenue?.toLocaleString()}€</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Dernier contact</p>
                <p className="font-medium">
                  {new Date(client.last_contact).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <ProspectActivitiesSection
        prospectId={clientId}
        prospectName={client.name}
      />
    </div>
  );
};

// Composant d'activités avec synchronisation globale
const ProspectActivitiesSection: React.FC<{
  prospectId: string;
  prospectName: string;
}> = ({ prospectId, prospectName }) => {
  const { 
    addActivity, 
    deleteActivity, 
    completeActivity,
    getActivitiesByProspect,
    isLoading,
    error,
    ACTIVITY_TYPE_LABELS,
  } = useActivities();

  // Obtenir les activités pour ce prospect
  const activities = getActivitiesByProspect(prospectId);

  // État local pour le formulaire
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activity_date: '',
    activity_time: '09:00',
    activity_type: 'call' as ActivityType,
    priority: 'medium' as ActivityPriority,
  });

  // Créer des activités de démo si aucune n'existe
  useEffect(() => {
    if (activities.length === 0) {
      const createDemoActivities = async () => {
        try {
          await addActivity({
            prospect_id: prospectId,
            prospect_name: prospectName,
            title: 'Premier contact téléphonique',
            description: 'Appel de découverte pour comprendre les besoins du prospect',
            activity_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            activity_type: 'call',
            priority: 'high',
            status: 'pending',
            assigned_to: 'user-1',
            created_by: 'user-1',
          });

          await addActivity({
            prospect_id: prospectId,
            prospect_name: prospectName,
            title: 'Rendez-vous de présentation',
            description: 'Présentation détaillée de nos solutions',
            activity_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            activity_type: 'meeting',
            priority: 'high',
            status: 'pending',
            assigned_to: 'user-1',
            created_by: 'user-1',
          });

          await addActivity({
            prospect_id: prospectId,
            prospect_name: prospectName,
            title: 'Suivi après premier contact',
            description: 'Email de suivi avec documentation',
            activity_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            activity_type: 'email',
            priority: 'medium',
            status: 'completed',
            assigned_to: 'user-1',
            created_by: 'user-1',
          });
        } catch (error) {
          console.error('Erreur lors de la création des activités de démo:', error);
        }
      };

      createDemoActivities();
    }
  }, [activities.length, prospectId, prospectName, addActivity]);

  // Utiliser les fonctions centralisées pour le formatage des dates

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.activity_date) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      // Créer une date en heure française
      const activityDate = createFrenchDateTime(formData.activity_date, formData.activity_time);
      
      await addActivity({
        prospect_id: prospectId,
        prospect_name: prospectName,
        title: formData.title,
        description: formData.description || undefined,
        activity_date: activityDate,
        activity_type: formData.activity_type,
        priority: formData.priority,
        status: 'pending',
        assigned_to: 'current-user',
        created_by: 'current-user',
      });
      
      setFormData({
        title: '',
        description: '',
        activity_date: '',
        activity_time: '09:00',
        activity_type: 'call',
        priority: 'medium',
      });
      setShowForm(false);
      
      console.log('✅ Activité créée et synchronisée avec le calendrier');
    } catch (error) {
      console.error('Erreur lors de la création de l\'activité:', error);
    }
  };

  const handleMarkCompleted = async (activityId: string) => {
    try {
      await completeActivity(activityId);
      console.log('✅ Activité marquée comme terminée et synchronisée');
    } catch (error) {
      console.error('Erreur lors de la completion:', error);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      try {
        await deleteActivity(activityId);
        console.log('🗑️ Activité supprimée et synchronisée');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const upcomingActivities = activities.filter(activity => 
    activity.status === 'pending' && new Date(activity.activity_date) >= new Date()
  );

  const pastActivities = activities.filter(activity => 
    activity.status !== 'pending' || new Date(activity.activity_date) < new Date()
  );

  // Convertir les couleurs hex en classes CSS
  const getActivityColorClass = (activityType: ActivityType) => {
    const colorMap: Record<ActivityType, string> = {
      call: 'bg-blue-500/15 text-blue-400',
      meeting: 'bg-green-500/15 text-green-400',
      email: 'bg-purple-500/15 text-purple-400',
      follow_up: 'bg-orange-500/15 text-orange-400',
      demo: 'bg-indigo-500/15 text-indigo-400',
      proposal: 'bg-yellow-500/15 text-yellow-400',
      note: 'bg-surface-2 text-foreground',
      reminder: 'bg-red-500/15 text-red-400',
      other: 'bg-surface-2 text-foreground'
    };
    return colorMap[activityType] || 'bg-surface-2 text-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Message de statut de synchronisation */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <span className="text-green-400">🔄</span>
          <p className="text-sm text-green-400">
            <strong>Synchronisation active :</strong> {activities.length} activité(s) synchronisée(s) avec le calendrier pour {prospectName}
          </p>
        </div>
      </div>

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center">
            <span className="mr-2">📋</span>
            Activités - {prospectName}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-500/15 text-blue-400 rounded-full text-xs font-medium">
              {activities.length} total
            </span>
            <span className="px-2 py-1 bg-yellow-500/15 text-yellow-400 rounded-full text-xs font-medium">
              {upcomingActivities.length} à venir
            </span>
            <span className="px-2 py-1 bg-green-500/15 text-green-400 rounded-full text-xs font-medium">
              {pastActivities.filter(a => a.status === 'completed').length} terminées
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle activité</span>
          </button>
        </div>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="bg-surface-1 rounded-lg shadow-sm border border-border p-6">
          <h4 className="text-lg font-semibold mb-4">Nouvelle activité</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex: Appel de suivi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Type d'activité
                </label>
                <select
                  value={formData.activity_type}
                  onChange={(e) => setFormData({...formData, activity_type: e.target.value as ActivityType})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.activity_date}
                  onChange={(e) => setFormData({...formData, activity_date: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Heure
                </label>
                <input
                  type="time"
                  value={formData.activity_time}
                  onChange={(e) => setFormData({...formData, activity_time: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as ActivityPriority})}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">🔵 Basse</option>
                <option value="medium">🟡 Moyenne</option>
                <option value="high">🔴 Haute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Détails supplémentaires..."
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Création...' : 'Créer l\'activité'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-border text-muted-foreground rounded hover:bg-surface-3"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des activités à venir */}
      {upcomingActivities.length > 0 && (
        <div className="bg-surface-1 rounded-lg shadow-sm border border-border p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-yellow-400" />
            Activités à venir ({upcomingActivities.length})
          </h4>
          <div className="space-y-3">
            {upcomingActivities.map(activity => (
              <div key={activity.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="font-medium text-foreground">{activity.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColorClass(activity.activity_type)}`}>
                        {ACTIVITY_TYPE_LABELS[activity.activity_type]}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatFullDate(activity.activity_date)} • {formatRelativeDate(activity.activity_date)}
                      </p>
                      {activity.description && (
                        <p className="flex items-start">
                          <MessageSquare className="h-4 w-4 mr-2 mt-0.5" />
                          {formatTextWithLineBreaks(activity.description)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMarkCompleted(activity.id)}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded"
                      title="Marquer comme terminé"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique des activités */}
      {pastActivities.length > 0 && (
        <div className="bg-surface-1 rounded-lg shadow-sm border border-border p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
            Historique ({pastActivities.length})
          </h4>
          <div className="space-y-3">
            {pastActivities.map(activity => (
              <div key={activity.id} className="border border-border rounded-lg p-4 bg-surface-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="font-medium text-foreground">{activity.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColorClass(activity.activity_type)}`}>
                        {ACTIVITY_TYPE_LABELS[activity.activity_type]}
                      </span>
                      {activity.status === 'completed' && (
                        <span className="px-2 py-1 bg-green-500/15 text-green-400 rounded-full text-xs font-medium">
                          Terminee
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatFullDate(activity.activity_date)} • {formatRelativeDate(activity.activity_date)}
                      </p>
                      {activity.description && (
                        <p className="flex items-start">
                          <MessageSquare className="h-4 w-4 mr-2 mt-0.5" />
                          {formatTextWithLineBreaks(activity.description)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucune activité */}
      {activities.length === 0 && !isLoading && (
        <div className="bg-surface-1 rounded-lg shadow-sm border border-border p-6 text-center">
          <div className="text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium">Aucune activité</p>
            <p className="text-sm">Créez votre première activité pour ce prospect</p>
          </div>
        </div>
      )}

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">!</span>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}; 