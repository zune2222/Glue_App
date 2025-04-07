import Toast, { ToastShowParams } from 'react-native-toast-message';
import { logger } from '@/shared/lib/logger';

/**
 * 토스트 타입
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * 토스트 알림 옵션 타입
 */
export interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom';
  onPress?: () => void;
  props?: Record<string, any>;
}

/**
 * 토스트 알림 서비스
 * 앱 전체에서 일관된 형태의 토스트 알림을 표시합니다.
 */
export const toastService = {
  /**
   * 성공 토스트 표시
   * @param title 제목
   * @param message 메시지
   * @param options 옵션
   */
  success(title: string, message?: string, options?: ToastOptions) {
    this.show(title, message, 'success', options);
    logger.info(`토스트 표시(성공): ${title}`, { message });
  },

  /**
   * 에러 토스트 표시
   * @param title 제목
   * @param message 메시지
   * @param options 옵션
   */
  error(title: string, message?: string, options?: ToastOptions) {
    this.show(title, message, 'error', options);
    logger.error(`토스트 표시(에러): ${title}`, { message });
  },

  /**
   * 정보 토스트 표시
   * @param title 제목
   * @param message 메시지
   * @param options 옵션
   */
  info(title: string, message?: string, options?: ToastOptions) {
    this.show(title, message, 'info', options);
    logger.info(`토스트 표시(정보): ${title}`, { message });
  },

  /**
   * 경고 토스트 표시
   * @param title 제목
   * @param message 메시지
   * @param options 옵션
   */
  warning(title: string, message?: string, options?: ToastOptions) {
    this.show(title, message, 'warning', options);
    logger.warn(`토스트 표시(경고): ${title}`, { message });
  },

  /**
   * 토스트 표시
   * @param title 제목 
   * @param message 메시지
   * @param type 토스트 타입
   * @param options 옵션
   */
  show(title: string, message?: string, type: ToastType = 'info', options?: ToastOptions) {
    try {
      const toastParams: ToastShowParams = {
        type,
        text1: title,
        text2: message || '',
        visibilityTime: options?.duration || 3000,
        position: options?.position || 'bottom',
        autoHide: true,
        topOffset: 60,
        bottomOffset: 60,
        onPress: options?.onPress,
        props: options?.props,
      };

      Toast.show(toastParams);
    } catch (error) {
      logger.error('토스트 표시 오류', error);
    }
  },

  /**
   * 현재 표시 중인 토스트 숨기기
   */
  hide() {
    Toast.hide();
  }
}; 