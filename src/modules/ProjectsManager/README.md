# Module ProjectsManager

## Description
Ce module gère la gestion des projets : affichage, création, édition et suivi des projets clients.

## Structure
- `index.tsx` : Entrée principale du module ProjectsManager
- `ProjectsManagerList.tsx` : Sous-composant pour lister les projets
- `ProjectsManagerDetails.tsx` : Sous-composant pour afficher les détails d'un projet
- `types.ts` : Types TypeScript spécifiques aux projets
- `__tests__/` : Tests unitaires des sous-composants

## Utilisation
Importer le module ou ses sous-composants dans votre code :
```tsx
import { ProjectsManagerList } from '@/modules/ProjectsManager/ProjectsManagerList';
import { ProjectsManagerDetails } from '@/modules/ProjectsManager/ProjectsManagerDetails';
import type { Project } from '@/modules/ProjectsManager/types';

const projects: Project[] = [
  { id: '1', name: 'Site Web', client: 'Client A', status: 'active', startDate: '2024-01-01' },
  { id: '2', name: 'SEO', client: 'Client B', status: 'completed', startDate: '2023-10-01', endDate: '2024-02-01' },
];

function MyProjectsPage() {
  const [selected, setSelected] = React.useState<Project|null>(null);
  return (
    <div>
      <ProjectsManagerList projects={projects} onSelect={setSelected} />
      {selected && <ProjectsManagerDetails project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
```

## Tests unitaires
Les tests sont situés dans `__tests__/`. Exemple :
```ts
import { render, screen } from '@testing-library/react';
import { ProjectsManagerList } from '../ProjectsManagerList';
// ...
```

## Points d’extension
- Ajouter des sous-composants pour la création/édition de projet
- Ajouter des hooks personnalisés si besoin

## Auteur
À compléter 