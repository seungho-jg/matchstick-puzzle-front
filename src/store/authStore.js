import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userRole: null,
      setToken: (token) => set({ token }),
      setUserRole: (role) => set({ userRole: role }),
      isAdmin: () => useAuthStore.getState().userRole === 'ADMIN',
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore