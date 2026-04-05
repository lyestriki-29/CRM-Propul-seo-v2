import { Plus, RefreshCw, ArrowLeft, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store';

interface Props {
  onAddLead: () => void;
  onRefresh: () => void;
  loading: boolean;
  totalLeads: number;
}

export function CRMERPHeader({ onAddLead, onRefresh, loading, totalLeads }: Props) {
  const { setActiveModule, navigationContext } = useStore();
  const fromDashboard = navigationContext?.fromModule === 'dashboard';

  return (
    <div className="bg-gradient-to-r from-primary via-neon-light to-primary text-white px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {fromDashboard && (
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl" onClick={() => setActiveModule('dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-sm">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CRM - ERP & Logiciels</h1>
              <p className="text-sm text-white/70">{totalLeads} lead{totalLeads !== 1 ? 's' : ''} au total</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={onAddLead} className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/10 rounded-xl px-5">
            <Plus className="h-4 w-4 mr-1.5" />
            Nouveau Lead
          </Button>
        </div>
      </div>
    </div>
  );
}
