import { useState, useEffect } from 'react';
import { Euro, RotateCcw, CheckCircle, AlertCircle, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { FinancialSyncService } from '../../services/financialSyncService';
import { useStore } from '../../store/useStore';

interface ProjectBudgetInputProps {
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  initialBudget?: number;
  onBudgetChange?: (newBudget: number) => void;
  className?: string;
}

export const ProjectBudgetInput: React.FC<ProjectBudgetInputProps> = ({
  projectId,
  projectName,
  clientId,
  clientName,
  initialBudget = 0,
  onBudgetChange,
  className = ''
}) => {
  const [budget, setBudget] = useState(initialBudget);
  const [isUpdating, setIsUpdating] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const { updateProject } = useStore();
  
  const financialSyncService = FinancialSyncService.getInstance();

  // Synchroniser le budget avec les finances
  const handleBudgetSync = async (newBudget: number) => {
    if (newBudget === initialBudget) return; // Pas de changement
    
    setIsUpdating(true);
    setSyncStatus('syncing');
    
    try {
      // 1. Mettre à jour le projet dans le store
      updateProject(projectId, { budget: newBudget });
      
      // 2. Synchroniser avec les finances seulement si auto-sync activé
      if (autoSyncEnabled) {
        const syncResult = await financialSyncService.syncProjectBudget(
          projectId,
          newBudget,
          projectName,
          clientId,
          clientName
        );
        
        if (syncResult.success) {
          setSyncStatus('success');
          setLastSyncTime(new Date().toLocaleTimeString());
          
          // Feedback utilisateur
          toast.success('Budget synchronisé', {
            description: `Budget de ${newBudget}€ synchronisé avec revenus et comptabilité`,
            duration: 3000,
          });
          
          // Recalculer les totaux comptables
          await financialSyncService.recalculateAccountingTotals();
          
        } else {
          setSyncStatus('error');
          toast.error('Erreur de synchronisation', {
            description: 'Échec de la synchronisation du budget avec les finances',
            duration: 5000,
          });
        }
      } else {
        // Si auto-sync désactivé, juste mettre à jour le projet
        setSyncStatus('success');
        setLastSyncTime(new Date().toLocaleTimeString());
        
        toast.success('Budget mis à jour', {
          description: `Budget de ${newBudget}€ mis à jour (synchronisation désactivée)`,
          duration: 3000,
        });
      }
      
      // Callback externe
      onBudgetChange?.(newBudget);
      
    } catch (error) {
      console.error('Erreur lors de la synchronisation budget:', error);
      setSyncStatus('error');
      toast.error('Erreur de synchronisation', {
        description: 'Erreur inattendue lors de la synchronisation',
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Gérer le changement de budget (onBlur)
  const handleBudgetChange = async () => {
    if (budget !== initialBudget && budget >= 0) {
      await handleBudgetSync(budget);
    }
  };

  // Gérer la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBudgetChange();
    }
  };

  // Synchronisation manuelle
  const handleManualSync = async () => {
    await handleBudgetSync(budget);
  };

  // Effet pour réinitialiser le statut après un délai
  useEffect(() => {
    if (syncStatus === 'success' || syncStatus === 'error') {
      const timer = setTimeout(() => {
        setSyncStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus]);

  // Icône de statut
  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Euro className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Badge de statut
  const getStatusBadge = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Badge variant="secondary" className="text-blue-600">Synchronisation...</Badge>;
      case 'success':
        return <Badge variant="secondary" className="text-green-600">Synchronisé</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={`budget-${projectId}`} className="text-sm font-medium">
          Budget Total
        </Label>
        
        {/* Toggle Auto-Sync */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={autoSyncEnabled}
            onCheckedChange={setAutoSyncEnabled}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className="text-xs text-muted-foreground">
            {autoSyncEnabled ? 'Auto-sync activé' : 'Auto-sync désactivé'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {getStatusIcon()}
          </div>
          <Input
            id={`budget-${projectId}`}
            type="number"
            value={budget}
            onChange={(e) => {
              const value = Number(e.target.value);
              setBudget(value >= 0 ? value : 0);
            }}
            onBlur={handleBudgetChange}
            onKeyPress={handleKeyPress}
            disabled={isUpdating}
            className="pl-10 pr-8"
            placeholder="Montant en €"
            min="0"
            step="100"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-sm text-muted-foreground">€</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualSync}
          disabled={isUpdating || budget === initialBudget}
          className="flex items-center space-x-1"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Sync</span>
        </Button>
      </div>
      
      {/* Statut et informations */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          {lastSyncTime && (
            <span>Dernière sync: {lastSyncTime}</span>
          )}
        </div>
        
        {budget !== initialBudget && (
          <span className="text-amber-600">
            Changement non synchronisé
          </span>
        )}
      </div>
      
      {/* Aide contextuelle */}
      <div className="text-xs text-muted-foreground bg-surface-2 p-2 rounded">
        {autoSyncEnabled ? (
          <>
            💡 La modification du budget synchronise automatiquement les revenus et la comptabilité.
            <br />
            <span className="text-blue-600">Type: "Projet" | Description: "Budget projet: {projectName}"</span>
          </>
        ) : (
          <>
            ⚠️ Synchronisation désactivée. Le budget sera mis à jour localement uniquement.
            <br />
            <span className="text-orange-600">Utilisez le bouton "Sync" pour synchroniser manuellement.</span>
          </>
        )}
      </div>
    </div>
  );
}; 