import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  value: number;
  status: string;
  source?: string;
  assigned_to?: string;
  notes?: string;
  pipeline_stage: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface PipelineColumn {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
}

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    id: 'presentation_envoyee',
    title: 'Présentation envoyée',
    color: 'bg-blue-50 border-blue-200',
    leads: []
  },
  {
    id: 'rdv_booke',
    title: 'RDV booké',
    color: 'bg-yellow-50 border-yellow-200',
    leads: []
  },
  {
    id: 'en_attente',
    title: 'En attente',
    color: 'bg-orange-50 border-orange-200',
    leads: []
  },
  {
    id: 'offre_envoyee',
    title: 'Offre envoyée',
    color: 'bg-purple-50 border-purple-200',
    leads: []
  }
];

export const useKanbanPipeline = () => {
  const [columns, setColumns] = useState<PipelineColumn[]>(PIPELINE_COLUMNS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les leads depuis Supabase
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('pipeline_stage')
        .order('position');

      if (fetchError) throw fetchError;

      // Organiser les leads par colonne
      const updatedColumns = PIPELINE_COLUMNS.map(column => ({
        ...column,
        leads: data?.filter(lead => lead.pipeline_stage === column.id) || []
      }));

      setColumns(updatedColumns);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      toast.error('Erreur lors du chargement des leads: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter un nouveau lead
  const addLead = useCallback(async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const targetColumn = columns.find(col => col.id === leadData.pipeline_stage);
      const newPosition = (targetColumn?.leads.length || 0) + 1;

      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...leadData,
          position: newPosition
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Lead ajouté avec succès');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error('Erreur lors de l\'ajout du lead: ' + errorMessage);
      throw err;
    }
  }, [columns]);

  // Mettre à jour un lead
  const updateLead = useCallback(async (leadId: string, updates: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Lead mis à jour avec succès');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error('Erreur lors de la mise à jour: ' + errorMessage);
      throw err;
    }
  }, []);

  // Supprimer un lead
  const deleteLead = useCallback(async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      toast.success('Lead supprimé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error('Erreur lors de la suppression: ' + errorMessage);
      throw err;
    }
  }, []);

  // Déplacer un lead (drag & drop)
  const moveLead = useCallback(async (
    leadId: string, 
    sourceColumnId: string, 
    destinationColumnId: string, 
    destinationIndex: number
  ) => {
    try {
      // Mettre à jour dans Supabase
      const { error } = await supabase
        .from('leads')
        .update({
          pipeline_stage: destinationColumnId,
          status: destinationColumnId,
          position: destinationIndex + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      toast.success('Lead déplacé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      toast.error('Erreur lors du déplacement: ' + errorMessage);
      throw err;
    }
  }, []);

  // Obtenir les statistiques du pipeline
  const getPipelineStats = useCallback(() => {
    const stats = {
      totalLeads: 0,
      totalValue: 0,
      conversionRate: 0,
      columnStats: {} as Record<string, { count: number; value: number }>
    };

    columns.forEach(column => {
      const count = column.leads.length;
      const value = column.leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
      
      stats.totalLeads += count;
      stats.totalValue += value;
      stats.columnStats[column.id] = { count, value };
    });

    // Calculer le taux de conversion (leads dans les dernières colonnes)
    const advancedLeads = (stats.columnStats['offre_envoyee']?.count || 0);
    stats.conversionRate = stats.totalLeads > 0 ? (advancedLeads / stats.totalLeads) * 100 : 0;

    return stats;
  }, [columns]);

  // Charger les leads au montage et s'abonner aux changements
  useEffect(() => {
    fetchLeads();

    // Abonnement temps réel
    const subscription = supabase
      .channel('kanban_pipeline_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          logger.debug('🔄 Changement lead détecté:', payload);
          fetchLeads(); // Recharger les données
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchLeads]);

  return {
    columns,
    loading,
    error,
    addLead,
    updateLead,
    deleteLead,
    moveLead,
    getPipelineStats,
    refreshData: fetchLeads
  };
}; 