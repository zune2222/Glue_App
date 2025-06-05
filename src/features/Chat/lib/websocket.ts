import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {secureStorage} from '@/shared/lib/security';
import {config} from '@/shared/config/env';

// WebSocket 연결 관리 클래스 (SockJS + STOMP)
export class WebSocketService {
  private stompClient: Client | null = null;
  private url: string;
  private currentUserId: number | null = null;
  private connectionStatus:
    | 'disconnected'
    | 'connecting'
    | 'connected'
    | 'error' = 'disconnected';
  private useSockJS: boolean = false; // 기본값: 원시 WebSocket 사용

  constructor(url?: string, useSockJS: boolean = false) {
    this.url = url || `${config.API_URL}/ws`;
    this.useSockJS = useSockJS;
  }

  // WebSocket 연결 (현재 사용자 ID 필요)
  async connectWebSocket(currentUserId: number): Promise<Client> {
    const token = await this.getAuthToken();
    
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    this.currentUserId = currentUserId;

    console.log('[WebSocketService] 토큰:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('[WebSocketService] 현재 사용자 ID:', currentUserId);
    console.log('[WebSocketService] 연결 방식:', this.useSockJS ? 'SockJS' : '원시 WebSocket');

    let clientConfig: any = {};

    if (this.useSockJS) {
      // 방법 1: SockJS 사용 (토큰은 URL에 포함)
      const socket = new SockJS(`${this.url}?token=${token}`);
      console.log('[WebSocketService] SockJS URL:', `${this.url}?token=${token.substring(0, 20)}...`);
      
      clientConfig = {
        webSocketFactory: () => socket,
        // SockJS 사용 시 connectHeaders는 제대로 작동하지 않을 수 있음
      };
    } else {
      // 방법 2: 원시 WebSocket 사용 (connectHeaders 지원)
      const wsUrl = this.url.replace('http://', 'ws://').replace('https://', 'wss://');
      const brokerURL = `${wsUrl}/websocket?token=${token}`;
      console.log('[WebSocketService] 원시 WebSocket URL:', brokerURL);
      
      clientConfig = {
        brokerURL,
        connectHeaders: {
          'Authorization': `Bearer ${token}`,
        },
      };
    }
    
    // STOMP 클라이언트 설정
    this.stompClient = new Client({
      ...clientConfig,
      onConnect: (frame) => {
        console.log('WebSocket 연결 성공:', frame);
        this.connectionStatus = 'connected';
        this.notifyStatusChange();
        this.setupDmSubscription(currentUserId); // 내 ID로 구독
      },
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame);
        this.connectionStatus = 'error';
        this.notifyStatusChange();
      },
      onDisconnect: (frame) => {
        console.log('WebSocket 연결 해제:', frame);
        this.connectionStatus = 'disconnected';
        this.notifyStatusChange();
      },
      debug: (str) => {
        if (config.ENABLE_LOGGING) {
          console.log('STOMP Debug:', str);
        }
      },
    });

    // 연결 상태 설정
    this.connectionStatus = 'connecting';

    // 연결 시작
    this.stompClient.activate();

    return this.stompClient;
  }

  // DM 구독 설정 (중요) - 내 ID로 구독
  private setupDmSubscription(currentUserId: number): void {
    if (!this.stompClient?.connected) {
      console.error('STOMP 클라이언트가 연결되어 있지 않습니다.');
      return;
    }

    // DM 구독 - 나에게 오는 모든 DM을 구독
    this.stompClient.subscribe(`/queue/dm/${currentUserId}`, (message) => {
      const dmMessage = JSON.parse(message.body);
      console.log('DM 수신:', dmMessage);

      // UI 업데이트 로직
      this.handleNewDmMessage(dmMessage);
    });

    console.log(`[WebSocketService] DM 구독 완료: /queue/dm/${currentUserId}`);
  }

  // 메시지 수신 처리
  private handleNewDmMessage(dmMessage: any): void {
    // 채팅 목록 업데이트
    // 현재 채팅방이면 메시지 추가
    // 푸시 알림 등...
    console.log('[WebSocketService] 새 DM 메시지 처리:', dmMessage);

    // 이벤트 발생 (외부에서 구독 가능)
    if (this.onMessageReceived) {
      this.onMessageReceived(dmMessage);
    }
  }

  // 메시지 수신 콜백
  private onMessageReceived: ((message: any) => void) | null = null;

  // 메시지 수신 리스너 설정
  setMessageListener(callback: (message: any) => void): void {
    this.onMessageReceived = callback;
  }

  // DM 메시지 전송
  sendDmMessage(targetUserId: number, content: string): boolean {
    if (!this.stompClient?.connected) {
      console.error('WebSocket이 연결되어 있지 않습니다.');
      return false;
    }

    try {
      const message = {
        targetUserId,
        content,
        timestamp: new Date().toISOString(),
      };

      this.stompClient.publish({
        destination: '/app/dm/send',
        body: JSON.stringify(message),
      });

      console.log('[WebSocketService] DM 메시지 전송:', message);
      return true;
    } catch (error) {
      console.error('DM 메시지 전송 오류:', error);
      return false;
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await secureStorage.getToken();
    } catch (error) {
      console.error('토큰 조회 실패:', error);
      return null;
    }
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.stompClient?.connected || false;
  }

  // 연결 상태 반환
  getStatus(): 'disconnected' | 'connecting' | 'connected' | 'error' {
    return this.connectionStatus;
  }

  // 수동 재연결
  async reconnect(): Promise<void> {
    if (!this.currentUserId) {
      throw new Error('사용자 ID가 설정되지 않았습니다. connectWebSocket을 먼저 호출하세요.');
    }

    console.log('수동 재연결을 시도합니다...');
    this.disconnect();
    await this.connectWebSocket(this.currentUserId);
  }

  // 연결 해제
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connectionStatus = 'disconnected';
      console.log('[WebSocketService] WebSocket 연결 해제됨');
    }
  }

  // 연결 상태 리스너 추가
  private statusChangeCallback: ((status: typeof this.connectionStatus) => void) | null = null;

  onConnectionStatusChange(
    callback: (status: typeof this.connectionStatus) => void,
  ): void {
    this.statusChangeCallback = callback;
  }

  // 상태 변경 알림
  private notifyStatusChange(): void {
    if (this.statusChangeCallback) {
      this.statusChangeCallback(this.connectionStatus);
    }
  }

}

// 서비스 인스턴스 생성 및 내보내기
// 기본값: 원시 WebSocket 사용 (connectHeaders 지원)
export const webSocketService = new WebSocketService();

// SockJS 사용하고 싶다면 이렇게 생성:
// export const webSocketService = new WebSocketService(undefined, true);
