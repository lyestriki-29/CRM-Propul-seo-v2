import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { financialSyncService } from '../services/financialSyncService';
import { 
  RevenueEntry, 
  AccountingTransaction, 
  ProjectFinancialData, 
  FinancialSyncEvent,
  FinancialNotification
} from '../types/financial';

/**
 * Hook pour la synchronisation financière automatique
 * Gère le workflow : Projet signé → Revenus → Comptabilité
 */
export const useFinancialSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncEvents, setSyncEvents] = useState<FinancialSyncEvent[]>([]);
  const [notifications, setNotifications] = useState<FinancialNotification[]>([]);
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);
  const [accountingEntries, setAccountingEntries] = useState<AccountingTransaction[]>([]);
  const [projectFinancialData, setProjectFinancialData] = useState<ProjectFinancialData[]>([]);

  // Charger les données au montage
  useEffect(() => {
    loadFinancialData();
  }, []);

  // Écouter les événements de synchronisation
  useEffect(() => {
    const unsubscribeSync = financialSyncService.onSync((event) => {
      setSyncEvents(prev => [event, ...prev.slice(0, 49)]); // Garder les 50 derniers événements
      
      // Recharger les données après synchronisation
      if (event.success) {
        loadFinancialData();
      }
    });

    const unsubscribeNotifications = financialSyncService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 99)]); // Garder les 100 dernières notifications
    });

    return () => {
      unsubscribeSync();
      unsubscribeNotifications();
    };
  }, []);

  /**
   * Charger toutes les données financières
   */
  const loadFinancialData = useCallback(() => {
    try {
      const revenues = financialSyncService.getRevenueEntries();
      const accounting = financialSyncService.getAccountingEntries();
      const projectData = financialSyncService.getProjectFinancialData();

      setRevenueEntries(revenues);
      setAccountingEntries(accounting);
      setProjectFinancialData(projectData);
    } catch (error) {
      logger.error('Erreur lors du chargement des données financières:', error);
      setError('Erreur lors du chargement des données financières');
    }
  }, []);

  /**
   * Synchroniser un projet avec les finances
   */
  const syncProjectToFinances = useCallback(async (project: { id: string; name: string; budget?: number; clientId?: string; clientName?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const financialData = await financialSyncService.syncProjectToFinances(project);
      
      // Recharger les données
      loadFinancialData();
      
      return financialData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la synchronisation';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadFinancialData]);

  /**
   * Ajouter un projet aux revenus uniquement
   */
  const addToRevenue = useCallback(async (project: { id: string; name: string; budget?: number; clientId?: string; clientName?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const revenueEntry = await financialSyncService.addToRevenue(project);
      loadFinancialData();
      return revenueEntry;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout aux revenus';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadFinancialData]);

  /**
   * Mettre à jour la comptabilité uniquement
   */
  const updateAccounting = useCallback(async (project: { id: string; name: string; budget?: number; clientId?: string; clientName?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const accountingEntry = await financialSyncService.updateAccounting(project);
      loadFinancialData();
      return accountingEntry;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour comptable';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadFinancialData]);

  /**
   * Calculer le résumé financier
   */
  const getFinancialSummary = useCallback(() => {
    return financialSyncService.calculateFinancialSummary();
  }, []);

  /**
   * Marquer une notification comme lue
   */
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  /**
   * Supprimer une notification
   */
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  }, []);

  /**
   * Effacer toutes les notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Obtenir les revenus par projet
   */
  const getRevenuesByProject = useCallback((projectId: string) => {
    return revenueEntries.filter(entry => entry.project_id === projectId);
  }, [revenueEntries]);

  /**
   * Obtenir les entrées comptables par projet
   */
  const getAccountingByProject = useCallback((projectId: string) => {
    return accountingEntries.filter(entry => entry.reference_id === projectId);
  }, [accountingEntries]);

  /**
   * Obtenir les données financières d'un projet
   */
  const getProjectFinancialDataById = useCallback((projectId: string) => {
    return projectFinancialData.find(data => data.project_id === projectId);
  }, [projectFinancialData]);

  /**
   * Obtenir les revenus par client
   */
  const getRevenuesByClient = useCallback((clientId: string) => {
    return revenueEntries.filter(entry => entry.client_id === clientId);
  }, [revenueEntries]);

  /**
   * Obtenir les statistiques par catégorie
   */
  const getRevenuesByCategory = useCallback(() => {
    const categories = revenueEntries.reduce((acc, entry) => {
      if (!acc[entry.category]) {
        acc[entry.category] = { total: 0, count: 0 };
      }
      acc[entry.category].total += entry.amount;
      acc[entry.category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return Object.entries(categories).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: revenueEntries.length > 0 ? (data.count / revenueEntries.length) * 100 : 0,
    }));
  }, [revenueEntries]);

  /**
   * Obtenir les notifications non lues
   */
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  /**
   * Obtenir les événements de synchronisation récents
   */
  const getRecentSyncEvents = useCallback((limit: number = 10) => {
    return syncEvents.slice(0, limit);
  }, [syncEvents]);

  /**
   * Vérifier si un projet est déjà synchronisé
   */
  const isProjectSynced = useCallback((projectId: string) => {
    return projectFinancialData.some(data => data.project_id === projectId);
  }, [projectFinancialData]);

  /**
   * Obtenir les métriques de performance
   */
  const getPerformanceMetrics = useCallback(() => {
    const summary = getFinancialSummary();
    const successfulSyncs = syncEvents.filter(event => event.success).length;
    const totalSyncs = syncEvents.length;
    const syncSuccessRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;

    return {
      ...summary,
      syncSuccessRate,
      totalSyncEvents: totalSyncs,
      successfulSyncs,
      failedSyncs: totalSyncs - successfulSyncs,
      recentActivity: syncEvents.slice(0, 5),
    };
  }, [syncEvents, getFinancialSummary]);

  return {
    // État
    isLoading,
    error,
    syncEvents,
    notifications,
    revenueEntries,
    accountingEntries,
    projectFinancialData,
    
    // Actions principales
    syncProjectToFinances,
    addToRevenue,
    updateAccounting,
    
    // Utilitaires
    loadFinancialData,
    getFinancialSummary,
    getPerformanceMetrics,
    
    // Notifications
    markNotificationAsRead,
    removeNotification,
    clearAllNotifications,
    getUnreadNotifications,
    
    // Requêtes de données
    getRevenuesByProject,
    getAccountingByProject,
    getProjectFinancialDataById,
    getRevenuesByClient,
    getRevenuesByCategory,
    getRecentSyncEvents,
    isProjectSynced,
    
    // Métriques
    unreadNotificationsCount: getUnreadNotifications().length,
    totalRevenue: revenueEntries.reduce((sum, entry) => sum + entry.amount, 0),
    totalProjects: projectFinancialData.length,
    averageProjectValue: projectFinancialData.length > 0 
      ? projectFinancialData.reduce((sum, data) => sum + data.total_budget, 0) / projectFinancialData.length 
      : 0,
  };
}; 