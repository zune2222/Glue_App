import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQueryClient} from '@tanstack/react-query';
import {config} from '@/shared/config/env';
import {logger} from '@/shared/lib/logger';
import {secureStorage} from '@/shared/lib/security';
import {api} from '@/shared/api/client';
import {ApiResponse} from '@/shared/lib/api/hooks';

// 인증 상태 타입
export type AuthStatus = 'initial' | 'authenticated' | 'unauthenticated';

// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: string;
}

// 인증 응답 타입
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * 인증 프로세스를 관리하는 훅
 * 앱 전반에 걸쳐 인증 상태를 제공합니다.
 */
export const useAuth = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('initial');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await secureStorage.getToken();

        if (token) {
          // 실제 앱에서는 토큰 유효성 검사 필요
          const isValid = await secureStorage.isTokenValid();

          if (isValid) {
            // 사용자 정보 불러오기 로직
            // 이 예시에서는 사용자 정보가 저장되어 있다고 가정
            const userJson = await AsyncStorage.getItem('user_info');

            if (userJson) {
              const userData = JSON.parse(userJson) as User;
              setUser(userData);
              setAuthStatus('authenticated');
              logger.info('사용자 인증 상태: 로그인됨', {userId: userData.id});
            } else {
              // 토큰은 있지만 사용자 정보가 없는 경우
              setAuthStatus('unauthenticated');
              clearAuth();
            }
          } else {
            // 토큰이 유효하지 않은 경우
            setAuthStatus('unauthenticated');
            clearAuth();
          }
        } else {
          // 토큰이 없는 경우
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        logger.error('인증 상태 확인 중 오류 발생', error);
        setAuthStatus('unauthenticated');
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 로그인 처리
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setIsLoading(true);

        // 로그인 API 호출 (실제 앱에서는 API 클라이언트 사용)
        // 예제로만 구현 (실제로는 API 요청 필요)
        const response: ApiResponse<AuthResponse> = {
          data: {
            user: {
              id: '1',
              email,
              name: '사용자',
              createdAt: new Date().toISOString(),
            },
            token: 'mock_token_' + Date.now(),
          },
          success: true,
          message: '로그인 성공',
        };

        // 토큰 저장
        const saveResult = await secureStorage.saveToken(response.data.token);

        if (saveResult) {
          // 사용자 정보 저장
          await AsyncStorage.setItem(
            'user_info',
            JSON.stringify(response.data.user),
          );

          // 상태 업데이트
          setUser(response.data.user);
          setAuthStatus('authenticated');

          logger.info('로그인 성공', {email});
          return true;
        } else {
          throw new Error('토큰 저장 실패');
        }
      } catch (error) {
        logger.error('로그인 실패', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 로그아웃 처리
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // 로그아웃 처리
      await clearAuth();

      // 인증 상태 업데이트
      setAuthStatus('unauthenticated');
      setUser(null);

      // 캐시된 쿼리 데이터 초기화 (선택적)
      queryClient.clear();

      logger.info('로그아웃 성공');
      return true;
    } catch (error) {
      logger.error('로그아웃 실패', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  // 회원가입 처리
  const register = useCallback(
    async (email: string, password: string, name: string): Promise<boolean> => {
      try {
        setIsLoading(true);

        // 회원가입 API 호출 (실제 앱에서는 API 클라이언트 사용)
        // 예제로만 구현 (실제로는 API 요청 필요)
        const response: ApiResponse<AuthResponse> = {
          data: {
            user: {
              id: '1',
              email,
              name,
              createdAt: new Date().toISOString(),
            },
            token: 'mock_token_' + Date.now(),
          },
          success: true,
          message: '회원가입 성공',
        };

        // 토큰 저장
        const saveResult = await secureStorage.saveToken(response.data.token);

        if (saveResult) {
          // 사용자 정보 저장
          await AsyncStorage.setItem(
            'user_info',
            JSON.stringify(response.data.user),
          );

          // 상태 업데이트
          setUser(response.data.user);
          setAuthStatus('authenticated');

          logger.info('회원가입 성공', {email});
          return true;
        } else {
          throw new Error('토큰 저장 실패');
        }
      } catch (error) {
        logger.error('회원가입 실패', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 인증 정보 초기화 (내부용)
  const clearAuth = async () => {
    await secureStorage.removeToken();
    await AsyncStorage.removeItem('user_info');
    await api.clearAuthToken();
  };

  return {
    authStatus,
    user,
    isLoading,
    login,
    logout,
    register,
    isAuthenticated: authStatus === 'authenticated',
  };
};
