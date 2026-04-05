import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { MobileHeader } from '../../components/mobile/MobileHeader';
import { ObjectivesModal } from './ObjectivesModal';
import { cn } from '../../lib/utils';
import { containerVariants } from './lib/animations';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardHeader } from './components/DashboardHeader';
import { RevenueCard } from './components/RevenueCard';
import { ContactsCard } from './components/ContactsCard';
import { ProjectsCard } from './components/ProjectsCard';
import { TasksCard } from './components/TasksCard';
import { QuickStatsCard } from './components/QuickStatsCard';
import { UrgentTasksAlert } from './components/UrgentTasksAlert';
import { RevenueChartSection } from './components/RevenueChartSection';
import { ObjectivesSection } from './components/ObjectivesSection'
import { AiSummariesSection } from './components/AiSummariesSection'
import { UpcomingMeetingsCard } from './components/UpcomingMeetingsCard';

export function Dashboard() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [showObjectivesModal, setShowObjectivesModal] = useState(false);
  const isMobile = useIsMobile();
  const data = useDashboardData();

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {isMobile && (
        <MobileHeader
          title="Tableau de bord"
          actions={
            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className={cn("p-2 rounded-full transition-colors", isPrivacyMode ? "text-rose-400" : "text-muted-foreground")}
            >
              {isPrivacyMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />
      )}

      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-2 via-surface-1 to-surface-1" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        {!isMobile && (
          <>
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-neon-glow/5 rounded-full blur-3xl" />
          </>
        )}
      </div>

      <div className={cn("relative z-10 max-w-[1600px] mx-auto", isMobile ? "p-4" : "p-6 lg:p-8")}>
        {!isMobile && (
          <DashboardHeader
            mounted={data.mounted}
            formattedDate={data.formattedDate}
            isPrivacyMode={isPrivacyMode}
            onTogglePrivacy={() => setIsPrivacyMode(!isPrivacyMode)}
          />
        )}

        <motion.div
          className={cn("grid gap-3 md:gap-4 lg:gap-6", isMobile ? "grid-cols-2" : "grid-cols-12")}
          variants={containerVariants}
          initial="hidden"
          animate={data.mounted ? "visible" : "hidden"}
        >
          <RevenueCard
            currentYear={data.currentYear}
            currentYearRevenue={data.currentYearRevenue}
            accountingLoading={data.accountingLoading}
            isPrivacyMode={isPrivacyMode}
            isMobile={isMobile}
            onClick={data.handleNavigateToAccounting}
          />
          <ContactsCard
            contactsCount={data.contactsCount}
            leadsCount={data.leadsCount}
            isPrivacyMode={isPrivacyMode}
            isMobile={isMobile}
            onClick={data.handleNavigateToCRM}
          />
          <ProjectsCard
            projectsCount={data.projectsCount}
            activeProjectsCount={data.activeProjectsCount}
            isPrivacyMode={isPrivacyMode}
            isMobile={isMobile}
            onClick={data.handleNavigateToProjects}
          />
          <TasksCard
            urgentTasks={data.urgentTasks}
            pendingTasks={data.pendingTasks}
            isPrivacyMode={isPrivacyMode}
            isMobile={isMobile}
            onClick={data.handleNavigateToTasks}
          />
          <QuickStatsCard isPrivacyMode={isPrivacyMode} isMobile={isMobile} />
          {!isPrivacyMode && (
            <UrgentTasksAlert
              urgentTasks={data.urgentTasks}
              isMobile={isMobile}
              onNavigateToTasks={data.handleNavigateToTasks}
            />
          )}
          <UpcomingMeetingsCard isMobile={isMobile} />
          <RevenueChartSection
            isPrivacyMode={isPrivacyMode}
            isMobile={isMobile}
            accountingLoading={data.accountingLoading}
            accountingEntries={data.accountingEntries}
            onNavigateToAccounting={data.handleNavigateToAccounting}
          />
          <ObjectivesSection
            objectives={data.objectives}
            isPrivacyMode={isPrivacyMode}
            isMobile={isMobile}
            onOpenModal={() => setShowObjectivesModal(true)}
          />
          {!isPrivacyMode && (
            <AiSummariesSection
              projects={(data.projects ?? []) as any}
              isMobile={isMobile}
              onNavigateToProject={data.handleNavigateToProject}
            />
          )}
        </motion.div>
      </div>

      <ObjectivesModal open={showObjectivesModal} onClose={() => setShowObjectivesModal(false)} />
    </div>
  );
}
