import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { routes } from '../../../lib/routes';
import { useSupabaseProjects } from '../../../hooks/useSupabaseData';

export function useCompletedProjectsData() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: allProjects, loading: projectsLoading } = useSupabaseProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fromDashboard = searchParams.get('from') === 'dashboard';

  const handleBackToDashboard = () => {
    navigate(routes.dashboard);
  };

  const completedProjects = useMemo(() => {
    return allProjects?.filter(project => project.status === 'completed') || [];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = completedProjects;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name?.toLowerCase().includes(term) ||
        (project as any).client_name?.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term)
      );
    }

    if (filterPeriod !== 'all') {
      const now = new Date();
      filtered = filtered.filter(project => {
        const completedDate = new Date(project.updated_at);
        switch (filterPeriod) {
          case 'month':
            return completedDate.getMonth() === now.getMonth() &&
                   completedDate.getFullYear() === now.getFullYear();
          case 'quarter': {
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const projectQuarter = Math.floor(completedDate.getMonth() / 3);
            return projectQuarter === currentQuarter &&
                   completedDate.getFullYear() === now.getFullYear();
          }
          case 'year':
            return completedDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [completedProjects, searchTerm, filterPeriod]);

  const metrics = useMemo(() => {
    const now = new Date();
    return {
      totalCompleted: completedProjects.length,
      thisMonth: completedProjects.filter(p => {
        const completedDate = new Date(p.updated_at);
        return completedDate.getMonth() === now.getMonth() &&
               completedDate.getFullYear() === now.getFullYear();
      }).length,
      thisQuarter: completedProjects.filter(p => {
        const completedDate = new Date(p.updated_at);
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const projectQuarter = Math.floor(completedDate.getMonth() / 3);
        return projectQuarter === currentQuarter &&
               completedDate.getFullYear() === now.getFullYear();
      }).length,
      totalRevenue: completedProjects.reduce((sum, p) => sum + (p.budget || 0), 0)
    };
  }, [completedProjects]);

  const handleReactivate = (projectId: string) => {
    console.log('Réactiver projet:', projectId);
  };

  const handleArchive = (projectId: string) => {
    console.log('Archiver projet:', projectId);
  };

  const handleView = (projectId: string) => {
    navigate(`${routes.projects}?p=${projectId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  return {
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
    navigate,
  };
}
