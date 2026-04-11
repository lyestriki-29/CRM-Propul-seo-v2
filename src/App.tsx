import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useStore } from './store/useStore';

const ClientPortalPage = lazy(() =>
  import('./modules/ClientPortal/ClientPortalPage').then(m => ({ default: m.ClientPortalPage }))
);

const ClientBriefPage = lazy(() =>
  import('./modules/ClientBrief/ClientBriefPage').then(m => ({ default: m.ClientBriefPage }))
);

const ClientBriefInvitePage = lazy(() =>
  import('./modules/ClientBrief/ClientBriefInvitePage').then(m => ({ default: m.ClientBriefInvitePage }))
);

// Détection de la route publique avant tout rendu
const pathname = window.location.pathname;
const portalMatch = pathname.match(/^\/portal\/([a-f0-9-]{36})$/i);
const briefMatch = pathname.match(/^\/brief\/([a-f0-9-]{36})$/i);
const briefInviteMatch = pathname.match(/^\/brief-invite\/([a-f0-9-]{36})$/i);

function App() {
  const { setCurrentUser } = useStore();

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    // Utilisateur admin injecté directement (auth désactivée)
    setCurrentUser({
      id: 'dev-user',
      email: 'team@propulseo-site.com',
      name: 'Dev Admin',
      role: 'admin',
    });
  }, []);

  // Route publique — ne pas passer par le Layout authentifié
  if (portalMatch) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Chargement...</div>}>
          <ClientPortalPage token={portalMatch[1]} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (briefMatch) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400">Chargement...</div>}>
          <ClientBriefPage token={briefMatch[1]} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (briefInviteMatch) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400">Chargement...</div>}>
          <ClientBriefInvitePage token={briefInviteMatch[1]} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-surface-1">
        <Layout />
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}

export default App;
