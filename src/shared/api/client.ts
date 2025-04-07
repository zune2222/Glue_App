import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiResponse} from '@/shared/lib/api/hooks';
import {config} from '@/shared/config/env';
import {logger} from '@/shared/lib/logger';
import {perfMonitor} from '@/shared/lib/performance';
import {ApiError, NetworkError, ErrorCode} from '@/shared/lib/errors';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      // 요청 시작 시간 저장
      const startTime = performance.now();

      // 요청 식별자
      const requestId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      // 요청 정보 저장
      if (config.headers) {
        config.headers['X-Request-ID'] = requestId;
        config.metadata = {
          startTime,
          requestId,
        };
      }

      // 인증 토큰 추가
      const token = await AsyncStorage.getItem(config.AUTH_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 요청 로깅
      logger.logRequest(
        config.method?.toUpperCase() || 'GET',
        config.url || '',
        config.data,
      );

      return config;
    } catch (error) {
      logger.error('요청 인터셉터 오류', error);
      return config;
    }
  },
  (error: AxiosError) => {
    logger.error('요청 오류', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    try {
      // 성능 측정
      if (response.config.metadata?.startTime) {
        perfMonitor.measureNetworkRequest(
          response.config.method?.toUpperCase() || 'GET',
          response.config.url || '',
          response.config.metadata.startTime,
        );
      }

      // 응답 로깅
      logger.logResponse(
        response.config.method?.toUpperCase() || 'GET',
        response.config.url || '',
        response.status,
        response.data,
      );

      // 응답 변환: API 응답 구조에 맞게 조정
      return {
        data: response.data.data || response.data,
        success: true,
        message: response.data.message || '',
      } as ApiResponse<any>;
    } catch (error) {
      logger.error('응답 처리 오류', error);
      throw error;
    }
  },
  async (error: AxiosError) => {
    // 에러 핸들링
    if (error.response) {
      // 서버 응답이 있는 에러 (4xx, 5xx 에러)
      logger.logError(
        error.config?.method?.toUpperCase() || 'GET',
        error.config?.url || '',
        error.response.status,
        error.response.data,
      );

      // 성능 측정 (응답은 받았으나 에러인 경우)
      if (error.config?.metadata?.startTime) {
        perfMonitor.measureNetworkRequest(
          error.config.method?.toUpperCase() || 'GET',
          error.config.url || '',
          error.config.metadata.startTime,
        );
      }

      // 에러 타입에 따른 처리
      switch (error.response.status) {
        case 401: // 인증 실패
          // 토큰 삭제
          await AsyncStorage.removeItem(config.AUTH_STORAGE_KEY);

          // API 에러 생성
          throw new ApiError(
            '인증이 필요합니다.',
            ErrorCode.AUTH_REQUIRED,
            401,
          );

        case 403: // 권한 없음
          throw new ApiError(
            '접근 권한이 없습니다.',
            ErrorCode.PERMISSION_DENIED,
            403,
          );

        case 404: // 리소스 없음
          throw new ApiError(
            '요청한 리소스를 찾을 수 없습니다.',
            ErrorCode.NOT_FOUND,
            404,
          );

        case 422: // 유효성 검사 실패
          throw new ApiError(
            '입력 데이터가 유효하지 않습니다.',
            ErrorCode.VALIDATION_ERROR,
            422,
          );

        case 500: // 서버 에러
        case 502:
        case 503:
          throw new ApiError(
            '서버 오류가 발생했습니다.',
            ErrorCode.SERVER_ERROR,
            error.response.status,
          );

        default:
          throw new ApiError(
            '알 수 없는 오류가 발생했습니다.',
            'UNKNOWN_ERROR',
            error.response.status,
          );
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류)
      logger.error('네트워크 오류', {
        url: error.config?.url,
        method: error.config?.method,
      });

      throw new NetworkError('네트워크 연결을 확인해주세요.');
    } else {
      // 요청 자체를 보내지 못한 경우
      logger.error('API 요청 오류', error);

      throw new Error('요청 준비 중 오류가 발생했습니다.');
    }
  },
);

// API 서비스 함수들
export const api = {
  /**
   * 네트워크 상태 확인
   * @param isConnected 네트워크 연결 상태
   */
  checkNetworkConnection(isConnected: boolean | null) {
    if (!isConnected) {
      throw new NetworkError();
    }
  },

  /**
   * 인증 토큰 설정
   */
  async setAuthToken(token: string) {
    try {
      await AsyncStorage.setItem(config.AUTH_STORAGE_KEY, token);
      return true;
    } catch (error) {
      logger.error('인증 토큰 저장 오류', error);
      return false;
    }
  },

  /**
   * 인증 토큰 삭제
   */
  async clearAuthToken() {
    try {
      await AsyncStorage.removeItem(config.AUTH_STORAGE_KEY);
      return true;
    } catch (error) {
      logger.error('인증 토큰 삭제 오류', error);
      return false;
    }
  },
};

export default apiClient;
