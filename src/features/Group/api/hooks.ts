import {
  useApiMutation,
  useApiInfiniteQuery,
  useApiQuery,
} from '@/shared/lib/api/hooks';
import {
  CreateGroupPostRequest,
  CreateGroupPostResponse,
  GetPostResponse,
  GetPostsResponse,
  createGroupPost,
  getPosts,
  getGroupDetail,
  joinGroup,
  toggleLike,
  bumpPost,
} from './api';
import {useQueryClient, InvalidateQueryFilters} from '@tanstack/react-query';

/**
 * 모임 게시글 생성을 위한 React Query 훅
 * @returns useApiMutation 훅의 반환값
 */
export const useCreateGroupPost = () => {
  return useApiMutation<CreateGroupPostResponse, CreateGroupPostRequest>(
    'createGroupPost',
    (data: CreateGroupPostRequest) => createGroupPost(data),
    {
      onSuccess: response => {
        console.log('모임 게시글 생성 성공:', response.data);
      },
      onError: error => {
        console.error('모임 게시글 생성 실패:', error.message);
      },
    },
  );
};

/**
 * 모임 게시글 목록을 무한 스크롤로 가져오기 위한 React Query 훅
 * @param categoryId 필터링할 카테고리 ID (선택 사항)
 * @param size 한 번에 가져올 게시글 수 (기본값: 10)
 * @returns useInfiniteQuery 훅의 반환값
 */
export const useInfinitePosts = (categoryId?: number, size = 10) => {
  return useApiInfiniteQuery<GetPostsResponse>(
    ['posts', categoryId ?? 'all'],

    // 페이지 파라미터를 기반으로 API 호출
    ({pageParam}) =>
      getPosts({
        lastPostId: pageParam as number | undefined,
        size,
        categoryId,
      }),

    // 다음 페이지 파라미터 추출 함수
    {
      getNextPageParam: (lastPage: any) => {
        // 더 이상 데이터가 없으면 undefined 반환 (무한 스크롤 중단)
        if (!lastPage.data.hasNext || lastPage.data.posts.length === 0) {
          return undefined;
        }

        // 마지막 페이지의 마지막 포스트 ID를 다음 페이지 파라미터로 반환
        const lastPostId =
          lastPage.data.posts[lastPage.data.posts.length - 1].postId;
        return lastPostId;
      },

      // 에러 발생 시 콜솔에 로그 출력
      onError: (error: any) => {
        console.error('모임 게시글 목록 조회 실패:', error.message);
      },
    },
  );
};

/**
 * 모임 상세 정보를 가져오기 위한 React Query 훅
 * @param postId 모임 게시글 ID
 * @returns useQuery 훅의 반환값
 */
export const useGroupDetail = (postId: number) => {
  return useApiQuery<GetPostResponse>(
    ['groupDetail', String(postId)],
    () => getGroupDetail(postId),
    {
      retry: 1,
    },
  );
};

/**
 * 모임 참여를 위한 React Query 훅
 * @returns useApiMutation 훅의 반환값
 */
export const useJoinGroup = () => {
  return useApiMutation<boolean, number>(
    'joinGroup',
    (meetingId: number) => joinGroup(meetingId),
    {
      onSuccess: () => {
        console.log('모임 참여 성공');
      },
      onError: error => {
        console.error('모임 참여 실패:', error.message);
      },
    },
  );
};

/**
 * 좋아요 토글을 위한 React Query 훅 (낙관적 업데이트 적용)
 * @param postId 게시글 ID
 * @returns useApiMutation 훅의 반환값
 */
export const useToggleLike = (postId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ['groupDetail', String(postId)];

  return useApiMutation<void, void>('toggleLike', () => toggleLike(postId), {
    // 낙관적 업데이트 적용
    onMutate: async () => {
      // 현재 쿼리 데이터 가져오기
      const previousData = queryClient.getQueryData<any>(queryKey);

      if (!previousData) return {previousData};

      // 낙관적으로 좋아요 수 업데이트
      const updatedData = {
        ...previousData,
        data: {
          ...previousData.data,
          post: {
            ...previousData.data.post,
            likeCount: previousData.data.post.likeCount + 1,
          },
        },
      };

      // 업데이트된 데이터로 쿼리 캐시 갱신
      queryClient.setQueryData(queryKey, updatedData);

      // 롤백을 위한 이전 데이터 반환
      return {previousData};
    },

    // 오류 발생 시 원래 데이터로 롤백
    onError: (error, _, context: any) => {
      console.error('좋아요 토글 실패:', error.message);
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    // 서버 응답 후에 데이터 리페치하여 실제 데이터 동기화
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      } as InvalidateQueryFilters);
    },
  });
};

/**
 * 게시글 끌어올리기를 위한 React Query 훅
 * @returns useApiMutation 훅의 반환값
 */
export const useBumpPost = () => {
  const queryClient = useQueryClient();

  return useApiMutation<void, number>(
    'bumpPost',
    (postId: number) => bumpPost(postId),
    {
      onSuccess: (_, postId) => {
        console.log('게시글 끌어올리기 성공:', postId);

        // 모임 상세 정보 캐시 갱신
        queryClient.invalidateQueries({
          queryKey: ['groupDetail', String(postId)],
        } as InvalidateQueryFilters);

        // 모임 목록 캐시 갱신
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        } as InvalidateQueryFilters);
      },
      onError: (error, postId) => {
        console.error(`게시글 ${postId} 끌어올리기 실패:`, error.message);
      },
    },
  );
};
