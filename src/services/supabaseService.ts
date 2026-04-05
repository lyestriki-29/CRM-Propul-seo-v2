import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase';
import { logger } from '@/lib/logger';
import type {
  UserProfileRow,
  UserProfileUpdate,
  ContactRow,
  ContactInsert,
  ContactUpdate,
  ProjectRow,
  ProjectInsert,
  ProjectUpdate,
  TaskRow,
  TaskInsert,
  TaskUpdate,
  CalendarEventRow,
  CalendarEventInsert,
  QuoteRow,
  QuoteInsert,
  LeadRow,
  LeadInsert,
  CampaignRow,
  CampaignInsert,
  AccountingEntryRow,
  AccountingEntryInsert,
  AccountingEntryUpdate,
} from '../types/supabase-types';

export class SupabaseService {
  // User Profiles
  static async getUserProfiles() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as UserProfileRow[]);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async getCurrentUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (error) return handleSupabaseError(error);

      // If no profile exists, create one
      if (!data) {
        const newProfile = {
          auth_user_id: user.id,
          name: user.email?.split('@')[0] || 'Utilisateur',
          email: user.email || '',
          role: 'sales'
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();

        if (createError) return handleSupabaseError(createError);
        return handleSupabaseSuccess(createdProfile as UserProfileRow);
      }

      return handleSupabaseSuccess(data as UserProfileRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async updateUserProfile(updates: UserProfileUpdate) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('auth_user_id', user.id)
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as UserProfileRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Contacts (Clients)
  static async getClients() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as LeadRow[]);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async createClient(client: Partial<ContactInsert> & { name?: string; company_name?: string; contact_name?: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...client,
          company_name: client.name || client.company_name,
          contact_name: client.contact_name || client.name,
          status: 'prospect'
        })
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as LeadRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async updateClient(id: string, updates: ContactUpdate) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as ContactRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async deleteClient(id: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(null);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Tasks
  static async getTasks() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to_user:assigned_to(id, name),
          project:projects(id, name),
          contact:contacts(id, name)
        `)
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as TaskRow[]);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async createTask(task: Partial<TaskInsert>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, user_id: userData.id })
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as TaskRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async updateTask(id: string, updates: TaskUpdate) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as TaskRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(null);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Projects
  static async getProjects() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as ProjectRow[]);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async createProject(project: Partial<ProjectInsert>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          status: project.status || 'planning'
        })
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as ProjectRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async updateProject(id: string, updates: ProjectUpdate) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as ProjectRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async deleteProject(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(null);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Calendar Events
  static async getCalendarEvents() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          contact:contacts(id, name),
          project:projects(id, name)
        `)
        .eq('user_id', userData.id)
        .order('start_time', { ascending: true });

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as CalendarEventRow[]);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async createCalendarEvent(event: Partial<CalendarEventInsert>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('events')
        .insert({ ...event, user_id: userData.id })
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as CalendarEventRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Quotes
  static async getQuotes() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          contact:contacts(id, name)
        `)
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as QuoteRow[]);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async createQuote(quote: Partial<QuoteInsert>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      // Generate quote number
      const quoteNumber = `PROP-QUO-${Date.now()}`;

      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          ...quote,
          user_id: userData.id,
          quote_number: quoteNumber
        })
        .select()
        .single();

      if (quoteError) return handleSupabaseError(quoteError);
      return handleSupabaseSuccess(quoteData as QuoteRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Leads
  static async getLeads() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      // For now, return leads from contacts table with prospect status
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          assigned_to_user:assigned_to(id, name)
        `)
        .eq('user_id', userData.id)
        .eq('status', 'prospect')
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as ContactRow[]);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async createLead(lead: Partial<LeadInsert> & { company_name?: string; contact_name?: string; value?: number; score?: number }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      // Create as lead with prospect status
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...lead,
          company_name: lead.company_name || lead.name,
          contact_name: lead.contact_name || lead.name,
          status: 'prospect',
          value: lead.value || lead.score || 0
        })
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as LeadRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Campaigns
  static async getCampaigns() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          assigned_to_user:assigned_to(id, name)
        `)
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as CampaignRow[]);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  static async createCampaign(campaign: Partial<CampaignInsert>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Get current user's internal ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Profil utilisateur non trouvé');

      const { data, error } = await supabase
        .from('campaigns')
        .insert({ ...campaign, user_id: userData.id })
        .select()
        .single();

      if (error) return handleSupabaseError(error);
      return handleSupabaseSuccess(data as CampaignRow);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Accounting Entries
  static async getAccountingEntries(): Promise<AccountingEntryRow[]> {
    try {
      const { data, error } = await supabase
        .from('accounting_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as AccountingEntryRow[];
    } catch (error) {
      logger.error('Erreur lors de la récupération des entrées comptables:', error);
      return [];
    }
  }

  static async createAccountingEntry(entry: Partial<AccountingEntryInsert>): Promise<AccountingEntryRow> {
    try {
      const { data, error } = await supabase
        .from('accounting_entries')
        .insert({
          ...entry,
          month_key: entry.entry_date ? entry.entry_date.slice(0, 7) : undefined
        })
        .select()
        .single();

      if (error) throw error;
      return data as AccountingEntryRow;
    } catch (error) {
      logger.error("Erreur lors de la création de l'entrée comptable:", error);
      throw error;
    }
  }

  static async updateAccountingEntry(id: string, updates: AccountingEntryUpdate): Promise<AccountingEntryRow> {
    try {
      const { data, error } = await supabase
        .from('accounting_entries')
        .update({
          ...updates,
          month_key: updates.entry_date ? updates.entry_date.slice(0, 7) : undefined
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as AccountingEntryRow;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de l'entrée comptable:", error);
      throw error;
    }
  }

  static async deleteAccountingEntry(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('accounting_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error("Erreur lors de la suppression de l'entrée comptable:", error);
      throw error;
    }
  }
}
