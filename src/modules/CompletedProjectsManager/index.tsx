import { motion } from 'framer-motion';
import { CheckCircle2, Briefcase, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCompletedProjectsData } from './hooks/useCompletedProjectsData';
import { MetricCard } from './components/MetricCard';
import { ProjectCard } from './components/ProjectCard';
import { CompletedProjectsHeader } from './components/CompletedProjectsHeader';
import { SearchFiltersBar } from './components/SearchFiltersBar';
import { CelebrationBanner } from './components/CelebrationBanner';

export function CompletedProjectsManager() {
  const {
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    filterPeriod,
    setFilterPeriod,
    mounted,
    projectsLoading,
    fromDashboard,
    handleBackToDashboard,
    completedProjects,
    filteredProjects,
    metrics,
    handleReactivate,
    handleArchive,
    handleView,
    containerVariants,
    navigateWithContext,
  } = useCompletedProjectsData();

  if (projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-border border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des projets terminés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-surface-1 to-surface-1" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 max-w-[1600px] mx-auto">
        <CompletedProjectsHeader
          mounted={mounted}
          fromDashboard={fromDashboard}
          handleBackToDashboard={handleBackToDashboard}
          completedProjectsCount={completedProjects.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard icon={Trophy} label="Total terminés" value={metrics.totalCompleted} color="emerald" delay={0.1} />
          <MetricCard icon={TrendingUp} label="CA généré" value={metrics.totalRevenue} suffix="€" color="amber" delay={0.15} />
          <MetricCard icon={Calendar} label="Ce mois-ci" value={metrics.thisMonth} color="cyan" delay={0.2} />
          <MetricCard icon={Briefcase} label="Ce trimestre" value={metrics.thisQuarter} color="violet" delay={0.25} />
        </div>

        <SearchFiltersBar
          mounted={mounted}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          completedProjectsCount={completedProjects.length}
          thisMonthCount={metrics.thisMonth}
          thisQuarterCount={metrics.thisQuarter}
        />

        {searchTerm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredProjects.length} résultat{filteredProjects.length > 1 ? 's' : ''} pour "{searchTerm}"
            </p>
          </motion.div>
        )}

        {filteredProjects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onReactivate={() => handleReactivate(project.id)}
                onArchive={() => handleArchive(project.id)}
                onView={() => handleView(project.id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-surface-2/50 border border-border/50 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'Aucun projet trouvé' : 'Aucun projet terminé'}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchTerm
                ? `Aucun projet terminé ne correspond à "${searchTerm}".`
                : "Les projets marqués comme terminés apparaîtront ici. C'est l'endroit idéal pour consulter votre historique de succès."
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => navigateWithContext('projects')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Voir tous les projets
              </Button>
            )}
          </motion.div>
        )}

        {completedProjects.length >= 10 && !searchTerm && filterPeriod === 'all' && (
          <CelebrationBanner
            completedCount={completedProjects.length}
            totalRevenue={metrics.totalRevenue}
            onContinue={() => navigateWithContext('projects')}
          />
        )}
      </div>
    </div>
  );
}
