import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { routes } from '../../../lib/routes';
import {
  useSupabaseContacts,
  useSupabaseProjects,
  useSupabaseTasks,
  useSupabaseAccountingEntries,
  useSupabaseLeads,
} from '../../../hooks/useSupabaseData';

export function useDashboardData() {
  const navigate = useNavigate();
  const { dashboardObjectives } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { count: contactsCount } = useSupabaseContacts();
  const { data: projects, count: projectsCount } = useSupabaseProjects();
  const { data: tasks } = useSupabaseTasks();
  const { data: accountingEntries, loading: accountingLoading } = useSupabaseAccountingEntries();
  const { count: leadsCount } = useSupabaseLeads();

  const currentYear = new Date().getFullYear();
  let currentYearRevenue = 0;
  try {
    currentYearRevenue = accountingEntries
      ?.filter(entry => {
        const e = entry as any;
        const entryYear = e.month_key ? parseInt(e.month_key.split('-')[0]) : new Date(entry.created_at).getFullYear();
        return entryYear === currentYear && entry.type === 'revenue';
      })
      ?.reduce((sum, entry) => sum + parseFloat(String(entry.amount) || '0'), 0) || 0;
  } catch {
    currentYearRevenue = 0;
  }

  const activeProjectsCount = projects?.filter(p =>
    p.status === 'active' ||
    p.status === 'in_progress' ||
    p.status === 'ongoing' ||
    p.status === 'started'
  )?.length || 0;

  const urgentTasks = tasks?.filter(t => (t as any).priority === 'urgent' && (t.status as string) !== 'completed') || [];
  const pendingTasks = tasks?.filter(t => (t.status as string) === 'pending' || t.status === 'in_progress') || [];

  const objectives = dashboardObjectives.map(obj => {
    let current = 0;
    switch (obj.type) {
      case 'revenue':
        current = currentYearRevenue;
        break;
      case 'projects':
        current = projectsCount || 0;
        break;
      case 'activeProjects':
        current = activeProjectsCount;
        break;
      default:
        current = 0;
    }
    return { ...obj, current };
  });

  const handleNavigateToAccounting = () => navigate(routes.accounting);
  const handleNavigateToCRM = () => navigate(routes.crm);
  const handleNavigateToProjects = () => navigate(routes.projectsLegacy);
  const handleNavigateToTasks = () => navigate(routes.personalTasks);
  const handleNavigateToProject = (id: string) => navigate(`${routes.projects}?p=${id}`);

  const formattedDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    mounted,
    projects,
    currentYear,
    currentYearRevenue,
    contactsCount,
    leadsCount,
    projectsCount,
    activeProjectsCount,
    urgentTasks,
    pendingTasks,
    objectives,
    accountingEntries,
    accountingLoading,
    formattedDate,
    handleNavigateToAccounting,
    handleNavigateToCRM,
    handleNavigateToProjects,
    handleNavigateToTasks,
    handleNavigateToProject,
  };
}
