import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useStore } from './store/useStore';

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
