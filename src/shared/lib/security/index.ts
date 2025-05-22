import * as Keychain from 'react-native-keychain';
import {config} from '@/shared/config/env';
import {logger} from '@/shared/lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

// 사용자 ID를 AsyncStorage에 저장하기 위한 키
const USER_ID_STORAGE_KEY = 'user_id';

/**
 * 보안 스토리지 유틸리티
 * 민감한 데이터(토큰 등)를 안전하게 저장합니다.
 */
export const secureStorage = {
  /**
   * 인증 토큰을 안전하게 저장합니다.
   */
  async saveToken(token: string): Promise<boolean> {
    try {
      const result = await Keychain.setGenericPassword(
        config.AUTH_STORAGE_KEY,
        token,
      );

      // 토큰 저장 후 사용자 ID를 추출하여 AsyncStorage에 저장
      try {
        const userId = await this.extractUserIdFromToken(token);
        if (userId) {
          await AsyncStorage.setItem(USER_ID_STORAGE_KEY, String(userId));
          logger.info('사용자 ID 저장 성공', {userId});
        }
      } catch (idError) {
        logger.error('토큰에서 사용자 ID 추출 실패', idError);
      }

      return !!result;
    } catch (error) {
      logger.error('Failed to save auth token', error);
      return false;
    }
  },

  /**
   * 저장된 인증 토큰을 가져옵니다.
   */
  async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.password) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      logger.error('Failed to get auth token', error);
      return null;
    }
  },

  /**
   * 인증 토큰을 삭제합니다.
   */
  async removeToken(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(USER_ID_STORAGE_KEY);
      return await Keychain.resetGenericPassword();
    } catch (error) {
      logger.error('Failed to remove auth token', error);
      return false;
    }
  },

  /**
   * 인증 토큰의 유효성을 확인합니다.
   * 실제 구현에서는 토큰의 만료 시간 등을 검사할 수 있습니다.
   */
  async isTokenValid(): Promise<boolean> {
    const token = await this.getToken();
    return !!token; // 단순 존재 여부 확인
  },

  /**
   * JWT 토큰에서 사용자 ID를 추출합니다.
   */
  async extractUserIdFromToken(token: string): Promise<number | null> {
    try {
      const decoded = jwtDecode<any>(token);
      logger.info('JWT 디코드 성공', decoded);

      // 다양한 필드명 확인 (각 백엔드에 따라 다를 수 있음)
      if (decoded.memberId) {
        logger.info('memberId 필드에서 사용자 ID 발견', decoded.memberId);
        return Number(decoded.memberId);
      } else if (decoded.sub) {
        return Number(decoded.sub);
      } else if (decoded.id) {
        return Number(decoded.id);
      } else if (decoded.userId) {
        return Number(decoded.userId);
      } else if (decoded.user_id) {
        return Number(decoded.user_id);
      }

      // 전체 디코딩 결과 출력 (디버깅용)
      logger.warn('토큰에서 사용자 ID를 찾을 수 없음. 전체 내용:', decoded);
      return null;
    } catch (error) {
      logger.error('JWT 디코드 실패', error);
      return null;
    }
  },

  /**
   * 현재 로그인된 사용자의 ID를 가져옵니다.
   */
  async getUserId(): Promise<number | null> {
    try {
      // 1. AsyncStorage에서 먼저 확인 (가장 빠름)
      const storedId = await AsyncStorage.getItem(USER_ID_STORAGE_KEY);
      if (storedId) {
        return Number(storedId);
      }

      // 2. 저장된 값이 없으면 토큰에서 추출
      const token = await this.getToken();
      if (token) {
        const userId = await this.extractUserIdFromToken(token);
        if (userId) {
          // 추출된 ID를 AsyncStorage에 저장하여 다음에는 빠르게 접근
          await AsyncStorage.setItem(USER_ID_STORAGE_KEY, String(userId));
          return userId;
        }
      }

      return null;
    } catch (error) {
      logger.error('사용자 ID 가져오기 실패', error);
      return null;
    }
  },
};

/**
 * 민감한 데이터를 마스킹합니다.
 * 예: 전화번호, 이메일 등
 */
export const maskSensitiveData = {
  /**
   * 이메일 주소를 마스킹합니다.
   * 예: jo***@example.com
   */
  email(email: string): string {
    if (!email || email.length < 5) return email;

    const [local, domain] = email.split('@');
    if (!domain) return email;

    let maskedLocal = local;
    if (local.length > 2) {
      maskedLocal = local.substring(0, 2) + '*'.repeat(local.length - 2);
    }

    return `${maskedLocal}@${domain}`;
  },

  /**
   * 전화번호를 마스킹합니다.
   * 예: 010-****-5678
   */
  phoneNumber(phone: string): string {
    if (!phone || phone.length < 4) return phone;

    // 하이픈 제거
    const digits = phone.replace(/-/g, '');

    // 전화번호 길이에 따른 마스킹
    if (digits.length === 11) {
      // 휴대폰 번호: 010-XXXX-5678
      return `${digits.substring(0, 3)}-****-${digits.substring(7)}`;
    } else if (digits.length === 10) {
      // 일반 전화번호: 02-XXX-5678
      const areaCode = digits.substring(0, 2);
      return `${areaCode}-***-${digits.substring(5)}`;
    }

    // 기타 형식의 전화번호
    return (
      digits.substring(0, Math.floor(digits.length / 2)) +
      '*'.repeat(Math.ceil(digits.length / 2))
    );
  },
};
