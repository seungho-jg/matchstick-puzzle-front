import { create } from 'zustand'

const useMatchstickStore = create((set) => ({
  // 현재 퀴즈 상태
  currentPuzzle: null,
  matchsticks: [],
  selectedMatchstick: null,
  moveHistory: [],


}))