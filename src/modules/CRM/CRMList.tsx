import { CRMClient } from './types';

interface CRMListProps {
  clients: CRMClient[];
  onSelect: (client: CRMClient) => void;
}

export const CRMList: React.FC<CRMListProps> = ({ clients, onSelect }) => (
  <div>
    <h2>Liste des clients</h2>
    <ul>
      {clients.map(client => (
        <li key={client.id}>
          <button onClick={() => onSelect(client)}>{client.name} ({client.status})</button>
        </li>
      ))}
    </ul>
  </div>
); 