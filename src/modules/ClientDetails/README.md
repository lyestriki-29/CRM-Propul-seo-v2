# Module ClientDetails

## Description
Ce module gère l’affichage et la gestion des détails clients : informations, statut, etc.

## Structure
- `index.tsx` : Entrée principale du module ClientDetails
- `ClientDetailsList.tsx` : Sous-composant pour lister les clients
- `ClientDetailsDetails.tsx` : Sous-composant pour afficher les détails d’un client
- `types.ts` : Types TypeScript spécifiques aux clients
- `__tests__/` : Tests unitaires des sous-composants

## Utilisation
Importer le module ou ses sous-composants dans votre code :
```tsx
import { ClientDetailsList } from '@/modules/ClientDetails/ClientDetailsList';
import { ClientDetailsDetails } from '@/modules/ClientDetails/ClientDetailsDetails';
import type { Client } from '@/modules/ClientDetails/types';

const clients: Client[] = [
  { id: '1', name: 'Alice', email: 'alice@mail.com', status: 'client' },
  { id: '2', name: 'Bob', email: 'bob@mail.com', status: 'prospect' },
];

function MyClientsPage() {
  const [selected, setSelected] = React.useState<Client|null>(null);
  return (
    <div>
      <ClientDetailsList clients={clients} onSelect={setSelected} />
      {selected && <ClientDetailsDetails client={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
```

## Tests unitaires
Les tests sont situés dans `__tests__/`. Exemple :
```ts
import { render, screen } from '@testing-library/react';
import { ClientDetailsList } from '../ClientDetailsList';
// ...
```

## Points d’extension
- Ajouter des sous-composants pour l’édition de client
- Ajouter des hooks personnalisés si besoin

## Auteur
À compléter 