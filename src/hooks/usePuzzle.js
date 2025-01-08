import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllPuzzles, fetchPuzzleById } from '../api/api-puzzle';

// 모든 퍼즐 가져오기
export const useAllPuzzles = () => {
  return useQuery({
    queryKey: ['puzzles'],
    queryFn: fetchAllPuzzles,
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 20, // 20분
  });
};

// 특정 퍼즐 가져오기
export const usePuzzleById = (puzzleId) => {
  return useQuery({
    queryKey: ['puzzle', puzzleId],
    queryFn: () => fetchPuzzleById(puzzleId),
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 20, // 20분
  });
};

// 퍼즐 업데이트 후 리패치를 위한 훅
export function useInvalidatePuzzles() {
  const queryClient = useQueryClient()
  
  const invalidatePuzzles = async () => {
    // 'puzzles' 쿼리를 무효화하고 리패치
    await queryClient.invalidateQueries({ queryKey: ['puzzles'] })
  }
  return { invalidatePuzzles }
}
