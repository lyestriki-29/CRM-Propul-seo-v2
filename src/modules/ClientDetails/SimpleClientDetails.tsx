import { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Euro,
  MessageSquare,
  Edit,
  CheckCircle,
  User,
  Plus,
  Clock,
  Copy,
} from 'lucide-react';
import { useActivities, Activity } from '../../hooks/useActivities';

interface SimpleClientDetailsProps {
  clientId: string;
  onBack: () => void;
  onEdit: (clientId: string) => void;
}

// Types d'activités locaux (utilisation des types du hook)
import { ActivityType, ActivityPriority, ActivityStatus } from '../../hooks/useActivities';
import { formatTextWithLineBreaks } from '../../utils/textFormatting';
import { formatFullDate, formatRelativeDate } from '../../utils/frenchDateUtils';

// Interface locale pour compatibilité
interface ProspectActivity extends Activity {}

// Labels/couleurs simples de secours
const LOCAL_ACTIVITY_TYPE_LABELS: Record<string, string> = {
  call: 'Appel',
  meeting: 'RDV',
  email: 'Email',
  other: 'Autre'
};
const LOCAL_ACTIVITY_TYPE_COLORS: Record<string, string> = {
  call: 'bg-blue-500/15 text-blue-400',
  meeting: 'bg-purple-500/15 text-purple-400',
  email: 'bg-green-500/15 text-green-400',
  other: 'bg-surface-2 text-foreground'
};

// Composant d'activités intégré avec synchronisation globale
const ProspectActivitiesSection: React.FC<{
  prospectId: string;
  prospectName: string;
}> = ({ prospectId, prospectName }) => {
  // Utiliser le hook global des activités
  const { 
    getActivitiesByProspect
  } = useActivities();

  // Obtenir les activités pour ce prospect
  const activities = getActivitiesByProspect(prospectId);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activity_date: '',
    activity_time: '09:00',
    activity_type: 'call' as ActivityType,
    priority: 'medium' as ActivityPriority,
  });

  // Utiliser les fonctions centralisées pour le formatage des dates

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demo uniquement: création d\'activité désactivée ici.');
  };

  const handleMarkCompleted = (activityId: string) => {
    const updatedActivities = activities.map(activity => 
      activity.id === activityId 
        ? { ...activity, status: 'completed' as ActivityStatus, updated_at: new Date().toISOString() }
        : activity
    );
    // updateActivities(updatedActivities); // This function was removed
    console.log('✅ Activité marquée comme terminée et sauvegardée:', activityId);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      const updatedActivities = activities.filter(activity => activity.id !== activityId);
      // updateActivities(updatedActivities); // This function was removed
      console.log('🗑️ Activité supprimée:', activityId);
    }
  };

  const upcomingActivities = activities.filter((activity: Activity) =>
    activity.status === 'pending' && new Date(activity.activity_date) >= new Date()
  );

  const pastActivities = activities.filter((activity: Activity) =>
    activity.status !== 'pending' || new Date(activity.activity_date) < new Date()
  );

  return (
    <div className="space-y-6">
      {/* En-tête simplifié */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground flex items-center">
          <span className="mr-2">📋</span>
          Activités - {prospectName}
        </h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          <span>Nouvelle activité</span>
        </button>
      </div>

      {/* Formulaire de création - placeholder */}
      {showForm && (
        <div className="bg-surface-1 border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Formulaire de création désactivé dans cette version de démonstration.</p>
        </div>
      )}

      {/* Activités à venir */}
      {upcomingActivities.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Activités à venir ({upcomingActivities.length})
          </h4>
          <div className="space-y-3">
            {upcomingActivities.map((activity: Activity) => (
              <div key={activity.id} className="border rounded-lg p-4 bg-surface-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${LOCAL_ACTIVITY_TYPE_COLORS[activity.activity_type] || 'bg-surface-2 text-foreground'}`}>
                        {LOCAL_ACTIVITY_TYPE_LABELS[activity.activity_type] || activity.activity_type}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">
                        {formatRelativeDate(activity.activity_date)}
                      </span>
                    </div>
                    <h5 className="font-medium text-foreground mb-1">{activity.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{formatFullDate(activity.activity_date)}</p>
                    {activity.description && <p className="text-sm text-muted-foreground">{formatTextWithLineBreaks(activity.description)}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      {pastActivities.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Historique ({pastActivities.length})
          </h4>
          <div className="space-y-3">
            {pastActivities.map((activity: Activity) => (
              <div key={activity.id} className="border rounded-lg p-4 bg-surface-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${LOCAL_ACTIVITY_TYPE_COLORS[activity.activity_type] || 'bg-surface-2 text-foreground'}`}>
                        {LOCAL_ACTIVITY_TYPE_LABELS[activity.activity_type] || activity.activity_type}
                      </span>
                      <span className="px-2 py-1 bg-green-500/15 text-green-400 rounded-full text-xs font-medium">
                        Termine
                      </span>
                    </div>
                    <h5 className="font-medium text-foreground mb-1">{activity.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{formatFullDate(activity.activity_date)}</p>
                    {activity.description && <p className="text-sm text-muted-foreground">{formatTextWithLineBreaks(activity.description)}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Données de démonstration pour Christophe CTRP
const demoClient = {
  id: '2',
  nom: 'Christophe CTRP',
  email: 'christophe.ctrp@email.com',
  telephone: '06 12 34 56 78',
  adresse: '123 Rue de la Paix, 75001 Paris',
  entreprise: 'CTRP Solutions',
  budget_estime: 25000,
  statut: 'prospect' as const,
  date_creation: '2024-01-15T10:00:00Z',
  dernier_contact: '2024-01-20T14:30:00Z',
  notes: ['Client intéressé par nos services', 'Demande un devis personnalisé'],
};

export function SimpleClientDetails({ clientId, onBack, onEdit }: SimpleClientDetailsProps) {
  const client = demoClient; // Utilisation des données de démonstration

  console.log('🔍 SimpleClientDetails - Diagnostic:', {
    clientId,
    clientName: client?.nom,
    clientFound: !!client,
    prospectId: clientId,
  });

  // Fonction pour copier le texte dans le presse-papiers
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`✅ ${type} copié:`, text);
      // Optionnel: afficher un toast de succès
      // toast.success(`${type} copié dans le presse-papiers`);
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
        <div className="text-center">
          <p className="text-muted-foreground">Client non trouvé</p>
          <button 
            onClick={onBack} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const handleEditClick = () => {
    onEdit(clientId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-2 border border-border rounded hover:bg-surface-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>
          <h1 className="text-2xl font-bold">Fiche Client</h1>
        </div>
        <button 
          onClick={handleEditClick}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          <Edit className="h-4 w-4" />
          <span>Modifier</span>
        </button>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-surface-1 border rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary">
              {client.nom.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{client.nom}</h2>
              <span className="inline-block bg-yellow-500/15 text-yellow-400 px-2 py-1 rounded text-sm">
                Prospect
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.email}</span>
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
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.telephone}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(client.telephone, 'Téléphone')}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                  title="Copier le téléphone"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.adresse}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.entreprise}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.budget_estime}€</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Créé le 15 Jan 2024
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="bg-surface-1 border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Activités à venir</span>
              <span className="px-2 py-1 bg-blue-500/15 text-blue-400 rounded text-sm">
                2
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Activités terminées</span>
              <span className="px-2 py-1 bg-green-500/15 text-green-400 rounded text-sm">
                1
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Devis</span>
              <span className="px-2 py-1 bg-surface-2 text-foreground rounded text-sm">
                0
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dernier contact</span>
                <span className="text-sm">20/01</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Système d'Activités Persistantes */}
      <div className="mb-6">
        <div className="bg-surface-1 border rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-sm text-green-400 font-medium">
                  Systeme d'activites persistantes integre !
                </p>
              </div>
              <p className="text-sm text-green-400 mt-2">
                Vous pouvez maintenant ajouter des activités (appels, RDV, emails) qui seront sauvegardées et synchronisées avec le calendrier.
              </p>
            </div>
          </div>
          
          {/* Composant d'activités intégré */}
          <ProspectActivitiesSection
            prospectId={clientId}
            prospectName={client.nom}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-surface-1 border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Notes</h3>
        {client.notes && client.notes.length > 0 ? (
          <div className="space-y-3">
            {client.notes.map((note, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{note}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        15 Jan 2024
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Utilisateur
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucune note ajoutée</p>
        )}
      </div>
    </div>
  );
} 