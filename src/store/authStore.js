import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      puzzleCreateCount: 0,
      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ user: userInfo }),
      setPuzzleCreateCount: (count) => set({ puzzleCreateCount: count }),
      isAdmin: () => get().user?.role === 'ADMIN',
      clearToken: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore