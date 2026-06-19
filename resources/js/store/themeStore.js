import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'light',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'rcn-theme',
    }
  )
);

export default useThemeStore;
