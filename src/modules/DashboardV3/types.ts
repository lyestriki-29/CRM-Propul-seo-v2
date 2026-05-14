// Types spécifiques au module Dashboard

export interface DashboardWidget {
  id: string;
  title: string;
  value: number | string;
  type: 'stat' | 'chart' | 'list' | 'custom';
} 