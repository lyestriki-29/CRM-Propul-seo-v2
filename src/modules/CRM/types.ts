// Types spécifiques au module CRM

export interface CRMClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'prospect' | 'client' | 'archived';
}

export interface CRMLead {
  id: string;
  name: string;
  email?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

// === Types pour le refactoring CRM ===

export type AllowedStatus = 'prospect' | 'presentation_envoyee' | 'meeting_booke' | 'offre_envoyee' | 'en_attente' | 'signe';

export const ALLOWED_STATUSES: AllowedStatus[] = [
  'prospect', 'presentation_envoyee', 'meeting_booke', 'offre_envoyee', 'en_attente', 'signe'
];

export const isValidStatus = (status: string): status is AllowedStatus =>
  ALLOWED_STATUSES.includes(status as AllowedStatus);

export interface ContactFormData {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  status: string;
  project_price: number | undefined;
  source: string;
  notes: string;
  assigned_to: string;
  no_show: string;
}

export const INITIAL_CONTACT_FORM: ContactFormData = {
  company_name: '',
  contact_name: '',
  email: '',
  phone: '',
  website: '',
  status: 'prospect',
  project_price: undefined,
  source: 'website',
  notes: '',
  assigned_to: '',
  no_show: 'Non'
};

export const STATUS_MAPPING: Record<string, string[]> = {
  'Prospects': ['prospect', 'prospects'],
  'Présentation Envoyée': ['presentation_envoyee'],
  'Meeting Booké': ['meeting_booke'],
  'Offre Envoyée': ['offre_envoyee'],
  'En Attente': ['en_attente'],
  'Signés': ['signe']
};
