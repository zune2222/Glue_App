import {Client, IMessage} from '@stomp/stompjs';
import {config} from '@/shared/config/env';
import {secureStorage} from '@/shared/lib/security';
import {DmMessageResponse} from '../api/api';

// React Native에서 WebSocket 사용을 위한 설정
if (typeof global !== 'undefined') {
  // @ts-ignore
  global.WebSocket = global.WebSocket || require('ws');
}

// WebSocket 연결 상태 타입
export type WebSocketStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

// 메시지 콜백 타입
export type MessageCallback = (message: DmMessageResponse) => void;

// WebSocket 서비스 클래스
class WebSocketService {
  private client: Client | null = null;
  private status: WebSocketStatus = 'disconnected';
  private messageCallbacks: Map<number, MessageCallback[]> = new Map();
  private subscriptions: Map<string, any> = new Map();
  private currentUserId: number | null = null;

  /**
   * WebSocket URL 생성
   */
  private getWebSocketUrl(): string {
    // HTTP URL을 WebSocket URL로 변환
    const wsUrl = config.API_URL.replace('http://', 'ws://').replace(
      'https://',
      'wss://',
    );
    return `${wsUrl}/ws`;
  }

  /**
   * WebSocket 연결
   */
  async connect(): Promise<void> {
    if (this.status === 'connected' || this.status === 'connecting') {
      return;
    }

    try {
      this.status = 'connecting';

      // JWT 토큰 가져오기
      const token = await secureStorage.getToken();
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const wsUrl = this.getWebSocketUrl();
      console.log('[WebSocket] 연결 시도:', wsUrl);

      // STOMP 클라이언트 생성
      this.client = new Client({
        brokerURL: wsUrl,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: str => {
          console.log('[STOMP Debug]', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // 연결 성공 콜백
      this.client.onConnect = () => {
        console.log('[WebSocket] 연결됨');
        this.status = 'connected';
      };

      // 연결 해제 콜백
      this.client.onDisconnect = () => {
        console.log('[WebSocket] 연결 해제됨');
        this.status = 'disconnected';
      };

      // 에러 콜백
      this.client.onStompError = frame => {
        console.error('[WebSocket] STOMP 에러:', frame.headers['message']);
        console.error('[WebSocket] 추가 정보:', frame.body);
        this.status = 'error';
      };

      // WebSocket 에러 콜백
      this.client.onWebSocketError = error => {
        console.error('[WebSocket] WebSocket 에러:', error);
        this.status = 'error';
      };

      // 연결 시작
      this.client.activate();
    } catch (error) {
      console.error('[WebSocket] 연결 실패:', error);
      this.status = 'error';
      throw error;
    }
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.status = 'disconnected';
    this.messageCallbacks.clear();
    this.subscriptions.clear();
    this.currentUserId = null;

    console.log('[WebSocket] 모든 구독이 해제되었습니다.');
  }

  /**
   * 사용자별 메시지 구독 (문서 기준: /queue/dm/{userId})
   */
  subscribeToUserMessages(userId: number, _callback: MessageCallback): void {
    if (!this.client || this.status !== 'connected') {
      console.warn('[WebSocket] 연결되지 않음 - 사용자 메시지 구독 불가');
      return;
    }

    this.currentUserId = userId;
    const subscriptionKey = `user-messages-${userId}`;

    // 이미 구독 중인 경우 구독하지 않음
    if (this.subscriptions.has(subscriptionKey)) {
      console.log(`[WebSocket] 사용자 ${userId} 메시지 이미 구독 중`);
      return;
    }

    // 사용자 메시지 구독
    const subscription = this.client.subscribe(
      `/queue/dm/${userId}`,
      (message: IMessage) => {
        try {
          const messageData: DmMessageResponse = JSON.parse(message.body);
          console.log(
            `[WebSocket] 사용자 ${userId} 새 메시지 수신:`,
            messageData,
          );

          // 메시지가 속한 채팅방의 콜백들에게 알림
          const dmChatRoomId = messageData.dmChatRoomId;
          if (dmChatRoomId) {
            this.handleNewMessage(dmChatRoomId, messageData);
          }
        } catch (error) {
          console.error('[WebSocket] 사용자 메시지 파싱 에러:', error);
        }
      },
    );

    this.subscriptions.set(subscriptionKey, subscription);
    console.log(`[WebSocket] 사용자 ${userId} 메시지 구독됨`);
  }

  /**
   * 채팅방별 읽음 상태 구독 (문서 기준: /queue/dm/{dmChatRoomId}/readStatus)
   */
  subscribeToReadStatus(dmChatRoomId: number): void {
    if (!this.client || this.status !== 'connected') {
      console.warn('[WebSocket] 연결되지 않음 - 읽음 상태 구독 불가');
      return;
    }

    const subscriptionKey = `read-status-${dmChatRoomId}`;

    // 이미 구독 중인 경우 구독하지 않음
    if (this.subscriptions.has(subscriptionKey)) {
      return;
    }

    // 읽음 상태 구독
    const subscription = this.client.subscribe(
      `/queue/dm/${dmChatRoomId}/readStatus`,
      (message: IMessage) => {
        try {
          const readStatusData = JSON.parse(message.body);
          console.log(
            `[WebSocket] 채팅방 ${dmChatRoomId} 읽음 상태 업데이트:`,
            readStatusData,
          );
          // TODO: 읽음 상태 처리 로직 추가
        } catch (error) {
          console.error('[WebSocket] 읽음 상태 파싱 에러:', error);
        }
      },
    );

    this.subscriptions.set(subscriptionKey, subscription);
    console.log(`[WebSocket] 채팅방 ${dmChatRoomId} 읽음 상태 구독됨`);
  }

  /**
   * 채팅방 구독 (기존 메소드를 새로운 방식으로 변경)
   */
  subscribeToChatRoom(dmChatRoomId: number, callback: MessageCallback): void {
    if (!this.client || this.status !== 'connected') {
      console.warn('[WebSocket] 연결되지 않음 - 구독 불가');
      return;
    }

    // 콜백 등록
    if (!this.messageCallbacks.has(dmChatRoomId)) {
      this.messageCallbacks.set(dmChatRoomId, []);
    }
    this.messageCallbacks.get(dmChatRoomId)!.push(callback);

    // 현재 사용자 ID가 있으면 사용자 메시지 구독
    if (this.currentUserId) {
      this.subscribeToUserMessages(this.currentUserId, callback);
    }

    // 읽음 상태 구독
    this.subscribeToReadStatus(dmChatRoomId);

    console.log(`[WebSocket] 채팅방 ${dmChatRoomId} 구독됨`);
  }

  /**
   * 채팅방 구독 해제
   */
  unsubscribeFromChatRoom(dmChatRoomId: number): void {
    // 콜백 제거
    this.messageCallbacks.delete(dmChatRoomId);

    // 읽음 상태 구독 해제
    const readStatusKey = `read-status-${dmChatRoomId}`;
    const readStatusSubscription = this.subscriptions.get(readStatusKey);
    if (readStatusSubscription) {
      readStatusSubscription.unsubscribe();
      this.subscriptions.delete(readStatusKey);
      console.log(`[WebSocket] 채팅방 ${dmChatRoomId} 읽음 상태 구독 해제됨`);
    }

    console.log(`[WebSocket] 채팅방 ${dmChatRoomId} 구독 해제됨`);
  }

  /**
   * 사용자 메시지 구독 해제
   */
  unsubscribeFromUserMessages(userId: number): void {
    const subscriptionKey = `user-messages-${userId}`;
    const subscription = this.subscriptions.get(subscriptionKey);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
      console.log(`[WebSocket] 사용자 ${userId} 메시지 구독 해제됨`);
    }
  }

  /**
   * 읽음 처리 메시지 전송
   */
  sendReadMessage(dmChatRoomId: number, receiverId: number): void {
    if (!this.client || this.status !== 'connected') {
      console.warn('[WebSocket] 연결되지 않음 - 읽음 처리 불가');
      return;
    }

    this.client.publish({
      destination: `/app/dm/${dmChatRoomId}/read-message`,
      body: JSON.stringify({receiverId}),
    });

    console.log(
      `[WebSocket] 읽음 처리 전송: 채팅방 ${dmChatRoomId}, 수신자 ${receiverId}`,
    );
  }

  /**
   * 새 메시지 처리
   */
  private handleNewMessage(
    dmChatRoomId: number,
    message: DmMessageResponse,
  ): void {
    const callbacks = this.messageCallbacks.get(dmChatRoomId);
    if (callbacks) {
      callbacks.forEach(callback => callback(message));
    }
  }

  /**
   * 현재 연결 상태 반환
   */
  getStatus(): WebSocketStatus {
    return this.status;
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.status === 'connected';
  }
}

// 싱글톤 인스턴스 생성
export const webSocketService = new WebSocketService();
