import {toastService} from './toast';
import {modalService} from './modal';
import {logger} from '@/shared/lib/logger';

/**
 * 알림 서비스
 * 앱 전체에서 사용하는 알림 서비스를 통합합니다.
 */
export const notificationService = {
  /**
   * 토스트 알림 관련 메서드
   */
  toast: toastService,

  /**
   * 모달 알림 관련 메서드
   */
  modal: modalService,

  /**
   * 오류 알림 표시
   * @param error 오류 객체
   * @param fallbackMessage 기본 오류 메시지
   */
  showError(error: unknown, fallbackMessage = '오류가 발생했습니다.') {
    let message = fallbackMessage;

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    logger.error('오류 알림', error);
    this.toast.error('오류', message);
  },

  /**
   * 성공 알림 표시
   * @param message 성공 메시지
   */
  showSuccess(message: string) {
    this.toast.success('성공', message);
  },

  /**
   * 정보 알림 표시
   * @param message 정보 메시지
   */
  showInfo(message: string) {
    this.toast.info('알림', message);
  },

  /**
   * 주의 알림 표시
   * @param message 주의 메시지
   */
  showWarning(message: string) {
    this.toast.warning('주의', message);
  },

  /**
   * 확인 알림 표시
   * @param message 확인 메시지
   * @param onConfirm 확인 시 콜백
   */
  confirm(message: string, onConfirm: () => void) {
    this.modal.confirm('확인', message, onConfirm);
  },
};

export * from './toast';
export * from './modal';
