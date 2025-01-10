import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllPuzzles, fetchPuzzleById } from '../api/api-puzzle';
import { getPuzzleCreateCount } from '../api/api-user';

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

export function usePuzzleCreateCount(user) {
  return useQuery({
    queryKey: ['puzzleCreateCount', user?.id],
    queryFn: getPuzzleCreateCount,
    staleTime: 1000 * 60, // 1분 동안 데이터를 'fresh'하다고 간주
    cacheTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 비활성화
    refetchInterval: 1000 * 60 * 5, // 5분 마다 재요청
    retry: 1, // 실패시 1번만 재시도
    select: (data) => data.puzzleCreateCount, // 필요한 데이터만 선택
  })
}