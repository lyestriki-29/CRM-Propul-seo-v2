import { CRMClient } from './types';

interface CRMDetailsProps {
  client: CRMClient;
  onClose: () => void;
}

export const CRMDetails: React.FC<CRMDetailsProps> = ({ client, onClose }) => (
  <div>
    <h2>Détails du client</h2>
    <p><strong>Nom :</strong> {client.name}</p>
    <p><strong>Email :</strong> {client.email}</p>
    <p><strong>Téléphone :</strong> {client.phone || 'N/A'}</p>
    <p><strong>Entreprise :</strong> {client.company || 'N/A'}</p>
    <p><strong>Statut :</strong> {client.status}</p>
    <button onClick={onClose}>Fermer</button>
  </div>
); 