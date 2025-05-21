import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '@/shared/lib/logger';

// FCM 토큰 저장 키
const FCM_TOKEN_STORAGE_KEY = 'fcm_token';

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
   * FCM 토큰 가져오기
   */
  async getToken(): Promise<string | null> {
    try {
      // 캐시된 토큰이 있으면 반환
      const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
      if (cachedToken) {
        logger.info('캐시된 FCM 토큰 사용');
        return cachedToken;
      }

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

      // 토큰 가져오기
      const token = await messaging().getToken();

      if (token) {
        // 토큰 캐싱
        await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        logger.info('FCM 토큰 획득 성공');
        return token;
      } else {
        logger.warn('FCM 토큰을 가져올 수 없습니다.');
        return null;
      }
    } catch (error) {
      logger.error('FCM 토큰 획득 에러:', error);
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
      return true;
    } catch (error) {
      logger.error('FCM 토큰 삭제 오류:', error);
      return false;
    }
  },
};
