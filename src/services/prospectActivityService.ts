import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ProspectActivity, CreateProspectActivityData, UpdateProspectActivityData } from '@/types/prospect-activity';
import { parisToUtc } from '@/utils/timezone';

export class ProspectActivityService {
  
  /**
   * Récupérer toutes les activités d'un prospect
   */
  static async getActivitiesByProspect(prospectId: string): Promise<ProspectActivity[]> {
    logger.debug('🔍 Fetching activities for prospect:', prospectId);
    
    const { data, error } = await supabase
      .from('prospect_activities')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('activity_date', { ascending: false });
    
    if (error) {
      logger.error('❌ Error fetching prospect activities:', error);
      throw error;
    }
    
    logger.debug('✅ Activities fetched:', data?.length || 0);
    return data as ProspectActivity[];
  }

  /**
   * Créer une nouvelle activité
   */
  static async createActivity(activityData: CreateProspectActivityData): Promise<ProspectActivity> {
    logger.debug('🔥 Creating prospect activity:', activityData);
    
    // La date est déjà en UTC si elle vient de createFrenchDateTime
    // Sinon, on la convertit en UTC
    const activityDataUtc = {
      ...activityData,
      activity_date: activityData.activity_date.includes('+') || activityData.activity_date.includes('Z') 
        ? activityData.activity_date 
        : parisToUtc(activityData.activity_date).toISOString()
    };
    
    const { data, error } = await supabase
      .from('prospect_activities')
      .insert([activityDataUtc])
      .select()
      .single();
    
    if (error) {
      logger.error('❌ Error creating prospect activity:', error);
      throw error;
    }
    
    logger.debug('✅ Prospect activity created:', data);
    return data as ProspectActivity;
  }

  /**
   * Mettre à jour une activité
   */
  static async updateActivity(activityId: string, updateData: UpdateProspectActivityData): Promise<ProspectActivity> {
    logger.debug('🔄 Updating prospect activity:', activityId, updateData);
    
    // Convertir la date en UTC si elle est fournie
    const updateDataUtc = {
      ...updateData,
      ...(updateData.activity_date && {
        activity_date: parisToUtc(updateData.activity_date).toISOString()
      })
    };
    
    const { data, error } = await supabase
      .from('prospect_activities')
      .update(updateDataUtc)
      .eq('id', activityId)
      .select()
      .single();
    
    if (error) {
      logger.error('❌ Error updating prospect activity:', error);
      throw error;
    }
    
    logger.debug('✅ Prospect activity updated:', data);
    return data as ProspectActivity;
  }

  /**
   * Supprimer une activité
   */
  static async deleteActivity(activityId: string): Promise<void> {
    logger.debug('🗑️ Deleting prospect activity:', activityId);
    
    const { error } = await supabase
      .from('prospect_activities')
      .delete()
      .eq('id', activityId);
    
    if (error) {
      logger.error('❌ Error deleting prospect activity:', error);
      throw error;
    }
    
    logger.debug('✅ Prospect activity deleted');
  }

  /**
   * Marquer une activité comme terminée
   */
  static async markAsCompleted(activityId: string): Promise<ProspectActivity> {
    return this.updateActivity(activityId, { status: 'completed' });
  }

  /**
   * Marquer une activité comme annulée
   */
  static async markAsCancelled(activityId: string): Promise<ProspectActivity> {
    return this.updateActivity(activityId, { status: 'cancelled' });
  }

  /**
   * Récupérer les activités par statut
   */
  static async getActivitiesByStatus(prospectId: string, status: 'pending' | 'completed' | 'cancelled'): Promise<ProspectActivity[]> {
    logger.debug('🔍 Fetching activities by status:', prospectId, status);
    
    const { data, error } = await supabase
      .from('prospect_activities')
      .select('*')
      .eq('prospect_id', prospectId)
      .eq('status', status)
      .order('activity_date', { ascending: false });
    
    if (error) {
      logger.error('❌ Error fetching activities by status:', error);
      throw error;
    }
    
    return data as ProspectActivity[];
  }

  /**
   * Récupérer les activités à venir (pour les rappels)
   */
  static async getUpcomingActivities(prospectId: string): Promise<ProspectActivity[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('prospect_activities')
      .select('*')
      .eq('prospect_id', prospectId)
      .eq('status', 'pending')
      .gte('activity_date', now)
      .order('activity_date', { ascending: true });
    
    if (error) {
      logger.error('❌ Error fetching upcoming activities:', error);
      throw error;
    }
    
    return data as ProspectActivity[];
  }

  /**
   * Synchroniser avec le calendrier centralisé
   */
  static async syncToCalendar(activity: ProspectActivity): Promise<void> {
    logger.debug('🔄 Syncing activity to calendar:', activity.id);
    
    try {
      // Import du service d'activité du calendrier
      const { addActivity } = await import('@/services/activityService');
      
      // Mapper les types pour le calendrier
      const priorityMap = {
        'low': 'basse' as const,
        'medium': 'moyenne' as const,
        'high': 'haute' as const,
      };
      
      await addActivity({
        title: activity.title,
        description: activity.description || '',
        date_utc: activity.activity_date,
        type: 'prospect',
        priority: priorityMap[activity.priority],
        status: activity.status === 'completed' ? 'termine' : 'a_faire',
        related_id: activity.id,
        related_module: 'crm',
      });
      
      logger.debug('✅ Activity synced to calendar');
    } catch (error) {
      logger.error('❌ Error syncing to calendar:', error);
      // Ne pas faire échouer la création de l'activité si la sync échoue
    }
  }
} 