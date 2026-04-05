import React from 'react';
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
  Copy,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// 🔥 INTÉGRATION DU SYSTÈME D'ACTIVITÉS PERSISTANTES
import { ProspectActivitiesSection } from '../../components/prospect-activities/ProspectActivitiesSection';

const statusLabels: Record<string, string> = {
  prospect: 'Prospect',
  devis: 'Devis',
  signe: 'Signé',
  livre: 'Livré',
  perdu: 'Perdu',
};

const statusColors: Record<string, string> = {
  prospect: 'bg-yellow-500/15 text-yellow-400 px-2 py-1 rounded text-sm',
  devis: 'bg-blue-500/15 text-blue-400 px-2 py-1 rounded text-sm',
  signe: 'bg-green-500/15 text-green-400 px-2 py-1 rounded text-sm',
  livre: 'bg-cyan-500/15 text-cyan-400 px-2 py-1 rounded text-sm',
  perdu: 'bg-red-500/15 text-red-400 px-2 py-1 rounded text-sm',
};

interface ClientDetailsProps {
  clientId: string;
  onBack: () => void;
  onEdit: (clientId: string) => void;
}

export function ClientDetails({ clientId, onBack, onEdit }: ClientDetailsProps) {
  const { clients, tasks, events, quotes, users } = useStore();
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

  // 🔥 LOGS DE DIAGNOSTIC
  console.log('🔍 ClientDetails - Diagnostic:', {
    clientId,
    clientName: client?.name, // Utiliser 'name' au lieu de 'nom'
    clientFound: !!client,
    prospectId: clientId, // Le prospect_id sera le même que clientId
  });

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

  const clientTasks = tasks.filter(t => t.project_id === clientId); // Utiliser 'project_id' au lieu de 'projectId'
  const clientEvents = events.filter(e => e.clientId === clientId); // Utiliser 'clientId' pour CalendarEvent
  const clientQuotes = quotes.filter(q => q.clientId === clientId); // Utiliser 'clientId' pour Quote

  const handleEditClick = () => {
    onEdit(clientId);
  };

  return (
    <div className="p-6">
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
        <div className="lg:col-span-2 bg-surface-1 border rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 bg-surface-3 rounded-full flex items-center justify-center text-xl font-bold">
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <span className={statusColors[client.status]}>
                {statusLabels[client.status]}
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
                  <span className="text-sm">{client.phone}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(client.phone, 'Téléphone')}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
                  title="Copier le téléphone"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.address}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.company}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.budget_estimate}€</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Créé le {format(new Date(client.date_creation), 'dd MMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="bg-surface-1 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tâches</span>
              <span className="px-2 py-1 bg-surface-2 text-foreground rounded text-sm">
                {clientTasks.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Événements</span>
              <span className="px-2 py-1 bg-surface-2 text-foreground rounded text-sm">
                {clientEvents.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Devis</span>
              <span className="px-2 py-1 bg-surface-2 text-foreground rounded text-sm">
                {clientQuotes.length}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dernier contact</span>
                <span className="text-sm">
                  {format(new Date(client.last_contact), 'dd/MM', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 INTÉGRATION DU SYSTÈME D'ACTIVITÉS PERSISTANTES */}
      <div className="mb-6">
        <div className="bg-surface-1 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Système d'Activités Persistantes</span>
          </h3>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-400">
              ✅ Le nouveau système d'activités persistantes est maintenant intégré ! 
              Vos activités seront sauvegardées et synchronisées avec le calendrier.
            </p>
          </div>
          <ProspectActivitiesSection
            prospectId={clientId}
            prospectName={client.name}
            prospectType="client"
            users={users.map(u => ({ id: u.id, name: u.name }))}
            compact={false}
          />
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tâches */}
        <div className="bg-surface-1 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tâches</h3>
          {clientTasks.length > 0 ? (
            <div className="space-y-3">
              {clientTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <span className="px-2 py-1 bg-surface-2 text-foreground rounded text-sm">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune tâche assignée</p>
          )}
        </div>

        {/* Événements */}
        <div className="bg-surface-1 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Événements</h3>
          {clientEvents.length > 0 ? (
            <div className="space-y-3">
              {clientEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun événement programmé</p>
          )}
        </div>

        {/* Devis */}
        <div className="bg-surface-1 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Devis</h3>
          {clientQuotes.length > 0 ? (
            <div className="space-y-3">
              {clientQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <p className="font-medium">Devis #{quote.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.total}€ - {format(new Date(quote.date), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-surface-2 text-foreground rounded text-sm">
                    {quote.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun devis généré</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6 bg-surface-1 border rounded-lg p-6">
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
                        {format(new Date(client.date_creation), 'dd MMM yyyy', { locale: fr })}
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