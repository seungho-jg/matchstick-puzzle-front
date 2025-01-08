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
      // 퍼즐 생성 카운트 감소 함수 추가
      decreasePuzzleCount: () => 
        set(state => ({ 
          puzzleCreateCount: Math.max(0, state.puzzleCreateCount - 1) 
        })),
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