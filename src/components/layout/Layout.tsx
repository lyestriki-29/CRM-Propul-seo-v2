import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { useStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from '../mobile/BottomNav';
import { MobileNavFAB } from '../mobile/MobileNavFAB';
import { Dashboard } from '../../modules/Dashboard';
import { Lock, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProjectsV2Provider } from '../../modules/ProjectsManagerV2/context/ProjectsV2Context';

// Lazy load heavy modules
const CRM = lazy(() => import('../../modules/CRM').then(m => ({ default: m.CRM })));
const CRMBotOne = lazy(() => import('../../modules/CRMBotOne').then(m => ({ default: m.CRMBotOne })));
const ClientDetailsBotOne = lazy(() => import('../../pages/ClientDetailsBotOne').then(m => ({ default: m.ClientDetailsBotOne })));
const ProjectsManager = lazy(() => import('../../modules/ProjectsManager').then(m => ({ default: m.ProjectsManager })));
const CompletedProjectsManager = lazy(() => import('../../modules/CompletedProjectsManager').then(m => ({ default: m.CompletedProjectsManager })));
const Accounting = lazy(() => import('../../modules/Accounting').then(m => ({ default: m.Accounting })));
const Contacts = lazy(() => import('../../modules/Contacts'));
const Settings = lazy(() => import('../../modules/Settings').then(m => ({ default: m.Settings })));
const CRMERP = lazy(() => import('../../modules/CRMERP').then(m => ({ default: m.CRMERP })));
const CRMERPLeadDetails = lazy(() => import('../../modules/CRMERPLeadDetails').then(m => ({ default: m.CRMERPLeadDetails })));
const Communication = lazy(() => import('../../modules/Communication').then(m => ({ default: m.Communication })));
const CommunicationKPI = lazy(() => import('../../modules/CommunicationKPI').then(m => ({ default: m.CommunicationKPI })));
const PersonalTasks = lazy(() => import('../../modules/PersonalTasks').then(m => ({ default: m.PersonalTasks })));
const CommunicationClients = lazy(() => import('../../modules/CommunicationClients').then(m => ({ default: m.CommunicationClients })));
const ProjectsManagerV2 = lazy(() => import('../../modules/ProjectsManagerV2').then(m => ({ default: m.ProjectsManagerV2 })))
const DashboardV2 = lazy(() => import('../../modules/DashboardV2').then(m => ({ default: m.DashboardV2 })))
const SiteWebManager = lazy(() => import('../../modules/SiteWebManager').then(m => ({ default: m.SiteWebManager })))
const ERPManager = lazy(() => import('../../modules/ERPManager').then(m => ({ default: m.ERPManager })))
const CommunicationManager = lazy(() => import('../../modules/CommunicationManager').then(m => ({ default: m.CommunicationManager })))

// Loading component
const ModuleLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
      <p className="text-muted-foreground text-sm">Chargement...</p>
    </div>
  </div>
);

export function Layout() {
  const { activeModule, setActiveModule, sidebarCollapsed } = useStore();
  const { user } = useAuth();
  const { getUserByAuthId } = useUsers();
  const isMobile = useIsMobile();
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  // Dashboard V2 est la nouvelle page d'accueil
  useEffect(() => {
    if (!activeModule || activeModule === 'dashboard') {
      setActiveModule('dashboard-v2');
    }
  }, []);

  // Force dark mode permanently
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Scroll to top on module change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [activeModule]);

  // Charger les données utilisateur pour vérifier les permissions
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserByAuthId(user.id);
        setCurrentUserData(userData);
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, getUserByAuthId]);

  // Rediriger vers le premier module accessible si le module actif n'est pas autorisé
  useEffect(() => {
    if (!currentUserData || loading) return;
    if (currentUserData.role === 'admin') return;

    const modulePermissions: { [key: string]: string } = {
      'dashboard': 'can_view_dashboard',
      'crm': 'can_view_leads',
      'crm-bot-one': 'can_view_crm_bot_one',
      'crm-erp': 'can_view_crm_erp',
      'projects': 'can_view_projects',
      'communication': 'can_view_communication',
      'communication-kpi': 'can_view_communication',
      'communication-clients': 'can_view_communication',
      'accounting': 'can_view_finance',
      'settings': 'can_view_settings',
      'dashboard-v2': 'can_view_dashboard',
      'site-web': 'can_view_projects',
      'erp-manager': 'can_view_projects',
      'comm-manager': 'can_view_projects',
    };

    // Ordre de priorité pour la redirection (même ordre que la sidebar)
    const modulePriority = [
      'dashboard', 'dashboard-v2', 'site-web', 'erp-manager', 'comm-manager',
      'crm', 'crm-bot-one', 'crm-erp',
      'projects', 'projects-v2',
      'communication', 'communication-kpi',
      'communication-clients', 'accounting', 'settings'
    ];

    const canAccess = (mod: string) => {
      const perm = modulePermissions[mod];
      return perm ? currentUserData[perm] === true : true;
    };

    if (!canAccess(activeModule)) {
      const firstAccessible = modulePriority.find(m => canAccess(m));
      if (firstAccessible) {
        console.log(`🔄 Redirection: ${activeModule} → ${firstAccessible} (permissions)`);
        setActiveModule(firstAccessible);
      }
    }
  }, [currentUserData, loading, activeModule, setActiveModule]);

  // Vérifier si l'utilisateur peut accéder à un module
  const canAccessModule = (module: string) => {
    if (!currentUserData) return true;
    if (currentUserData.role === 'admin') return true;

    const modulePermissions: { [key: string]: string } = {
      'dashboard': 'can_view_dashboard',
      'crm': 'can_view_leads',
      'crm-bot-one': 'can_view_crm_bot_one',
      'client-details-bot-one': 'can_view_crm_bot_one',
      'crm-erp': 'can_view_crm_erp',
      'crm-erp-lead-details': 'can_view_crm_erp',
      'projects': 'can_view_projects',
      'accounting': 'can_view_finance',
      'settings': 'can_view_settings',
      'communication': 'can_view_communication',
      'communication-kpi': 'can_view_communication',
      'communication-clients': 'can_view_communication',
      'dashboard-v2': 'can_view_dashboard',
      'site-web': 'can_view_projects',
      'erp-manager': 'can_view_projects',
      'comm-manager': 'can_view_projects',
    };

    const permission = modulePermissions[module];
    return permission ? currentUserData[permission] === true : true;
  };

  const renderModule = () => {
    if (!canAccessModule(activeModule)) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Lock className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Acces non autorise</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions necessaires pour acceder a ce module.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Contactez l'administrateur pour obtenir l'acces.
          </p>
          {currentUserData && (
            <div className="mt-4 p-3 bg-surface-2 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Utilisateur:</strong> {currentUserData.email}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Module demande:</strong> {activeModule}
              </p>
            </div>
          )}
        </div>
      );
    }

    const wrappedComponent = (Component: React.ComponentType) => (
      Component ? <Suspense fallback={<ModuleLoader />}><Component /></Suspense> : null
    );

    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'crm':
        return wrappedComponent(CRM);
      case 'crm-bot-one':
        return wrappedComponent(CRMBotOne);
      case 'client-details-bot-one':
        return wrappedComponent(ClientDetailsBotOne);
      case 'accounting':
        return wrappedComponent(Accounting);
      case 'projects':
        return wrappedComponent(ProjectsManager);
      case 'completed-projects':
        return wrappedComponent(CompletedProjectsManager);
      case 'settings':
        return wrappedComponent(Settings);
      case 'crm-erp':
        return wrappedComponent(CRMERP);
      case 'crm-erp-lead-details':
        return wrappedComponent(CRMERPLeadDetails);
      case 'contacts':
        return wrappedComponent(Contacts);
      case 'communication':
        return wrappedComponent(Communication);
      case 'communication-kpi':
        return wrappedComponent(CommunicationKPI);
      case 'personal-tasks':
        return wrappedComponent(PersonalTasks);
      case 'communication-clients':
        return wrappedComponent(CommunicationClients);
      case 'projects-v2':
        return wrappedComponent(ProjectsManagerV2);
      case 'dashboard-v2':
        return wrappedComponent(DashboardV2);
      case 'site-web':
        return <ProjectsV2Provider><Suspense fallback={<ModuleLoader />}><SiteWebManager /></Suspense></ProjectsV2Provider>;
      case 'erp-manager':
        return <ProjectsV2Provider><Suspense fallback={<ModuleLoader />}><ERPManager /></Suspense></ProjectsV2Provider>;
      case 'comm-manager':
        return <ProjectsV2Provider><Suspense fallback={<ModuleLoader />}><CommunicationManager /></Suspense></ProjectsV2Provider>;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex h-screen bg-surface-1 transition-colors duration-200 overflow-hidden",
      isMobile && "flex-col"
    )}>
      {/* Sidebar - Desktop only */}
      {!isMobile && <Sidebar />}

      {/* Main content area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        isMobile && "h-full"
      )}>
        {/* Header - Desktop only */}
        {!isMobile && <Header />}

        {/* Main content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden scroll-touch branded-bg",
            isMobile && "pb-16"
          )}
          ref={mainRef}
        >
          {renderModule()}
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      {isMobile && <BottomNav />}

      {/* Floating Nav FAB - Mobile only */}
      <MobileNavFAB />
    </div>
  );
}
