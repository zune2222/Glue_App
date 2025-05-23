import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '@/shared/lib/logger';

// FCM 토큰 저장 키
const FCM_TOKEN_STORAGE_KEY = 'fcm_token';
// 토큰 마지막 업데이트 시간 저장 키
const FCM_TOKEN_LAST_UPDATE_KEY = 'fcm_token_last_update';
// 토큰 캐시 유효 시간 (5분)
const TOKEN_CACHE_DURATION = 5 * 60 * 1000;

/**
 * FCM 메시징 서비스
 * 푸시 알림 관련 기능을 제공합니다.
 */
export const fcmService = {
  /**
   * 푸시 알림 권한 요청 (iOS에서만 필요)
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        logger.info(`FCM 권한 요청 결과: ${enabled ? '승인' : '거부'}`);
        return enabled;
      }

      // Android는 별도의 권한 요청이 필요 없음
      return true;
    } catch (error) {
      logger.error('FCM 권한 요청 에러:', error);
      return false;
    }
  },

  /**
   * iOS 디바이스를 FCM에 등록
   */
  async registerDevice(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
        logger.info('FCM 디바이스 등록 완료');
        return true;
      }
      return true; // Android는 별도 등록 불필요
    } catch (error) {
      logger.error('FCM 디바이스 등록 에러:', error);
      return false;
    }
  },

  /**
   * 캐시된 토큰이 유효한지 확인
   */
  async isCachedTokenValid(): Promise<boolean> {
    try {
      const lastUpdateStr = await AsyncStorage.getItem(
        FCM_TOKEN_LAST_UPDATE_KEY,
      );
      if (!lastUpdateStr) {
        return false;
      }

      const lastUpdate = parseInt(lastUpdateStr, 10);
      const now = Date.now();

      return now - lastUpdate < TOKEN_CACHE_DURATION;
    } catch (error) {
      logger.error('캐시 토큰 유효성 확인 에러:', error);
      return false;
    }
  },

  /**
   * FCM 토큰 가져오기 (개선된 버전)
   */
  async getToken(): Promise<string | null> {
    try {
      // iOS의 경우 권한 요청 필요
      if (Platform.OS === 'ios') {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
          logger.warn('FCM 권한이 없어 토큰을 가져올 수 없습니다.');
          return null;
        }

        // iOS의 경우 디바이스 등록 필요
        const isRegistered = await this.registerDevice();
        if (!isRegistered) {
          logger.warn(
            'FCM 디바이스 등록에 실패하여 토큰을 가져올 수 없습니다.',
          );
          return null;
        }
      }

      // 캐시된 토큰과 마지막 업데이트 시간 확인
      const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
      const isValidCache = await this.isCachedTokenValid();

      // 캐시가 유효하면 캐시된 토큰 반환
      if (cachedToken && isValidCache) {
        logger.info('유효한 캐시된 FCM 토큰 사용');
        return cachedToken;
      }

      // 항상 최신 토큰을 가져옴
      logger.info('최신 FCM 토큰을 가져오는 중...');
      const currentToken = await messaging().getToken();

      if (!currentToken) {
        logger.warn('FCM 토큰을 가져올 수 없습니다.');
        // 캐시된 토큰이라도 있으면 반환 (fallback)
        return cachedToken || null;
      }

      // 새 토큰과 캐시된 토큰이 다르면 캐시 업데이트
      if (currentToken !== cachedToken) {
        logger.info('FCM 토큰이 변경되어 캐시를 업데이트합니다.');
        await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, currentToken);
        await AsyncStorage.setItem(
          FCM_TOKEN_LAST_UPDATE_KEY,
          Date.now().toString(),
        );
      } else if (currentToken === cachedToken && !isValidCache) {
        // 토큰은 같지만 캐시 시간이 만료된 경우 업데이트 시간만 갱신
        logger.info('FCM 토큰은 동일하지만 캐시 시간을 갱신합니다.');
        await AsyncStorage.setItem(
          FCM_TOKEN_LAST_UPDATE_KEY,
          Date.now().toString(),
        );
      }

      logger.info('FCM 토큰 획득 성공');
      return currentToken;
    } catch (error) {
      logger.error('FCM 토큰 획득 에러:', error);

      // 에러 발생 시 캐시된 토큰을 fallback으로 사용
      try {
        const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
        if (cachedToken) {
          logger.warn(
            '에러 발생으로 캐시된 FCM 토큰을 fallback으로 사용합니다.',
          );
          return cachedToken;
        }
      } catch (cacheError) {
        logger.error('캐시된 토큰 읽기 에러:', cacheError);
      }

      return null;
    }
  },

  /**
   * FCM 토큰 갱신 리스너 등록
   * @param onTokenRefresh 토큰 갱신 시 호출될 콜백 함수
   */
  registerTokenRefreshListener(onTokenRefresh: (token: string) => void) {
    return messaging().onTokenRefresh(async token => {
      logger.info('FCM 토큰 갱신됨');

      // 캐시 업데이트
      await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
      await AsyncStorage.setItem(
        FCM_TOKEN_LAST_UPDATE_KEY,
        Date.now().toString(),
      );

      // 콜백 호출
      onTokenRefresh(token);
    });
  },

  /**
   * 현재 FCM 토큰 캐시 삭제
   */
  async clearToken(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(FCM_TOKEN_LAST_UPDATE_KEY);
      logger.info('FCM 토큰 캐시 삭제 완료');
      return true;
    } catch (error) {
      logger.error('FCM 토큰 삭제 오류:', error);
      return false;
    }
  },

  /**
   * 토큰 강제 새로고침
   */
  async forceRefreshToken(): Promise<string | null> {
    try {
      // 캐시 삭제
      await this.clearToken();

      // 새 토큰 가져오기
      return await this.getToken();
    } catch (error) {
      logger.error('FCM 토큰 강제 새로고침 에러:', error);
      return null;
    }
  },
};
