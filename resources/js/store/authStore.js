import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      personalInfoId: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      setPersonalInfoId: (id) => set({ personalInfoId: id }),
      logout: () => set({ token: null, user: null, personalInfoId: null }),
    }),
    {
      name: 'rcn-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        personalInfoId: state.personalInfoId,
      }),
    }
  )
);

export default useAuthStore;
