import { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import {
  useSupabaseContacts,
  useSupabaseProjects,
  useSupabaseTasks,
  useSupabaseAccountingEntries,
  useSupabaseLeads,
} from '../../../hooks/useSupabaseData';

export function useDashboardData() {
  const { navigateWithContext, dashboardObjectives } = useStore();
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

  const handleNavigateToAccounting = () => {
    navigateWithContext('accounting', {
      highlightedData: ['revenue-chart'],
      filters: { period: 'monthly' },
    });
  };

  const handleNavigateToCRM = () => {
    navigateWithContext('crm', { filters: { status: 'all' } });
  };

  const handleNavigateToProjects = () => {
    navigateWithContext('projects', {});
  };

  const handleNavigateToTasks = () => {
    navigateWithContext('tasks', {});
  };

  const formattedDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    mounted,
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
  };
}
