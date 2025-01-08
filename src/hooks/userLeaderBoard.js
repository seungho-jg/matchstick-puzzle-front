import { useQuery } from '@tanstack/react-query';
import { fetchUserAll } from '../api/api-user';

export const useUserLeaderBoard = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUserAll,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};