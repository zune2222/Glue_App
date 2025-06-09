import {useApiQuery, useApiMutation, ApiResponse} from '@/shared/lib/api/hooks';
import {useQueryClient, useInfiniteQuery} from '@tanstack/react-query';
import {
  DmChatRoom,
  getHostedDmRooms,
  getParticipatedDmRooms,
  ActualDmChatRoomDetailResponse,
  getDmChatRoomDetail,
  DmMessageResponse,
  getDmMessages,
  sendDmMessage,
  toggleDmChatRoomNotification,
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
 * DM 메시지 목록을 무한 스크롤로 가져오는 React Query 훅
 * @param dmChatRoomId 채팅방 ID
 * @returns useInfiniteQuery 훅의 반환값
 */
export const useDmMessages = (dmChatRoomId: number) => {
  return useInfiniteQuery<ApiResponse<DmMessageResponse[]>, Error>({
    queryKey: ['dmMessages', dmChatRoomId.toString()],
    queryFn: async ({pageParam}) => {
      const cursorId = pageParam as number | undefined;
      const response = await getDmMessages(dmChatRoomId, cursorId, 20);
      return response;
    },
    getNextPageParam: lastPage => {
      // 이전 메시지를 가져오려면 현재 페이지의 첫 번째 메시지 ID를 커서로 사용
      if (lastPage.data && lastPage.data.length > 0) {
        const firstMessage = lastPage.data[0]; // 마지막이 아니라 첫 번째!
        console.log('📍 다음 페이지 커서:', firstMessage.dmMessageId);
        return firstMessage.dmMessageId;
      }
      return undefined; // 더 이상 페이지가 없음
    },
    getPreviousPageParam: _firstPage => {
      // 이전 페이지는 사용하지 않음 (채팅은 보통 아래에서 위로 로드)
      return undefined;
    },
    initialPageParam: undefined,
    staleTime: 0, // 메시지는 항상 최신 상태로 유지
    refetchOnWindowFocus: true, // 창이 포커스될 때 다시 가져오기
    retry: 1, // 실패 시 1번 재시도
    enabled: dmChatRoomId !== -1 && dmChatRoomId > 0, // 유효한 dmChatRoomId일 때만 쿼리 실행
  });
};

/**
 * DM 메시지 전송을 위한 React Query 뮤테이션 훅 (낙관적 업데이트 포함)
 * @returns useMutation 훅의 반환값
 */
export const useSendDmMessage = () => {
  const queryClient = useQueryClient();

  return useApiMutation<
    DmMessageResponse,
    {dmChatRoomId: number; content: string}
  >(
    'sendDmMessage',
    ({dmChatRoomId, content}) => sendDmMessage(dmChatRoomId, content),
    {
      // 낙관적 업데이트: 메시지 전송 전에 즉시 UI에 반영
      onMutate: async ({dmChatRoomId, content}) => {
        const queryKey = ['dmMessages', dmChatRoomId.toString()];

        // 진행 중인 refetch 취소
        await queryClient.cancelQueries({queryKey});

        // 이전 데이터 백업 (롤백용)
        const previousMessages = queryClient.getQueryData(queryKey);

        // 현재 사용자 ID 가져오기 (secureStorage에서)
        const {secureStorage} = await import('@shared/lib/security');
        const currentUserId = await secureStorage.getUserId();

        // 임시 메시지 생성
        const tempMessage: DmMessageResponse = {
          dmMessageId: Date.now(), // 임시 ID
          dmChatRoomId,
          content,
          createdAt: new Date().toISOString(),
          isRead: false,
          senderId: currentUserId || undefined,
          isTemp: true, // 임시 메시지 표시
        };

        // 낙관적 업데이트: 메시지 목록 맨 앞에 추가 (inverted이므로)
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old?.pages) return old;

          const newPages = [...old.pages];
          if (newPages.length > 0) {
            // 첫 번째 페이지 (최신 메시지들)에 새 메시지 추가
            newPages[0] = {
              ...newPages[0],
              data: [tempMessage, ...(newPages[0].data || [])],
            };
          }

          return {
            ...old,
            pages: newPages,
          };
        });

        return {previousMessages};
      },

      onSuccess: (response, {dmChatRoomId}) => {
        console.log('DM 메시지 전송 성공:', response.data);

        // 성공 시 메시지 목록 새로고침 (실제 서버 데이터로 동기화)
        queryClient.invalidateQueries({
          queryKey: ['dmMessages', dmChatRoomId.toString()],
        });

        // 채팅방 목록도 무효화 (마지막 메시지 업데이트를 위해)
        queryClient.invalidateQueries({
          queryKey: ['hostedDmRooms'],
        });
        queryClient.invalidateQueries({
          queryKey: ['participatedDmRooms'],
        });
      },

      onError: (error, {dmChatRoomId}, context) => {
        console.error('DM 메시지 전송 실패:', error.message);

        // 실패 시 이전 데이터로 롤백
        const typedContext = context as {previousMessages?: any} | undefined;
        if (typedContext?.previousMessages) {
          queryClient.setQueryData(
            ['dmMessages', dmChatRoomId.toString()],
            typedContext.previousMessages,
          );
        }
      },
    },
  );
};

/**
 * DM 채팅방 알림 설정 토글을 위한 React Query 뮤테이션 훅
 * @returns useMutation 훅의 반환값
 */
export const useToggleDmChatRoomNotification = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, {dmChatRoomId: number}>(
    'toggleDmChatRoomNotification',
    ({dmChatRoomId}) => toggleDmChatRoomNotification(dmChatRoomId),
    {
      onSuccess: (response, {dmChatRoomId}) => {
        console.log('✅ API 응답값:', response.data);
        const queryKey = ['dmChatRoomDetail', dmChatRoomId.toString()];

        // 서버 응답값으로 쿼리 데이터 업데이트
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              isPushNotificationOn: response.data, // 응답값 그대로 사용
            },
          };
        });
      },
      onError: error => {
        console.error('❌ 토글 실패:', error.message);
      },
    },
  );
};
