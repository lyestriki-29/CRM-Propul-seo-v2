import { motion } from 'framer-motion';
import { ArrowLeft, Grid3X3, List } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { StatusDot } from './StatusDot';

export function CompletedProjectsHeader({
  mounted,
  fromDashboard,
  handleBackToDashboard,
  completedProjectsCount,
  viewMode,
  setViewMode
}: {
  mounted: boolean;
  fromDashboard: boolean;
  handleBackToDashboard: () => void;
  completedProjectsCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}) {
  return (
    <motion.header
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          {fromDashboard && (
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="text-muted-foreground hover:text-white hover:bg-surface-2/50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <StatusDot color="emerald" />
                <span className="text-xs font-medium text-emerald-400">
                  {completedProjectsCount} projet{completedProjectsCount > 1 ? 's' : ''} terminé{completedProjectsCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <h1
              className="text-3xl lg:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="text-white">Projets</span>
              <span className="ml-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Terminés
              </span>
            </h1>
            <p className="mt-2 text-muted-foreground text-sm lg:text-base">
              Historique et gestion de vos projets achevés avec succès
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-2/50 border border-border/50">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-surface-3 text-white'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-surface-3 text-white'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
