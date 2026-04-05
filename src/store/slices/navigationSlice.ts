import type { StateCreator } from 'zustand';
import type { Store, NavigationSlice } from '../types';

export const createNavigationSlice: StateCreator<Store, [], [], NavigationSlice> = (set) => ({
  activeModule: 'dashboard',
  navigationContext: {},

  // Navigation with context
  setActiveModule: (module) => set({ activeModule: module }),
  navigateWithContext: (module, context = {}) => {
    set({
      activeModule: module,
      navigationContext: context
    });
  },
});
