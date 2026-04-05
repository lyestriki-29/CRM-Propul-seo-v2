import { Client } from './types';
import { Copy, Mail, Phone } from 'lucide-react';

interface ClientDetailsDetailsProps {
  client: Client;
  onClose: () => void;
}

export const ClientDetailsDetails: React.FC<ClientDetailsDetailsProps> = ({ client, onClose }) => {
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-foreground">Détails du client</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-surface-1 rounded-lg">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground"><strong>Email :</strong> {client.email}</span>
          </div>
          <button
            onClick={() => copyToClipboard(client.email, 'Email')}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
            title="Copier l'email"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-surface-1 rounded-lg">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground"><strong>Téléphone :</strong> {client.phone || 'N/A'}</span>
          </div>
          <button
            onClick={() => copyToClipboard(client.phone || '', 'Téléphone')}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copier le téléphone"
            disabled={!client.phone}
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 bg-surface-1 rounded-lg text-foreground">
          <strong>Nom :</strong> {client.name}
        </div>

        <div className="p-3 bg-surface-1 rounded-lg text-foreground">
          <strong>Entreprise :</strong> {client.company || 'N/A'}
        </div>

        <div className="p-3 bg-surface-1 rounded-lg text-foreground">
          <strong>Statut :</strong> {client.status}
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors duration-200"
      >
        Fermer
      </button>
    </div>
  );
};
