import axios from 'axios';
import {ApiResponse} from '@/shared/lib/api/hooks';
import {config} from '@/shared/config/env';

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
});

// 이메일 인증 코드 전송 API
export const sendVerificationCode = async (
  email: string,
): Promise<ApiResponse<void>> => {
  const endpoint = '/api/auth/code';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 인증 코드 전송: ${url}`, {email});
  try {
    const response = await apiClient.post(endpoint, null, {
      params: {email: email},
    });
    return {
      data: response.data.data,
      success: true,
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
        throw new Error('잘못된 요청입니다. 이메일 형식을 확인해주세요.');
      } else if (status === 429) {
        throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '인증 코드 전송에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

// 이메일 인증 코드 검증 API
export const verifyCode = async (
  email: string,
  code: string,
): Promise<ApiResponse<{verified: boolean}>> => {
  const endpoint = '/api/auth/verify-code';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 인증 코드 검증: ${url}`, {email, code});
  try {
    const response = await apiClient.get(endpoint, {
      params: {email, code},
    });
    return {
      data: response.data.data,
      success: true,
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
        throw new Error(
          '잘못된 요청입니다. 이메일과 인증 코드를 확인해주세요.',
        );
      } else if (status === 401 || status === 403) {
        throw new Error('유효하지 않은 인증 코드입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '인증 코드 확인에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};
