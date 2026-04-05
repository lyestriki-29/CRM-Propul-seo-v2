import { useMemo } from 'react';
import {
  CRMERP_STATUSES,
  CRMERP_STATUS_LABELS,
  CRMERP_STATUS_COLORS,
  type CRMERPLead,
  type CRMERPStatus,
} from '../types';

export interface CRMERPColumn {
  status: CRMERPStatus;
  label: string;
  bg: string;
  header: string;
  badge: string;
  leads: CRMERPLead[];
}

export function useCRMERPColumns(leads: CRMERPLead[]) {
  const columns = useMemo<CRMERPColumn[]>(() => {
    return CRMERP_STATUSES.map((status) => ({
      status,
      label: CRMERP_STATUS_LABELS[status],
      ...CRMERP_STATUS_COLORS[status],
      leads: leads
        .filter((l) => l.status === status)
        .sort((a, b) => {
          if (a.last_activity_at && b.last_activity_at)
            return new Date(a.last_activity_at).getTime() - new Date(b.last_activity_at).getTime();
          if (a.last_activity_at) return -1;
          if (b.last_activity_at) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }),
    }));
  }, [leads]);

  return columns;
}
