import { create } from 'zustand'
import { persist } from 'zustand/middleware';

const usePuzzleStore = create(
  persist(
    (set, get) => ({
  // 현재 퀴즈 상태
  currentPuzzle: null,
  matchsticks: [], // 성냥개비 배열
  selectedMatchstick: null, // 현재 선택된 성냥개비 ID
  moveHistory: [], // 이동 기록

  // 퍼즐 로딩
  loadPuzzle: () => {
    const state = get();

    if (!state.matchsticks || state.matchsticks.length === 0) {
      set({
        currentPuzzle: 'test',
        matchsticks: [
          { id: "1", x: 50, y: 50, angle: 10 },
          { id: "2", x: 200, y: 100, angle: 30 },
          { id: "3", x: 100, y: 150, angle: 180 },
          { id: "4", x: 150, y: 100, angle: 270 },
          { id: "5", x: 130, y: 100, angle: 270 },
          { id: "6", x: 140, y: 100, angle: 270 },
          { id: "7", x: 110, y: 100, angle: 270 },
        ],
      });
    }
  },
  // 성냥개비 선택
  selectStick: (stickId) => {
    const currentSelected = get().selectedMatchstick;
    set({
      selectedMatchstick: currentSelected === stickId ? null : stickId, // 같은 것을 선택하면 선택 해제
    })
  },
  // 성냥개비 이동
  moveStick: (stickId, newPosition) => {
    set((state) => {
      const updateMatchsticks = state.matchsticks.map((stick) =>
        stick.id === stickId
        ? { ...stick, x: newPosition.x, y: newPosition.y} 
        : stick
      )
      const movedStick = state.matchsticks.find((stick) => stick.id === stickId)

      return {
        matchsticks: updateMatchsticks,
        moveHistory: [...state.moveHistory, {stickId, from: movedStick, to:newPosition}]
      }
    })
  },
  // 성냥개비 회전
  rotateStick: (stickId, angle) => {
    set((state) => {
      const updateMatchsticks = state.matchsticks.map((stick) =>
        stick.id === stickId
          ? {...stick, angle: angle}
          : stick
      )
      return {
        matchsticks: updateMatchsticks,
      }
    })
  },
  // 성냥개비 상태 초기화
  resetPuzzle: () => {
    const initialPuzzle = get().currentPuzzle
    if (initialPuzzle) {
      set({
        matchsticks: initialPuzzle.matchsticks || [],
        moveHistory: [],
        selectedMatchstick: null,
      })
    }
  },

}),
  {
    name: 'puzzle-storage',
    partialize: (state) => ({
      matchsticks: state.matchsticks,
      currentPuzzle: state.currentPuzzle,
      selectedMatchstick: state.selectedMatchstick
    })
  }
))

export default usePuzzleStore