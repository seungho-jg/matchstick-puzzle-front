import { create } from 'zustand'
import { openDB } from 'idb'

// IndexedDB 설정
const dbPromise = openDB('matchstick-puzzle', 1, {
  upgrade(db) {
    // 스킨 저장소
    db.createObjectStore('skins')
    // 사용자 설정 저장소
    db.createObjectStore('userSettings')
  }
})

const useImageStore = create((set, get) => ({
  // 상태
  skins: [], // 사용 가능한 모든 스킨
  currentSkin: 'default', // 현재 선택된 스킨
  skinImages: {}, // 로드된 스킨 이미지들
  isLoading: false,
  error: null,

  // 모든 스킨 정보 로드
  loadSkins: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const defaultSkins = [
        { id: 'default', name: '기본', path: 'skins/matchstick.webp' },
        { id: 'shadow', name: '그림자', path: 'skins/matchstick-shadow.webp' },
      ]

      set({ skins: defaultSkins, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  // 특정 스킨 이미지 로드
  loadSkinImage: async (skinId) => {
    try {
      set({ isLoading: true, error: null })
      const { skins } = get()
      const skin = skins.find(s => s.id === skinId)
      
      if (!skin) throw new Error('Skin not found')

      // IndexedDB에서 캐시된 이미지 확인
      const db = await dbPromise
      const cachedImage = await db.get('skins', skinId)

      if (cachedImage) {
        const img = new Image()
        img.src = cachedImage
        set(state => ({
          skinImages: { ...state.skinImages, [skinId]: img },
          isLoading: false
        }))
        return
      }

      // 새로 이미지 로드
      const img = new Image()
      img.src = skin.path
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      // Base64로 변환하여 저장
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const base64 = canvas.toDataURL('image/webp')

      // IndexedDB에 저장
      await db.put('skins', base64, skinId)

      set(state => ({
        skinImages: { ...state.skinImages, [skinId]: img },
        isLoading: false
      }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  // 현재 스킨 설정
  setCurrentSkin: async (skinId) => {
    try {
      const db = await dbPromise
      await db.put('userSettings', skinId, 'currentSkin')
      set({ currentSkin: skinId })
      
      // 이미지가 로드되지 않았다면 로드
      if (!get().skinImages[skinId]) {
        await get().loadSkinImage(skinId)
      }
    } catch (error) {
      set({ error: error.message })
    }
  },

  // 사용자 설정 로드
  loadUserSettings: async () => {
    try {
      const db = await dbPromise
      const currentSkin = await db.get('userSettings', 'currentSkin') || 'default'
      set({ currentSkin })
      await get().loadSkinImage(currentSkin)
    } catch (error) {
      set({ error: error.message })
    }
  },

  // 캐시 초기화
  clearCache: async () => {
    try {
      const db = await dbPromise
      await db.clear('skins')
      set({ skinImages: {} })
    } catch (error) {
      set({ error: error.message })
    }
  }
}))

// 초기화 함수 추가
const initializeStore = async () => {
  const store = useImageStore.getState()
  await store.loadSkins()  // 스킨 목록 로드
  await store.loadUserSettings()  // 사용자 설정 로드
}

// 스토어 생성 후 바로 초기화 실행
initializeStore()

export default useImageStore