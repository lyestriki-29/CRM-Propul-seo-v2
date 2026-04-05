// Types spécifiques au module ClientDetails

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'prospect' | 'client' | 'archived';
} 