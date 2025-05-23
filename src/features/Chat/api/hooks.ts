import {useApiQuery, useApiMutation} from '@/shared/lib/api/hooks';
import {
  DmChatRoom,
  getHostedDmRooms,
  getParticipatedDmRooms,
  ActualDmChatRoomDetailResponse,
  getDmChatRoomDetail,
  DmMessageResponse,
  getDmMessages,
  sendDmMessage,
} from './api';

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

/**
 * DM 채팅방 상세 정보를 가져오는 React Query 훅
 * @param dmChatRoomId 채팅방 ID
 * @returns useQuery 훅의 반환값
 */
export const useDmChatRoomDetail = (dmChatRoomId: number) => {
  return useApiQuery<ActualDmChatRoomDetailResponse>(
    ['dmChatRoomDetail', dmChatRoomId.toString()],
    () => getDmChatRoomDetail(dmChatRoomId),
    {
      staleTime: 1000 * 60 * 2, // 2분 동안 데이터 신선한 상태 유지
      refetchOnWindowFocus: false, // 창 포커스 시 다시 가져오기 안함
      retry: 1, // 실패 시 1번 재시도
      enabled: dmChatRoomId !== -1 && dmChatRoomId > 0, // 유효한 dmChatRoomId일 때만 쿼리 실행
    },
  );
};

/**
 * DM 메시지 목록을 가져오는 React Query 훅
 * @param dmChatRoomId 채팅방 ID
 * @returns useQuery 훅의 반환값
 */
export const useDmMessages = (dmChatRoomId: number) => {
  return useApiQuery<DmMessageResponse[]>(
    ['dmMessages', dmChatRoomId.toString()],
    () => getDmMessages(dmChatRoomId),
    {
      staleTime: 0, // 메시지는 항상 최신 상태로 유지
      refetchOnWindowFocus: true, // 창이 포커스될 때 다시 가져오기
      retry: 1, // 실패 시 1번 재시도
      enabled: dmChatRoomId !== -1 && dmChatRoomId > 0, // 유효한 dmChatRoomId일 때만 쿼리 실행
    },
  );
};

/**
 * DM 메시지 전송을 위한 React Query 뮤테이션 훅
 * @returns useMutation 훅의 반환값
 */
export const useSendDmMessage = () => {
  return useApiMutation<
    DmMessageResponse,
    {dmChatRoomId: number; content: string}
  >(
    'sendDmMessage',
    ({dmChatRoomId, content}) => sendDmMessage(dmChatRoomId, content),
    {
      onSuccess: response => {
        console.log('DM 메시지 전송 성공:', response.data);
      },
      onError: error => {
        console.error('DM 메시지 전송 실패:', error.message);
      },
    },
  );
};
