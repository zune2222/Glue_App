import axios from 'axios';
import {ApiResponse} from '@/shared/lib/api/hooks';
import {config} from '@/shared/config/env';
import {secureStorage} from '@/shared/lib/security';
import {apiClient} from '@/features/auth/api/api';

// 모임 게시글 생성 요청 타입
export interface CreateGroupPostRequest {
  meeting: {
    meetingTitle: string;
    categoryId: number;
    meetingPlaceName: string;
    meetingTime: string; // 'yyyy-MM-dd'T'HH:mm:ss' 형식
    meetingPlaceLatitude?: number;
    meetingPlaceLongitude?: number;
    languageId: number;
    maxParticipants: number;
  };
  post: {
    title: string;
    content: string;
    imageUrls?: string[];
  };
}

// 모임 게시글 생성 응답 타입
export interface CreateGroupPostResponse {
  postId: number;
  meetingId: number;
}

/**
 * 모임 게시글을 생성하는 API 함수
 * @param data 모임 게시글 생성 요청 데이터
 * @returns API 응답 데이터
 */
export const createGroupPost = async (
  data: CreateGroupPostRequest,
): Promise<ApiResponse<CreateGroupPostResponse>> => {
  const endpoint = '/api/posts';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 모임 게시글 생성: ${url}`, data);

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기
    const response = await apiClient.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('모임 게시글 생성 응답:', response.data);

    // 서버 응답 처리
    return {
      data: response.data.result,
      success: response.data.isSuccess,
      message: response.data.message || '',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 네트워크 오류
      if (!error.response) {
        throw new Error('네트워크 연결에 문제가 있습니다.');
      }

      // HTTP 상태 코드별 에러 처리
      const status = error.response.status;
      if (status === 400) {
        throw new Error('잘못된 요청입니다. 입력 정보를 확인해주세요.');
      } else if (status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (status === 403) {
        throw new Error('모임 게시글을 생성할 권한이 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '모임 게시글 생성에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};
