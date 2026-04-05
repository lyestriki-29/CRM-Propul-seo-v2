import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { FinancialSyncService } from '../services/financialSyncService';
import { useStore } from '../store/useStore';

interface UseProjectBudgetOptions {
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  initialBudget?: number;
  autoSync?: boolean;
}

interface UseProjectBudgetReturn {
  budget: number;
  setBudget: (value: number) => void;
  isSyncing: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  syncBudget: () => Promise<void>;
  resetBudget: () => void;
}

export const useProjectBudget = ({
  projectId,
  projectName,
  clientId,
  clientName,
  initialBudget = 0,
  autoSync = true
}: UseProjectBudgetOptions): UseProjectBudgetReturn => {
  const [budget, setBudget] = useState(initialBudget);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  
  const { updateProject } = useStore();
  const financialSyncService = FinancialSyncService.getInstance();

  // Synchroniser le budget avec la comptabilité
  const syncBudget = useCallback(async () => {
    if (budget === initialBudget) return; // Pas de changement
    
    setIsSyncing(true);
    setSyncStatus('syncing');
    
    try {
      // 1. Mettre à jour le projet dans le store
      updateProject(projectId, { budget });
      
      // 2. Synchroniser avec les finances
      const syncResult = await financialSyncService.syncProjectBudget(
        projectId,
        budget,
        projectName,
        clientId,
        clientName
      );
      
      if (syncResult.success) {
        setSyncStatus('success');
        setLastSyncTime(new Date().toLocaleTimeString());
        
        // Feedback utilisateur
        toast.success('Budget synchronisé', {
          description: `Budget de ${budget}€ synchronisé avec revenus et comptabilité`,
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
      
    } catch (error) {
      logger.error('Erreur lors de la synchronisation budget:', error);
      setSyncStatus('error');
      toast.error('Erreur de synchronisation', {
        description: 'Erreur inattendue lors de la synchronisation',
        duration: 5000,
      });
    } finally {
      setIsSyncing(false);
    }
  }, [budget, initialBudget, projectId, projectName, clientId, clientName, updateProject, financialSyncService]);

  // Réinitialiser le budget
  const resetBudget = useCallback(() => {
    setBudget(initialBudget);
    setSyncStatus('idle');
    setLastSyncTime(null);
  }, [initialBudget]);

  // Auto-sync si activé
  useEffect(() => {
    if (autoSync && budget !== initialBudget && budget > 0) {
      const timer = setTimeout(() => {
        syncBudget();
      }, 1000); // Délai de 1 seconde pour éviter les syncs trop fréquents
      
      return () => clearTimeout(timer);
    }
  }, [budget, initialBudget, autoSync, syncBudget]);

  // Réinitialiser le statut après un délai
  useEffect(() => {
    if (syncStatus === 'success' || syncStatus === 'error') {
      const timer = setTimeout(() => {
        setSyncStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus]);

  return {
    budget,
    setBudget,
    isSyncing,
    syncStatus,
    lastSyncTime,
    syncBudget,
    resetBudget
  };
}; 