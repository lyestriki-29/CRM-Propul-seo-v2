import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Archive,
  RotateCcw,
  Clock,
  Euro,
  CalendarDays,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

export function ProjectCard({
  project,
  index,
  onReactivate,
  onArchive,
  onView
}: {
  project: any;
  index: number;
  onReactivate: () => void;
  onArchive: () => void;
  onView: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const completedDate = project.updated_at ? new Date(project.updated_at) : null;
  const daysAgo = completedDate
    ? Math.floor((Date.now() - completedDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className={`
        relative overflow-hidden rounded-2xl
        glass-surface-static
        transition-all duration-300
        ${isHovered ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5 -translate-y-1' : ''}
      `}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" />

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.client_name || 'Client non spécifié'}
                </p>
              </div>
            </div>

            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
              Terminé
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {project.budget && (
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 rounded-lg bg-amber-500/10">
                  <Euro className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <span className="text-foreground font-medium">
                  {project.budget.toLocaleString()}€
                </span>
              </div>
            )}

            {completedDate && (
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 rounded-lg bg-cyan-500/10">
                  <CalendarDays className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <span className="text-muted-foreground">
                  {completedDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            )}
          </div>

          {daysAgo !== null && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-surface-2/50">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {daysAgo === 0
                  ? "Terminé aujourd'hui"
                  : daysAgo === 1
                    ? "Terminé hier"
                    : `Terminé il y a ${daysAgo} jours`
                }
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReactivate}
              className="flex-1 h-9 text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Réactiver
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onArchive}
              className="flex-1 h-9 text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
            >
              <Archive className="h-4 w-4 mr-1.5" />
              Archiver
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onView}
              className="h-9 w-9 p-0 text-muted-foreground hover:text-white hover:bg-surface-2 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
