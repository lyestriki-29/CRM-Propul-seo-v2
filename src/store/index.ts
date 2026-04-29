import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Store } from './types';
import { createAuthSlice } from './slices/authSlice';
import { createUiSlice } from './slices/uiSlice';
import { createCrmSlice } from './slices/crmSlice';
import { createProjectsSlice } from './slices/projectsSlice';
import { createAccountingSlice } from './slices/accountingSlice';
import { createTasksSlice } from './slices/tasksSlice';

export type { Store };

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUiSlice(...a),
      ...createCrmSlice(...a),
      ...createProjectsSlice(...a),
      ...createAccountingSlice(...a),
      ...createTasksSlice(...a),
    }),
    {
      name: 'propulseo-store',
      partialize: (state) => ({
        // Don't persist Supabase data, it will be loaded fresh each time
        currentUser: state.currentUser,
        darkMode: state.darkMode,
        showCompletedTasks: state.showCompletedTasks,
        sidebarCollapsed: state.sidebarCollapsed,
        // Keep accounting data as it's local
        accountingData: state.accountingData,
        projects: state.projects,
        // Don't persist chat data - will come from Supabase
        // Keep calendar sync settings
        calendarSyncSettings: state.calendarSyncSettings,
        // Keep undo history
        undoHistory: state.undoHistory,
        // Keep dashboard objectives
        dashboardObjectives: state.dashboardObjectives,
      }),
    }
  )
);
