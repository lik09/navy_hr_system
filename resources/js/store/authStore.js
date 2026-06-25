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

// Auth state is persisted to localStorage, which is shared across every tab/window
// on this origin. If another tab logs in/out (changing 'rcn-auth'), this tab is left
// rendering a stale session while still sending requests under the new token — reload
// so it picks up the account that's actually active.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'rcn-auth') {
      window.location.reload();
    }
  });
}

export default useAuthStore;
