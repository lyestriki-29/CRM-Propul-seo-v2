import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useSupabaseContacts,
  useContactsCRUD,
  useProjectsCRUD,
  useSupabaseRevenueCalculation,
  useSupabaseProjects,
  useSupabaseAccountingEntries
} from '../../../hooks/useSupabaseData';
import { useCRMUsers } from '../../../hooks/useCRMUsers';
import { useCRMColumns } from '../../../hooks/useCRMColumns';

export function useCRMData() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: contacts, loading: contactsLoading, error: contactsError, refetch: refetchContacts } = useSupabaseContacts();
  const { createContact, updateContact, deleteContact, loading: crudLoading } = useContactsCRUD();
  const { createProject, deleteProject } = useProjectsCRUD();
  const { refetch: refetchRevenue } = useSupabaseRevenueCalculation();
  const { users: crmUsers = [], loading: usersLoading } = useCRMUsers();
  const { data: projects } = useSupabaseProjects();
  const { data: accountingEntries } = useSupabaseAccountingEntries();

  console.log('CRM - crmUsers:', crmUsers, 'usersLoading:', usersLoading);

  const {
    columns: customColumns,
    loading: columnsLoading,
    addColumn,
    updateColumn,
    deleteColumn,
    updateColumnCounts,
    refetch: refetchColumns
  } = useCRMColumns();

  return {
    contacts, contactsLoading, contactsError, refetchContacts,
    createContact, updateContact, deleteContact, crudLoading,
    createProject, deleteProject,
    refetchRevenue,
    crmUsers, usersLoading,
    projects, accountingEntries,
    customColumns, columnsLoading, addColumn, updateColumn, deleteColumn, updateColumnCounts, refetchColumns,
    fromDashboard: searchParams.get('from') === 'dashboard',
    navigate,
  };
}

export type CRMData = ReturnType<typeof useCRMData>;
