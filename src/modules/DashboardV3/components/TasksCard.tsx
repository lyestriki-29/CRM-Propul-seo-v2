import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChevronRight, Circle } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../lib/utils';
import { itemVariants } from '../lib/animations';

interface TasksCardProps {
  urgentTasks: Array<{ id: string; title: string }>;
  pendingTasks: Array<{ id: string; title: string }>;
  isPrivacyMode: boolean;
  isMobile: boolean;
  onClick: () => void;
}

export function TasksCard({ urgentTasks, pendingTasks, isPrivacyMode, isMobile, onClick }: TasksCardProps) {
  return (
    <motion.div variants={itemVariants} className={cn(isMobile ? "col-span-1" : "col-span-12 lg:col-span-4")}>
      <div
        onClick={onClick}
        className={cn(
          "group relative h-full rounded-3xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 cursor-pointer overflow-hidden transition-all duration-300 hover:border-neon/30 hover:shadow-lg hover:shadow-neon/5",
          isMobile ? "min-h-[140px] p-4" : "min-h-[200px] p-6"
        )}
      >
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neon/10 border border-neon/20">
                <CheckCircle2 className="h-5 w-5 text-neon-light" />
              </div>
              <h3 className="font-semibold text-white">Tâches</h3>
            </div>
            {urgentTasks.length > 0 && (
              <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse">
                {urgentTasks.length} urgentes
              </Badge>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-3">
              {isPrivacyMode ? (
                <div className="text-3xl font-bold text-muted-foreground font-mono">{'\u2022\u2022'}</div>
              ) : (
                <>
                  <span className="text-3xl font-bold text-white">{pendingTasks.length}</span>
                  <span className="text-sm text-muted-foreground">en cours</span>
                </>
              )}
            </div>

            {!isPrivacyMode && pendingTasks.length > 0 && (
              <div className="space-y-2">
                {pendingTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Circle className="h-3 w-3 text-neon-muted" />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Voir toutes les tâches</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
