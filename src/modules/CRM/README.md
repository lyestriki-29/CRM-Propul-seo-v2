# Module CRM

## Description
Ce module gère la gestion de la relation client (CRM) : affichage, création, édition et suivi des leads et clients.

## Structure
- `index.tsx` : Entrée principale du module CRM
- `CRMList.tsx` : Sous-composant pour lister les clients
- `CRMDetails.tsx` : Sous-composant pour afficher les détails d'un client
- `types.ts` : Types TypeScript spécifiques au CRM
- `__tests__/` : Tests unitaires des sous-composants

## Utilisation
Importer le module ou ses sous-composants dans votre code :
```tsx
import { CRMList } from '@/modules/CRM/CRMList';
import { CRMDetails } from '@/modules/CRM/CRMDetails';
import type { CRMClient } from '@/modules/CRM/types';

const clients: CRMClient[] = [
  { id: '1', name: 'Alice', email: 'alice@mail.com', status: 'client' },
  { id: '2', name: 'Bob', email: 'bob@mail.com', status: 'prospect' },
];

function MyCRMPage() {
  const [selected, setSelected] = React.useState<CRMClient|null>(null);
  return (
    <div>
      <CRMList clients={clients} onSelect={setSelected} />
      {selected && <CRMDetails client={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
```

## Tests unitaires
Les tests sont situés dans `__tests__/`. Exemple :
```ts
import { render, screen } from '@testing-library/react';
import { CRMList } from '../CRMList';
// ...
```

## Points d’extension
- Ajouter des sous-composants pour la création/édition de client
- Ajouter des hooks personnalisés si besoin

## Auteur
À compléter
