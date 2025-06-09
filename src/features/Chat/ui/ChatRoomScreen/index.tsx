import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text as RNText,
} from 'react-native';
import {styles} from './styles';
import {
  ChatHeader,
  ChatMessage,
  ChatInput,
  DateDivider,
  ChatRoomInfo,
} from '../../components';
import {
  useDmChatRoomDetail,
  useDmMessages,
  useSendDmMessage,
} from '../../api/hooks';
import {DmMessageResponse, DmChatRoomParticipant} from '../../api/api';
import {toastService} from '@shared/lib/notifications/toast';
import {dummyProfile} from '@shared/assets/images';
import {secureStorage} from '@shared/lib/security';
import {webSocketService} from '../../lib/websocket';

interface ChatRoomScreenProps {
  route?: {
    params: {
      roomId?: string;
      dmChatRoomId?: number;
    };
  };
  navigation?: any;
}

const {width} = Dimensions.get('window');

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({route, navigation}) => {
  const [messages, setMessages] = useState<DmMessageResponse[]>([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // route.params에서 dmChatRoomId 가져오기
  const dmChatRoomId = route?.params?.dmChatRoomId;

  // 현재 사용자 ID 상태
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // API 훅들
  const {
    data: chatRoomDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useDmChatRoomDetail(dmChatRoomId || -1);

  const {
    data: initialMessages,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
  } = useDmMessages(dmChatRoomId || -1);

  const sendMessageMutation = useSendDmMessage();

  // 에러 처리
  useEffect(() => {
    if (isDetailError && detailError) {
      console.error('[ChatRoomScreen] 채팅방 상세 정보 에러:', detailError);
      toastService.error('오류', detailError.message);
    }
    if (isMessagesError && messagesError) {
      console.error('[ChatRoomScreen] 메시지 목록 에러:', messagesError);
      toastService.error('오류', messagesError.message);
    }
  }, [isDetailError, detailError, isMessagesError, messagesError]);

  // 초기 메시지 설정
  useEffect(() => {
    if (initialMessages?.data) {
      setMessages(initialMessages.data);
    }
  }, [initialMessages]);

  // WebSocket 메시지 리스너 설정
  useEffect(() => {
    if (!dmChatRoomId || !currentUserId) {
      return;
    }

    let isComponentMounted = true;

    const initializeWebSocket = async () => {
      try {
        // WebSocket이 연결되어 있는지 확인
        if (!webSocketService.isConnected()) {
          // 앱 레벨에서 연결이 완료될 때까지 대기 (10초 타임아웃)
          const connected = await webSocketService.waitForConnection(10000);

          if (!connected) {
            // 앱 레벨 연결이 실패한 경우에만 직접 연결 시도
            await webSocketService.connectWebSocket(currentUserId);
          }
        }

        if (!isComponentMounted) return;

        // 메시지 수신 리스너 설정 (이 채팅방 메시지만 필터링)
        webSocketService.setMessageListener((dmMessage: DmMessageResponse) => {
          if (!isComponentMounted) return;

          // 현재 채팅방의 메시지만 처리
          if (dmMessage.dmChatRoomId === dmChatRoomId) {
            setMessages(prev => {
              // 중복 메시지 방지 (실제 메시지 ID로만 체크)
              const exists = prev.find(
                msg => msg.dmMessageId === dmMessage.dmMessageId && !msg.isTemp, // 임시 메시지가 아닌 것만 중복 체크
              );

              if (exists) {
                return prev;
              }

              // 임시 메시지가 있다면 교체, 없다면 추가
              const tempMessageIndex = prev.findIndex(
                msg =>
                  msg.isTemp &&
                  msg.senderId === dmMessage.sender?.userId &&
                  msg.content === dmMessage.content,
              );

              if (tempMessageIndex !== -1) {
                // 임시 메시지를 실제 메시지로 교체
                const updated = [...prev];
                updated[tempMessageIndex] = dmMessage;
                return updated;
              } else {
                // 새 메시지 추가
                return [...prev, dmMessage];
              }
            });

            // 새 메시지가 도착하면 스크롤을 맨 아래로
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
          }
        });
      } catch (error) {
        if (isComponentMounted) {
          const errorMessage =
            error instanceof Error ? error.message : '알 수 없는 오류';
          toastService.error(
            '연결 오류',
            `WebSocket 연결에 실패했습니다: ${errorMessage}`,
          );
        }
      }
    };

    initializeWebSocket();

    // 클린업: 리스너만 제거, 연결은 유지 (앱 레벨에서 관리)
    return () => {
      isComponentMounted = false;
      webSocketService.setMessageListener(null);
    };
  }, [dmChatRoomId, currentUserId]);

  // 패널을 드래그하여 닫을 수 있는 PanResponder 설정
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          gestureState.dx > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          slideAnim.setValue(width * 0.25 + gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > width * 0.2) {
          closeRoomInfo();
        } else {
          Animated.spring(slideAnim, {
            toValue: width * 0.25,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  // 사이드 패널 애니메이션
  useEffect(() => {
    if (showRoomInfo && !isClosing) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: width * 0.25,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isClosing) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: width,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowRoomInfo(false);
        setIsClosing(false);
        slideAnim.setValue(width);
      });
    }
  }, [showRoomInfo, isClosing, fadeAnim, slideAnim]);

  // 메시지 전송 핸들러 (REST API 사용, WebSocket은 실시간 수신용)
  const handleSendMessage = async (text: string) => {
    if (!dmChatRoomId || !currentUserId) {
      toastService.error('오류', '채팅방 정보가 없습니다.');
      return;
    }

    // 낙관적 업데이트: 임시 메시지를 즉시 UI에 추가
    const tempMessage: DmMessageResponse = {
      dmMessageId: Date.now(), // 임시 ID (실제 ID는 서버에서 할당됨)
      dmChatRoomId,
      senderId: currentUserId,
      content: text,
      createdAt: new Date().toISOString(),
      isRead: false,
      isTemp: true, // 임시 메시지 표시
    };

    // 즉시 UI에 메시지 추가
    setMessages(prev => [...prev, tempMessage]);

    // 즉시 스크롤을 맨 아래로
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 50);

    try {
      // REST API를 통한 메시지 전송 (백엔드에서 WebSocket으로 브로드캐스트)
      const response = await sendMessageMutation.mutateAsync({
        dmChatRoomId,
        content: text,
      });

      // 임시 메시지를 실제 메시지로 교체
      setMessages(prev =>
        prev.map(msg =>
          msg.dmMessageId === tempMessage.dmMessageId && msg.isTemp
            ? {...response.data, isTemp: false}
            : msg,
        ),
      );
    } catch (error: any) {
      console.error('메시지 전송 실패:', error);

      // 전송 실패 시 임시 메시지 제거
      setMessages(prev =>
        prev.filter(
          msg => !(msg.dmMessageId === tempMessage.dmMessageId && msg.isTemp),
        ),
      );

      toastService.error('전송 실패', '메시지 전송에 실패했습니다.');
    }
  };

  const handleBackPress = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleMenuPress = () => {
    setShowRoomInfo(true);
    setIsClosing(false);
  };

  const closeRoomInfo = () => {
    if (!isClosing) {
      setIsClosing(true);
    }
  };

  const handleLeaveRoom = () => {
    closeRoomInfo();
    // TODO: 채팅방 나가기 API 호출
    setTimeout(() => {
      if (navigation) {
        navigation.goBack();
      }
    }, 300);
  };

  // 사용자 정보 가져오기 헬퍼 함수
  const getUserById = (userId: number) => {
    if (!chatRoomDetail?.data?.participants) return null;

    const participant = chatRoomDetail.data.participants.find(
      (participant: DmChatRoomParticipant) =>
        participant.user.userId === userId,
    );

    if (!participant) return null;

    return {
      userId: participant.user.userId,
      userName: participant.user.userNickname, // userNickname을 userName으로 매핑
      profileImageUrl: participant.user.profileImageUrl,
      isHost: participant.isHost,
    };
  };

  // 현재 사용자 ID 초기화
  useEffect(() => {
    const initCurrentUser = async () => {
      const userId = await secureStorage.getUserId();
      setCurrentUserId(userId);
    };
    initCurrentUser();
  }, []);

  // 로딩 중일 때
  if (isDetailLoading || isMessagesLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color="#1CBFDC" />
        <RNText style={{marginTop: 10, color: '#666'}}>
          채팅방 정보를 불러오는 중...
        </RNText>
      </SafeAreaView>
    );
  }

  // 에러 발생 시
  if (!dmChatRoomId || !chatRoomDetail?.data) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <RNText style={{color: 'red', textAlign: 'center', padding: 20}}>
          {!dmChatRoomId
            ? '채팅방 ID가 제공되지 않았습니다.'
            : '채팅방 정보를 불러올 수 없습니다.'}
        </RNText>
      </SafeAreaView>
    );
  }

  // 다른 사용자 정보 (현재 사용자가 아닌 첫 번째 참가자)
  const otherUser = chatRoomDetail.data.participants.find(
    (participant: DmChatRoomParticipant) =>
      participant.user.userId !== currentUserId,
  );
  const chatRoomName = otherUser?.user?.userNickname || '알 수 없는 사용자';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ChatHeader
          title={chatRoomName}
          memberCount={chatRoomDetail.data.participants.length}
          onBackPress={handleBackPress}
          onMenuPress={handleMenuPress}
        />

        <DateDivider date="2025년 01월 12일" />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: false})
          }>
          {messages.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}>
              <RNText style={{color: '#999'}}>
                아직 메시지가 없습니다. 첫 메시지를 보내보세요!
              </RNText>
            </View>
          ) : (
            messages.map((message, index) => {
              // message 안전성 검사
              if (!message) {
                console.warn('Invalid message:', message);
                return null;
              }

              // senderId 또는 sender.userId 가져오기 (임시 메시지는 senderId, 실제 메시지는 sender.userId)
              const messageSenderId =
                message.senderId || message.sender?.userId;
              if (!messageSenderId) {
                console.warn('No sender ID found in message:', message);
                return null;
              }

              const user = getUserById(messageSenderId);
              if (!user) {
                return null;
              }

              // dmMessageId가 없는 경우 index를 사용하여 안전하게 처리
              const messageId =
                message.dmMessageId?.toString() || `temp-${index}`;

              return (
                <ChatMessage
                  key={messageId}
                  id={messageId}
                  text={message.content || ''}
                  timestamp={
                    message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString(
                          'ko-KR',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          },
                        )
                      : '시간 미상'
                  }
                  readCount={
                    typeof message.isRead === 'number'
                      ? message.isRead
                        ? 0
                        : 1
                      : message.isRead
                      ? 0
                      : 1
                  }
                  isMine={messageSenderId === currentUserId}
                  sender={{
                    id: user?.userId?.toString() || 'unknown',
                    name: user.userName || '알 수 없는 사용자',
                    profileImage: user.profileImageUrl || '',
                    isHost: user.isHost || false,
                  }}
                />
              );
            })
          )}
        </ScrollView>

        <ChatInput onSend={handleSendMessage} />

        {/* 채팅방 정보 - 우측에서 슬라이드 */}
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
              display: showRoomInfo || isClosing ? 'flex' : 'none',
            },
          ]}>
          <TouchableWithoutFeedback onPress={closeRoomInfo}>
            <View style={styles.overlayTouchable} />
          </TouchableWithoutFeedback>

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.sidePanel,
              {
                transform: [{translateX: slideAnim}],
              },
            ]}>
            <ChatRoomInfo
              roomName={chatRoomName}
              roomIcon={undefined}
              memberCount={chatRoomDetail.data.participants.length}
              isDirectMessage={true}
              members={chatRoomDetail.data.participants.map(
                (participant: DmChatRoomParticipant) => ({
                  id: participant.user.userId?.toString() || 'unknown',
                  name: participant.user.userNickname || '알 수 없는 사용자',
                  profileImage:
                    participant.user.profileImageUrl || dummyProfile,
                  isHost: participant.isHost || false,
                  isOnline: false, // TODO: 온라인 상태 정보 추가 필요
                }),
              )}
              onClose={closeRoomInfo}
              onLeaveRoom={handleLeaveRoom}
            />
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
