import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { itemVariants } from '../lib/animations';

interface UrgentTasksAlertProps {
  urgentTasks: Array<{ id: string; title: string }>;
  isMobile: boolean;
  onNavigateToTasks: () => void;
}

export function UrgentTasksAlert({ urgentTasks, isMobile, onNavigateToTasks }: UrgentTasksAlertProps) {
  if (urgentTasks.length === 0) return null;

  return (
    <motion.div variants={itemVariants} className={cn(isMobile ? "col-span-2" : "col-span-12")}>
      <div className={cn(
        "rounded-3xl bg-gradient-to-r from-rose-500/10 via-surface-2 to-surface-2 border border-rose-500/20",
        isMobile ? "p-4" : "p-6"
      )}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/10">
            <AlertCircle className="h-6 w-6 text-rose-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-rose-400 mb-1">
              {urgentTasks.length} tâche{urgentTasks.length > 1 ? 's' : ''} urgente{urgentTasks.length > 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ces tâches nécessitent une attention immédiate
            </p>
            <div className="flex flex-wrap gap-2">
              {urgentTasks.slice(0, 3).map((task) => (
                <Badge key={task.id} className="bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20">
                  {task.title}
                </Badge>
              ))}
              {urgentTasks.length > 3 && (
                <Badge className="bg-surface-3 text-muted-foreground border-border">
                  +{urgentTasks.length - 3} autres
                </Badge>
              )}
            </div>
          </div>
          <Button onClick={onNavigateToTasks} className="bg-rose-500 hover:bg-rose-600 text-white">
            Voir tout
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
