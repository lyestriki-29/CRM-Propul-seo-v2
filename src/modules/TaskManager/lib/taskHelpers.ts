import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { Task } from '../../../hooks/useTasks';

export function getStatusColor(status: Task['status']) {
  switch (status) {
    case 'completed': return 'bg-green-500/15 text-green-400';
    case 'in_progress': return 'bg-primary/15 text-primary';
    case 'pending': return 'bg-amber-500/15 text-amber-400';
    case 'cancelled': return 'bg-red-500/15 text-red-400';
    default: return 'bg-surface-2 text-foreground';
  }
}

export function getPriorityColor(priority: Task['priority']) {
  switch (priority) {
    case 'high': return 'bg-orange-500/15 text-orange-400';
    case 'medium': return 'bg-amber-500/15 text-amber-400';
    case 'low': return 'bg-green-500/15 text-green-400';
    default: return 'bg-surface-2 text-foreground';
  }
}

export function getStatusIcon(status: Task['status']) {
  switch (status) {
    case 'completed': return CheckCircle;
    case 'in_progress': return Clock;
    case 'pending': return Clock;
    case 'cancelled': return AlertCircle;
    default: return Clock;
  }
}
