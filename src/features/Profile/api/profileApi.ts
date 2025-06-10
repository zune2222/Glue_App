import axios from 'axios';
import {config} from '@/shared/config/env';
import {secureStorage} from '@shared/lib/security';

// API 응답 타입 정의
export interface MyPageResponse {
  httpStatus: {
    error: boolean;
    is4xxClientError: boolean;
    is5xxServerError: boolean;
    is1xxInformational: boolean;
    is2xxSuccessful: boolean;
    is3xxRedirection: boolean;
  };
  isSuccess: boolean;
  message: string;
  code: number;
  result: {
    profileImageUrl: string;
    userNickname: string;
    description: string;
    mainLanguage: number;
    mainLanguageLevel: number;
    learningLanguage: number;
    learningLanguageLevel: number;
  };
}

// Axios 인스턴스 생성
const profileApi = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
});

// 요청 인터셉터: 인증 토큰 추가
profileApi.interceptors.request.use(
  async config => {
    try {
      const token = await secureStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 마이페이지 정보 조회 API
export const getMyPageInfo = async (): Promise<MyPageResponse['result']> => {
  try {
    const response = await profileApi.get<MyPageResponse>('/api/users/my-page');

    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(
        response.data.message || '마이페이지 정보를 가져오는데 실패했습니다.',
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('네트워크 연결에 문제가 있습니다.');
      }

      const status = error.response.status;
      if (status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (status === 404) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      const errorMessage =
        error.response.data?.message ||
        '마이페이지 정보를 가져오는데 실패했습니다.';
      throw new Error(errorMessage);
    }

    throw error;
  }
};
