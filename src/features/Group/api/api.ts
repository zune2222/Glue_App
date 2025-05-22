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

// 게시글 목록 아이템 타입 (서버 DTO에 맞춤)
export interface PostItem {
  postId: number;
  viewCount: number;
  categoryId: number;
  title: string;
  content: string;
  likeCount: number;
  currentParticipants: number;
  maxParticipants: number;
  createdAt: string;
  thumbnailUrl: string | null;
}

// 게시글 목록 응답 타입 (서버 DTO에 맞춤)
export interface GetPostsResponse {
  hasNext: boolean;
  posts: PostItem[];
}

// 게시글 목록 요청 파라미터 타입
export interface GetPostsParams {
  lastPostId?: number;
  size?: number;
  categoryId?: number;
}

// 모임 상세 응답 타입 (서버 DTO에 맞춤)
export interface GetPostResponse {
  meeting: {
    meetingId: number;
    categoryId: number;
    creator: {
      userId: number;
      userNickname: string;
      profileImageUrl: string | null;
    };
    meetingTime: string;
    currentParticipants: number;
    maxParticipants: number;
    languageId: number;
    meetingStatus: number;
    participants: Array<{
      userId: number;
      nickname: string;
      profileImageUrl: string | null;
    }>;
    createdAt: string;
    updatedAt: string;
  };
  post: {
    postId: number;
    title: string;
    content: string;
    viewCount: number;
    bumpedAt: string | null;
    likeCount: number;
    postImageUrl: Array<{
      postImageId: number;
      imageUrl: string;
      imageOrder: number;
    }>;
  };
}

/**
 * 모임 게시글 목록을 가져오는 API 함수
 * @param params 게시글 목록 요청 파라미터
 * @returns API 응답 데이터
 */
export const getPosts = async (
  params?: GetPostsParams,
): Promise<ApiResponse<GetPostsResponse>> => {
  const endpoint = '/api/posts';
  const url = `${config.API_URL}${endpoint}`;

  // 쿼리 파라미터 구성
  const queryParams: Record<string, string> = {};
  if (params?.lastPostId !== undefined) {
    queryParams.lastPostId = params.lastPostId.toString();
  }
  if (params?.size !== undefined) {
    queryParams.size = params.size.toString();
  }
  if (params?.categoryId !== undefined) {
    queryParams.categoryId = params.categoryId.toString();
  }

  console.log(`[API 요청] 모임 게시글 목록 조회: ${url}`, queryParams);

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기
    const response = await apiClient.get(endpoint, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('모임 게시글 목록 응답:', response.data);

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
      if (status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (status === 403) {
        throw new Error('모임 게시글 목록을 조회할 권한이 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '모임 게시글 목록 조회에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

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

/**
 * 모임 상세 정보를 가져오는 API 함수
 * @param postId 모임 게시글 ID
 * @returns API 응답 데이터
 */
export const getGroupDetail = async (
  postId: number,
): Promise<ApiResponse<GetPostResponse>> => {
  const endpoint = `/api/posts/${postId}`;
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 모임 상세 정보 조회: ${url}`);

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기
    const response = await apiClient.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('모임 상세 정보 응답:', response.data);

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
      if (status === 404) {
        throw new Error('존재하지 않는 모임입니다.');
      } else if (status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (status === 403) {
        throw new Error('모임 상세 정보를 조회할 권한이 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '모임 상세 정보 조회에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

/**
 * 모임에 참여하는 API 함수
 * @param meetingId 참여할 모임 ID
 * @returns API 응답 데이터
 */
export const joinGroup = async (
  meetingId: number,
): Promise<ApiResponse<boolean>> => {
  const endpoint = `/api/meetings/${meetingId}/participants`;
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 모임 참여: ${url}`);

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기
    const response = await apiClient.post(
      endpoint,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('모임 참여 응답:', response.data);

    // 서버 응답 처리
    return {
      data: true,
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
        throw new Error('모임에 참여할 권한이 없습니다.');
      } else if (status === 409) {
        throw new Error('이미 참여한 모임입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '모임 참여에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};
