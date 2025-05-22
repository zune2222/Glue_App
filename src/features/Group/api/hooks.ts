import {useApiMutation} from '@/shared/lib/api/hooks';
import {
  CreateGroupPostRequest,
  CreateGroupPostResponse,
  createGroupPost,
} from './api';

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
