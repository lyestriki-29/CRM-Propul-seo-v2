import { Client } from './types';

interface ClientDetailsListProps {
  clients: Client[];
  onSelect: (client: Client) => void;
}

export const ClientDetailsList: React.FC<ClientDetailsListProps> = ({ clients, onSelect }) => (
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