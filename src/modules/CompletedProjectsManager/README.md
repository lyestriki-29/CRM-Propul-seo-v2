# Module CompletedProjectsManager

## Description
Ce module gère l’affichage et la gestion des projets terminés ou archivés.

## Structure
- `index.tsx` : Entrée principale du module CompletedProjectsManager
- `CompletedProjectsManagerList.tsx` : Sous-composant pour lister les projets terminés
- `CompletedProjectsManagerDetails.tsx` : Sous-composant pour afficher les détails d’un projet terminé
- `types.ts` : Types TypeScript spécifiques aux projets terminés
- `__tests__/` : Tests unitaires des sous-composants

## Utilisation
Importer le module ou ses sous-composants dans votre code :
```tsx
import { CompletedProjectsManagerList } from '@/modules/CompletedProjectsManager/CompletedProjectsManagerList';
import { CompletedProjectsManagerDetails } from '@/modules/CompletedProjectsManager/CompletedProjectsManagerDetails';
import type { CompletedProject } from '@/modules/CompletedProjectsManager/types';

const projects: CompletedProject[] = [
  { id: '1', name: 'Site Vitrine', client: 'Client A', endDate: '2024-01-01', status: 'completed' },
  { id: '2', name: 'Refonte SEO', client: 'Client B', endDate: '2024-02-01', status: 'archived' },
];

function MyCompletedProjectsPage() {
  const [selected, setSelected] = React.useState<CompletedProject|null>(null);
  return (
    <div>
      <CompletedProjectsManagerList projects={projects} onSelect={setSelected} />
      {selected && <CompletedProjectsManagerDetails project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
```

## Tests unitaires
Les tests sont situés dans `__tests__/`. Exemple :
```ts
import { render, screen } from '@testing-library/react';
import { CompletedProjectsManagerList } from '../CompletedProjectsManagerList';
// ...
```

## Points d’extension
- Ajouter des sous-composants pour la réouverture ou l’archivage définitif
- Ajouter des hooks personnalisés si besoin

## Auteur
À compléter 