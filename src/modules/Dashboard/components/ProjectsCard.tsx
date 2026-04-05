import { motion } from 'framer-motion';
import { Briefcase, Activity, ChevronRight } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../lib/utils';
import { AnimatedNumber } from './AnimatedNumber';
import { itemVariants } from '../lib/animations';

interface ProjectsCardProps {
  projectsCount: number | undefined;
  activeProjectsCount: number;
  isPrivacyMode: boolean;
  isMobile: boolean;
  onClick: () => void;
}

export function ProjectsCard({ projectsCount, activeProjectsCount, isPrivacyMode, isMobile, onClick }: ProjectsCardProps) {
  return (
    <motion.div variants={itemVariants} className={cn(isMobile ? "col-span-1" : "col-span-6 lg:col-span-4")}>
      <div
        onClick={onClick}
        className={cn(
          "group relative h-full rounded-3xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 cursor-pointer overflow-hidden transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5",
          isMobile ? "min-h-[140px] p-4" : "min-h-[200px] p-6"
        )}
      >
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-2xl" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Briefcase className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="font-semibold text-white">Projets</h3>
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
              {activeProjectsCount} actifs
            </Badge>
          </div>

          <div className="flex-1 flex items-center">
            {isPrivacyMode ? (
              <div className="text-3xl font-bold text-muted-foreground font-mono">{'\u2022\u2022\u2022'}</div>
            ) : (
              <div className="text-3xl font-bold text-white">
                <AnimatedNumber value={projectsCount || 0} />
                <span className="text-lg text-muted-foreground font-normal ml-2">total</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span>Voir tous les projets</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
