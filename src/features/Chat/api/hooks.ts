import {useApiQuery} from '@/shared/lib/api/hooks';
import {DmChatRoom, getHostedDmRooms, getParticipatedDmRooms} from './api';

/**
 * 내가 호스트인 DM 채팅방 목록을 가져오는 React Query 훅
 * @returns useQuery 훅의 반환값
 */
export const useHostedDmRooms = () => {
  return useApiQuery<DmChatRoom[]>(
    ['hostedDmRooms'],
    () => getHostedDmRooms(),
    {
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터 신선한 상태 유지
      refetchOnWindowFocus: true, // 창이 포커스될 때 다시 가져오기
      retry: 1, // 실패 시 1번 재시도
    },
  );
};

/**
 * 내가 참여자인 DM 채팅방 목록을 가져오는 React Query 훅
 * @returns useQuery 훅의 반환값
 */
export const useParticipatedDmRooms = () => {
  return useApiQuery<DmChatRoom[]>(
    ['participatedDmRooms'],
    () => getParticipatedDmRooms(),
    {
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터 신선한 상태 유지
      refetchOnWindowFocus: true, // 창이 포커스될 때 다시 가져오기
      retry: 1, // 실패 시 1번 재시도
    },
  );
};
