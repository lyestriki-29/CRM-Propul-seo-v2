# Module Dashboard

## Description
Ce module gère l’affichage du tableau de bord principal du CRM (widgets, stats, listes, etc.).

## Structure
- `index.tsx` : Entrée principale du module Dashboard
- `DashboardList.tsx` : Sous-composant pour lister les widgets
- `DashboardDetails.tsx` : Sous-composant pour afficher les détails d’un widget
- `types.ts` : Types TypeScript spécifiques aux widgets
- `__tests__/` : Tests unitaires des sous-composants

## Utilisation
Importer le module ou ses sous-composants dans votre code :
```tsx
import { DashboardList } from '@/modules/Dashboard/DashboardList';
import { DashboardDetails } from '@/modules/Dashboard/DashboardDetails';
import type { DashboardWidget } from '@/modules/Dashboard/types';

const widgets: DashboardWidget[] = [
  { id: '1', title: 'Chiffre d’affaires', value: 12000, type: 'stat' },
  { id: '2', title: 'Tâches en cours', value: 8, type: 'list' },
];

function MyDashboardPage() {
  const [selected, setSelected] = React.useState<DashboardWidget|null>(null);
  return (
    <div>
      <DashboardList widgets={widgets} onSelect={setSelected} />
      {selected && <DashboardDetails widget={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
```

## Tests unitaires
Les tests sont situés dans `__tests__/`. Exemple :
```ts
import { render, screen } from '@testing-library/react';
import { DashboardList } from '../DashboardList';
// ...
```

## Points d’extension
- Ajouter des sous-composants pour la visualisation graphique
- Ajouter des hooks personnalisés si besoin

## Auteur
À compléter 