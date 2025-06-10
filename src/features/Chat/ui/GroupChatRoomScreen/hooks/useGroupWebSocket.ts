import {useEffect} from 'react';
import {webSocketService} from '../../../lib/websocket';
import {GroupMessageResponse} from '../../../api/api';

export const useGroupWebSocket = (
  groupChatroomId: number | undefined,
  setMessages: React.Dispatch<React.SetStateAction<GroupMessageResponse[]>>,
) => {
  useEffect(() => {
    if (!groupChatroomId) {
      return;
    }

    let isComponentMounted = true;

    // 그룹 메시지 수신 리스너 설정
    webSocketService.setGroupMessageListener(
      (groupMessage: GroupMessageResponse) => {
        if (!isComponentMounted) return;

        // 현재 채팅방의 메시지만 처리
        if (groupMessage.groupChatroomId === groupChatroomId) {
          setMessages(prev => {
            // 임시 메시지 찾기 (같은 내용과 비슷한 시간의 메시지)
            const tempMessageIndex = prev.findIndex(msg => {
              const timeDiff = Math.abs(
                new Date(groupMessage.createdAt).getTime() -
                  new Date(msg.createdAt).getTime(),
              );
              return (
                msg.message === groupMessage.message &&
                timeDiff < 10000 && // 10초 이내
                msg.groupMessageId > 1000000000000
              ); // 임시 ID는 timestamp라서 큰 값
            });

            // 임시 메시지가 있으면 교체, 없으면 새 메시지 추가
            if (tempMessageIndex !== -1) {
              const newMessages = [...prev];
              newMessages[tempMessageIndex] = groupMessage;
              return newMessages.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              );
            } else {
              // 중복 메시지 방지
              const exists = prev.find(
                msg => msg.groupMessageId === groupMessage.groupMessageId,
              );
              if (exists) {
                return prev;
              }

              // 새 메시지 추가 후 시간순으로 정렬 (최신순)
              const newMessages = [groupMessage, ...prev];
              return newMessages.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              );
            }
          });
        }
      },
    );

    // 그룹 채팅방 구독 시작
    const subscribeToGroup = async () => {
      // WebSocket 연결 대기
      const isConnected = await webSocketService.waitForConnection(5000);
      if (isConnected) {
        webSocketService.subscribeToGroupChatRoom(groupChatroomId);
      } else {
        console.error('[useGroupWebSocket] WebSocket 연결 대기 실패');
      }
    };

    subscribeToGroup();

    // 클린업: 리스너 제거 및 구독 해제
    return () => {
      isComponentMounted = false;
      webSocketService.setGroupMessageListener(null);
      webSocketService.unsubscribeFromGroupChatRoom(groupChatroomId);
    };
  }, [groupChatroomId, setMessages]);
};
