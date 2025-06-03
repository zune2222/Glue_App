import axios from 'axios';
import {ApiResponse} from '@/shared/lib/api/hooks';
import {config} from '@/shared/config/env';

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
});

// 서버 응답에 맞게 수정된 응답 인터페이스
export interface ApiResponseDto<T> {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: T;
}

// 카카오 로그인 API
export interface KakaoSigninRequest {
  kakaoToken: string;
  fcmToken?: string;
}

// 서버 응답 구조에 맞게 수정된 응답 인터페이스
export interface KakaoSigninResponse {
  accessToken: string;
}

// 사용자 등록 여부 확인을 위한 커스텀 에러
export class NotRegisteredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotRegisteredError';
  }
}

export const signinWithKakao = async (
  kakaoToken: string,
  fcmToken?: string,
): Promise<ApiResponse<KakaoSigninResponse>> => {
  const endpoint = '/api/auth/kakao/signin';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 카카오 로그인: ${url}`, {kakaoToken, fcmToken});

  try {
    const response = await apiClient.post(endpoint, {
      kakaoToken,
      fcmToken,
    });

    console.log('카카오 로그인 서버 응답:', response.data);

    // 서버 응답 구조에 맞게 처리
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

      if (error.response.data.message === '존재하지 않는 사용자입니다') {
        return {
          data: {accessToken: ''},
          success: false,
          message: '존재하지 않는 사용자입니다',
        };
      }
      // HTTP 상태 코드별 에러 처리
      const status = error.response.status;
      if (status === 400) {
        throw new Error('잘못된 요청입니다. 카카오 토큰을 확인해주세요.');
      } else if (status === 401) {
        throw new Error('유효하지 않은 카카오 토큰입니다.');
      } else if (status === 404) {
        // 사용자가 등록되어 있지 않은 경우
        throw new NotRegisteredError('등록되지 않은 사용자입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '카카오 로그인에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

// 카카오 회원가입 API
export interface KakaoSignupRequest {
  oauthId: string;
  nickname: string;
  realName: string;
  gender: number;
  birthDate: string;
  description: string;
  major: number;
  majorVisibility: number;
  email: string;
  school: number;
  profileImageUrl?: string;
  systemLanguage: number;
  languageMain: number;
  languageMainLevel: number;
  languageLearn: number;
  languageLearnLevel: number;
  meetingVisibility: number;
  likeVisibility: number;
  guestbooksVisibility: number;
}

// 서버 응답 구조에 맞게 수정된 응답 인터페이스
export interface KakaoSignupResponse {
  accessToken: string;
}

export const signupWithKakao = async (
  data: KakaoSignupRequest,
): Promise<ApiResponse<KakaoSignupResponse>> => {
  const endpoint = '/api/auth/kakao/signup';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 카카오 회원가입: ${url}`, data);

  try {
    const response = await apiClient.post(endpoint, data);

    console.log('카카오 회원가입 서버 응답:', response.data);

    // 서버 응답 구조에 맞게 처리
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
      } else if (status === 409) {
        throw new Error('이미 가입된 사용자입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '회원가입에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

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

// 애플 로그인 API
export interface AppleSigninRequest {
  authorizationCode: string;
  fcmToken?: string;
}

// 애플 로그인 응답 인터페이스
export interface AppleSigninResponse {
  accessToken: string;
}

export const signinWithApple = async (
  authorizationCode: string,
  fcmToken?: string,
): Promise<ApiResponse<AppleSigninResponse>> => {
  const endpoint = '/api/auth/apple/signin';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 애플 로그인: ${url}`, {authorizationCode, fcmToken});

  try {
    const response = await apiClient.post(endpoint, {
      authorizationCode,
      fcmToken,
    });

    console.log('애플 로그인 서버 응답:', response.data);

    // 서버 응답 구조에 맞게 처리
    return {
      data: response.data.result,
      success: response.data.isSuccess,
      message: response.data.message || '',
    };
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      // 네트워크 오류
      if (!error.response) {
        throw new Error('네트워크 연결에 문제가 있습니다.');
      }

      if (error.response.data.message === '존재하지 않는 사용자입니다') {
        return {
          data: {accessToken: ''},
          success: false,
          message: '존재하지 않는 사용자입니다',
        };
      }
      // HTTP 상태 코드별 에러 처리
      const status = error.response.status;
      if (status === 400) {
        throw new Error('잘못된 요청입니다. 애플 인증 코드를 확인해주세요.');
      } else if (status === 401) {
        throw new Error('등록되지 않은 사용자입니다.');
      } else if (status === 404) {
        // 사용자가 등록되어 있지 않은 경우
        throw new NotRegisteredError('등록되지 않은 사용자입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '애플 로그인에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

// 애플 회원가입 API
export interface AppleSignupRequest {
  authorizationCode: string;
  userName: string;
  realName: string;
  nickname: string;
  gender: number;
  birthDate: string;
  nation: number;
  description?: string;
  major: number;
  majorVisibility: number;
  email: string;
  school?: number;
  profileImageUrl?: string;
  systemLanguage?: number;
  languageMain?: number;
  languageMainLevel?: number;
  languageLearn?: number;
  languageLearnLevel?: number;
  meetingVisibility?: number;
  likeVisibility?: number;
  guestbooksVisibility?: number;
}

// 애플 회원가입 응답 인터페이스
export interface AppleSignupResponse {
  accessToken: string;
}

export const signupWithApple = async (
  data: AppleSignupRequest,
): Promise<ApiResponse<AppleSignupResponse>> => {
  const endpoint = '/api/auth/apple/signup';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 애플 회원가입: ${url}`, data);

  try {
    const response = await apiClient.post(endpoint, data);

    console.log('애플 회원가입 서버 응답:', response.data);

    // 서버 응답 구조에 맞게 처리
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
      } else if (status === 409) {
        throw new Error('이미 가입된 사용자입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '회원가입에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

// 닉네임 중복 확인 응답 타입
export interface NicknameCheckResponse {
  httpStatus: {
    is4xxClientError: boolean;
    error: boolean;
    is5xxServerError: boolean;
    is1xxInformational: boolean;
    is2xxSuccessful: boolean;
    is3xxRedirection: boolean;
  };
  isSuccess: boolean;
  message: string;
  code: number;
  result: boolean; // true: 중복됨, false: 사용 가능
}

// 닉네임 중복 확인 API
export const checkNicknameDuplicate = async (
  nickname: string,
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.get<NicknameCheckResponse>(
      `/api/auth/nickname/${encodeURIComponent(nickname)}`,
    );

    console.log('닉네임 중복 확인 API 응답:', response.data);

    // NicknameCheckResponse를 ApiResponse<boolean> 형태로 변환
    // API에서 result: true = 사용 가능, false = 중복됨일 가능성이 높음
    // 우리 로직에서는 true = 중복됨, false = 사용 가능이므로 반대로 변환
    return {
      data: !response.data.result, // API result를 반대로 변환
      success: response.data.isSuccess,
      message: response.data.message || '',
    };
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error);
    throw error;
  }
};
