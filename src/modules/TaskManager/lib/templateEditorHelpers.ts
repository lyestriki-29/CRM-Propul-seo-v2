import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export const TEMPLATE_CATEGORIES = [
  'Préparation',
  'Structure & Design',
  'Contenus',
  'Fonctionnalités',
  'Optimisations',
  'Addons',
  'Tests',
  'Déploiement',
  'Post-lancement'
];

export const TEMPLATE_PRIORITIES = [
  { value: 'high', label: 'Haute', icon: AlertCircle, color: 'text-red-500' },
  { value: 'medium', label: 'Moyenne', icon: Clock, color: 'text-yellow-500' },
  { value: 'low', label: 'Basse', icon: CheckCircle, color: 'text-green-500' }
] as const;

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-red-500/15 text-red-400 border-red-500/20';
    case 'medium': return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
    case 'low': return 'bg-green-500/15 text-green-400 border-green-500/20';
    default: return 'bg-surface-2 text-foreground border-border';
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Préparation': 'bg-primary/15 text-primary border-primary/20',
    'Structure & Design': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    'Contenus': 'bg-green-500/15 text-green-400 border-green-500/20',
    'Fonctionnalités': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    'Optimisations': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    'Addons': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    'Tests': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    'Déploiement': 'bg-red-500/15 text-red-400 border-red-500/20',
    'Post-lancement': 'bg-surface-2 text-foreground border-border'
  };
  return colors[category] || 'bg-surface-2 text-foreground border-border';
}
