// ============================================================
// TYPES V2 — Gestion de projets
// Ne pas modifier database.ts — tous les types V2 sont ici
// ============================================================

// ===== STATUTS =====

export type ProjectStatusV2 =
  | 'prospect'
  | 'brief_received'
  | 'quote_sent'
  | 'in_progress'
  | 'review'
  | 'delivered'
  | 'maintenance'
  | 'on_hold'
  | 'closed'

export type PrestaType = 'web' | 'seo' | 'erp' | 'saas'

// ===== PROJET ÉTENDU =====

export interface ProjectV2 {
  id: string
  user_id: string | null
  client_id: string | null
  client_name?: string | null
  name: string
  description: string | null
  status: ProjectStatusV2
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: string | null
  assigned_name?: string | null
  start_date: string
  end_date: string | null
  budget: number | null
  progress: number
  category: string
  presta_type: PrestaType[]
  completion_score: number
  last_activity_at: string | null
  completed_at: string | null
  is_archived: boolean
  created_at: string
  updated_at: string
}

// ===== CHECKLIST V2 =====

export type ChecklistPhase =
  | 'onboarding'
  | 'conception'
  | 'developpement'
  | 'recette'
  | 'post_livraison'
  | 'general'

export type ChecklistStatus = 'todo' | 'in_progress' | 'done'

export interface ChecklistItemV2 {
  id: string
  project_id: string
  parent_task_id: string | null
  title: string
  description?: string | null
  phase: ChecklistPhase
  status: ChecklistStatus
  priority: 'low' | 'medium' | 'high'
  assigned_to?: string | null
  assigned_name?: string | null
  due_date?: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

// ===== JOURNAL / TIMELINE =====

export type ActivityType =
  | 'email'
  | 'call'
  | 'meeting'
  | 'decision'
  | 'task'
  | 'file'
  | 'access'
  | 'status'
  | 'invoice'
  | 'system'

export interface ProjectActivity {
  id: string
  project_id: string
  user_id?: string | null
  author_name?: string | null
  type: ActivityType
  content: string
  is_auto: boolean
  metadata?: Record<string, unknown>
  created_at: string
}

// ===== COFFRE-FORT ACCÈS =====

export type AccessCategory =
  | 'hosting'
  | 'cms'
  | 'analytics'
  | 'social'
  | 'tools'
  | 'design'

export type AccessStatus =
  | 'active'
  | 'missing'
  | 'broken'
  | 'expired'
  | 'pending_validation'

export interface ProjectAccess {
  id: string
  project_id: string
  category: AccessCategory
  service_name: string
  url?: string | null
  login: string
  password: string
  notes?: string | null
  status: AccessStatus
  detected_from_email: boolean
  created_at: string
  updated_at: string
}

// ===== DOCUMENTS =====

export type DocumentCategory =
  | 'contract'
  | 'brief'
  | 'mockup'
  | 'report'
  | 'deliverable'
  | 'invoice'
  | 'other'

export interface ProjectDocument {
  id: string
  project_id: string
  name: string
  category: DocumentCategory
  version: number
  file_path: string
  file_size?: number | null
  mime_type?: string | null
  uploaded_by?: string | null
  uploader_name?: string | null
  created_at: string
}

// ===== BRIEF =====

export type BriefStatus = 'draft' | 'validated' | 'frozen'

export interface ProjectBrief {
  id: string
  project_id: string
  objective?: string | null
  target_audience?: string | null
  pages?: string | null
  techno?: string | null
  design_references?: string | null
  notes?: string | null
  status: BriefStatus
  created_at: string
  updated_at: string
}

// ===== TEMPLATES CHECKLIST =====

export interface TaskTemplate {
  id: string
  project_type: PrestaType
  phase: ChecklistPhase
  title: string
  default_priority: 'low' | 'medium' | 'high'
  sort_order: number
}

// ===== NOTIFICATIONS =====

export interface ProjectNotification {
  id: string
  user_id: string
  project_id?: string | null
  type: string
  title: string
  body?: string | null
  read: boolean
  link?: string | null
  created_at: string
}

// ===== KANBAN =====

export interface KanbanColumnV2 {
  id: ProjectStatusV2
  title: string
  color: string
  headerColor: string
  icon: string // lucide icon name
}

export interface PipelineRule {
  to: ProjectStatusV2
  condition: string
  errorMessage: string
}

// ===== SCORE DE COMPLÉTUDE =====

export interface CompletionWeights {
  checklist: number    // 60%
  brief: number        // 10%
  accesses: number     // 10%
  timeline: number     // 10%
  budget: number       // 10%
}

export interface CompletionData {
  checklistTotal: number
  checklistDone: number
  hasBrief: boolean
  activeAccesses: number
  totalAccesses: number
  timelineEntries: number
  hasBudget: boolean
}

// ===== SUIVI DU DOSSIER =====

export type FollowUpType = 'rdv' | 'appel' | 'email' | 'autre'

export interface FollowUpEntry {
  id: string
  project_id: string
  type: FollowUpType
  date: string
  summary: string
  follow_up_action: string | null
  follow_up_date: string | null
  follow_up_done: boolean
  assigned_to: string | null
  assigned_name: string | null
  created_at: string
}
