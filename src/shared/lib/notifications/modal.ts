import {Subject} from 'rxjs';
import {logger} from '@/shared/lib/logger';

/**
 * 모달 타입
 */
export type ModalType = 'alert' | 'confirm' | 'custom';

/**
 * 버튼 타입
 */
export interface ModalButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * 모달 옵션 타입
 */
export interface ModalOptions {
  title?: string;
  message?: string;
  type?: ModalType;
  buttons?: ModalButton[];
  cancelable?: boolean;
  customContent?: React.ReactNode;
  contentProps?: Record<string, any>;
}

/**
 * 모달 상태 타입
 */
export interface ModalState extends ModalOptions {
  visible: boolean;
  id: string;
}

// 내부 상태 관리를 위한 Subject
const modalSubject = new Subject<ModalState>();

// 초기 상태
const initialState: ModalState = {
  visible: false,
  id: '',
  title: '',
  message: '',
  type: 'alert',
  buttons: [],
  cancelable: true,
};

// 현재 모달 상태
let currentModal: ModalState = {...initialState};

/**
 * 모달 알림 서비스
 * 앱 전체에서 일관된 형태의 모달 알림을 표시합니다.
 */
export const modalService = {
  // 모달 상태 구독을 위한 Observable
  modalState$: modalSubject.asObservable(),

  /**
   * 알림 모달 표시
   * @param title 제목
   * @param message 메시지
   * @param onConfirm 확인 시 콜백
   */
  alert(title: string, message: string, onConfirm?: () => void) {
    const buttons: ModalButton[] = [
      {
        text: '확인',
        onPress: () => {
          this.hide();
          onConfirm?.();
        },
        style: 'default',
      },
    ];

    this.show({
      title,
      message,
      type: 'alert',
      buttons,
      cancelable: true,
    });

    logger.info(`모달 표시(알림): ${title}`, {message});
  },

  /**
   * 확인 모달 표시
   * @param title 제목
   * @param message 메시지
   * @param onConfirm 확인 시 콜백
   * @param onCancel 취소 시 콜백
   */
  confirm(
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
  ) {
    const buttons: ModalButton[] = [
      {
        text: '취소',
        onPress: () => {
          this.hide();
          onCancel?.();
        },
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => {
          this.hide();
          onConfirm?.();
        },
        style: 'default',
      },
    ];

    this.show({
      title,
      message,
      type: 'confirm',
      buttons,
      cancelable: true,
    });

    logger.info(`모달 표시(확인): ${title}`, {message});
  },

  /**
   * 커스텀 모달 표시
   * @param options 모달 옵션
   */
  custom(options: ModalOptions) {
    this.show({
      ...options,
      type: 'custom',
    });

    logger.info(`모달 표시(커스텀): ${options.title}`, {options});
  },

  /**
   * 모달 표시
   * @param options 모달 옵션
   */
  show(options: ModalOptions) {
    try {
      const id = `modal-${Date.now()}`;
      currentModal = {
        ...initialState,
        ...options,
        visible: true,
        id,
      };

      modalSubject.next(currentModal);
    } catch (error) {
      logger.error('모달 표시 오류', error);
    }
  },

  /**
   * 현재 표시 중인 모달 숨기기
   */
  hide() {
    currentModal = {
      ...currentModal,
      visible: false,
    };

    modalSubject.next(currentModal);

    // 잠시 후 모달 상태 초기화
    setTimeout(() => {
      currentModal = {...initialState};
      modalSubject.next(currentModal);
    }, 300);
  },

  /**
   * 현재 모달 상태 가져오기
   */
  getCurrentState(): ModalState {
    return currentModal;
  },
};
