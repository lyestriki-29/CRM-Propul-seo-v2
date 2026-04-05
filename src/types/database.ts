export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          title: string
          description: string | null
          date_utc: string
          type: 'projet' | 'prospect'
          priority: 'haute' | 'moyenne' | 'basse'
          status: 'a_faire' | 'en_cours' | 'termine'
          related_id: string
          related_module: 'projet' | 'crm'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date_utc: string
          type: 'projet' | 'prospect'
          priority: 'haute' | 'moyenne' | 'basse'
          status: 'a_faire' | 'en_cours' | 'termine'
          related_id: string
          related_module: 'projet' | 'crm'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date_utc?: string
          type?: 'projet' | 'prospect'
          priority?: 'haute' | 'moyenne' | 'basse'
          status?: 'a_faire' | 'en_cours' | 'termine'
          related_id?: string
          related_module?: 'projet' | 'crm'
          created_at?: string
          updated_at?: string
        }
      }
      prospect_activities: {
        Row: {
          id: string
          prospect_id: string
          title: string
          description: string | null
          activity_date: string
          activity_type: 'call' | 'meeting' | 'email' | 'follow_up' | 'demo' | 'proposal' | 'other'
          priority: 'low' | 'medium' | 'high'
          status: 'pending' | 'completed' | 'cancelled'
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prospect_id: string
          title: string
          description?: string | null
          activity_date: string
          activity_type: 'call' | 'meeting' | 'email' | 'follow_up' | 'demo' | 'proposal' | 'other'
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed' | 'cancelled'
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prospect_id?: string
          title?: string
          description?: string | null
          activity_date?: string
          activity_type?: 'call' | 'meeting' | 'email' | 'follow_up' | 'demo' | 'proposal' | 'other'
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed' | 'cancelled'
          assigned_to?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          name: string
          role: 'admin' | 'sales' | 'marketing' | 'developer' | 'manager'
          avatar_url: string | null
          phone: string | null
          company: string | null
          position: string | null
          bio: string | null
          timezone: string
          language: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role?: 'admin' | 'sales' | 'marketing' | 'developer' | 'manager'
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          position?: string | null
          bio?: string | null
          timezone?: string
          language?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'admin' | 'sales' | 'marketing' | 'developer' | 'manager'
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          position?: string | null
          bio?: string | null
          timezone?: string
          language?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string
          address: string
          sector: string
          status: 'prospect' | 'devis' | 'signe' | 'livre' | 'perdu'
          total_revenue: number
          assigned_to: string | null
          created_at: string
          updated_at: string
          last_contact: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone: string
          address: string
          sector: string
          status?: 'prospect' | 'devis' | 'signe' | 'livre' | 'perdu'
          total_revenue?: number
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          last_contact?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          sector?: string
          status?: 'prospect' | 'devis' | 'signe' | 'livre' | 'perdu'
          total_revenue?: number
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          last_contact?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          client_id: string
          name: string
          description: string | null
          status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string
          start_date: string
          end_date: string | null
          budget: number | null
          progress: number
          category: string
          completed_at: string | null
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          name: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string
          start_date: string
          end_date?: string | null
          budget?: number | null
          progress?: number
          category: string
          completed_at?: string | null
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          name?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string
          start_date?: string
          end_date?: string | null
          budget?: number | null
          progress?: number
          category?: string
          completed_at?: string | null
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'waiting' | 'done'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string
          project_id: string | null
          client_id: string | null
          deadline: string | null
          category: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'waiting' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string
          project_id?: string | null
          client_id?: string | null
          deadline?: string | null
          category: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'waiting' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string
          project_id?: string | null
          client_id?: string | null
          deadline?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          event_type: 'rdv_client' | 'deadline' | 'livraison' | 'suivi' | 'marketing' | 'formation'
          client_id: string | null
          assigned_to: string
          is_all_day: boolean
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          event_type: 'rdv_client' | 'deadline' | 'livraison' | 'suivi' | 'marketing' | 'formation'
          client_id?: string | null
          assigned_to: string
          is_all_day?: boolean
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          event_type?: 'rdv_client' | 'deadline' | 'livraison' | 'suivi' | 'marketing' | 'formation'
          client_id?: string | null
          assigned_to?: string
          is_all_day?: boolean
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          user_id: string
          client_id: string
          title: string
          status: 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected'
          subtotal: number
          tax: number
          total: number
          valid_until: string
          sent_at: string | null
          viewed_at: string | null
          signed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          title: string
          status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected'
          subtotal?: number
          tax?: number
          total?: number
          valid_until: string
          sent_at?: string | null
          viewed_at?: string | null
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          title?: string
          status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected'
          subtotal?: number
          tax?: number
          total?: number
          valid_until?: string
          sent_at?: string | null
          viewed_at?: string | null
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          description: string
          quantity: number
          unit_price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          description: string
          quantity?: number
          unit_price: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          total?: number
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          status: string
          budget: number | null
          start_date: string
          end_date: string | null
          target_audience: string
          description: string | null
          assigned_to: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          status?: string
          budget?: number | null
          start_date: string
          end_date?: string | null
          target_audience: string
          description?: string | null
          assigned_to: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          status?: string
          budget?: number | null
          start_date?: string
          end_date?: string | null
          target_audience?: string
          description?: string | null
          assigned_to?: string
          created_at?: string
          updated_at?: string
        }
      }
      campaign_metrics: {
        Row: {
          id: string
          campaign_id: string
          impressions: number
          clicks: number
          conversions: number
          cost: number
          recorded_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          impressions?: number
          clicks?: number
          conversions?: number
          cost?: number
          recorded_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          impressions?: number
          clicks?: number
          conversions?: number
          cost?: number
          recorded_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          source: string
          status: string
          score: number
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          source: string
          status?: string
          score?: number
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          source?: string
          status?: string
          score?: number
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_notes: {
        Row: {
          id: string
          lead_id: string
          note: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          note: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          note?: string
          created_by?: string
          created_at?: string
        }
      }
      accounting_entries: {
        Row: {
          id: string
          user_id: string
          type: string
          description: string
          amount: number
          category: string
          client_id: string | null
          entry_date: string
          is_recurring: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          description: string
          amount: number
          category: string
          client_id?: string | null
          entry_date: string
          is_recurring?: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          description?: string
          amount?: number
          category?: string
          client_id?: string | null
          entry_date?: string
          is_recurring?: boolean
          created_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'sales' | 'marketing' | 'developer' | 'manager'
      client_status: 'prospect' | 'devis' | 'signe' | 'livre' | 'perdu'
      task_status: 'todo' | 'in_progress' | 'waiting' | 'done'
      task_priority: 'low' | 'medium' | 'high' | 'urgent'
      project_status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
      event_type: 'rdv_client' | 'deadline' | 'livraison' | 'suivi' | 'marketing' | 'formation'
      quote_status: 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}