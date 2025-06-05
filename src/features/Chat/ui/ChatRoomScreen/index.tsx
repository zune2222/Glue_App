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
import {webSocketService} from '../../lib/websocket';
import {toastService} from '@shared/lib/notifications/toast';
import {dummyProfile} from '@shared/assets/images';
import {config} from '@shared/config/env';
import {secureStorage} from '@shared/lib/security';

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
  console.log('[ChatRoomScreen] 컴포넌트 로드됨');
  console.log('[ChatRoomScreen] route.params:', route?.params);
  console.log('[ChatRoomScreen] API_URL:', config.API_URL);
  console.log('[ChatRoomScreen] WebSocket URL:', `${config.API_URL}/ws`);

  const [messages, setMessages] = useState<DmMessageResponse[]>([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [wsStatus, setWsStatus] = useState(webSocketService.getStatus());
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // route.params에서 dmChatRoomId 가져오기
  const dmChatRoomId = route?.params?.dmChatRoomId;
  console.log('[ChatRoomScreen] dmChatRoomId:', dmChatRoomId);

  // API 훅들
  const {
    data: chatRoomDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useDmChatRoomDetail(dmChatRoomId || -1);
  console.log(chatRoomDetail);
  const {
    data: initialMessages,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
  } = useDmMessages(dmChatRoomId || -1);

  const sendMessageMutation = useSendDmMessage();

  console.log('[ChatRoomScreen] API 상태:', {
    isDetailLoading,
    isMessagesLoading,
    isDetailError,
    isMessagesError,
    chatRoomDetail: !!chatRoomDetail,
    initialMessages: !!initialMessages,
  });

  // WebSocket 상태 주기적 확인
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentStatus = webSocketService.getStatus();
      if (currentStatus !== wsStatus) {
        setWsStatus(currentStatus);
        console.log('[ChatRoomScreen] WebSocket 상태 변경:', currentStatus);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [wsStatus]);

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
      console.log(
        '[ChatRoomScreen] 초기 메시지 설정:',
        initialMessages.data.length,
        '개',
      );
      setMessages(initialMessages.data);
    }
  }, [initialMessages]);

  // WebSocket 연결 및 구독
  useEffect(() => {
    if (!dmChatRoomId || !chatRoomDetail?.data?.participants || !currentUserId) {
      return;
    }

    let isComponentMounted = true;

    const initializeWebSocket = async () => {
      try {
        console.log('[ChatRoomScreen] WebSocket 초기화 시작...');
        console.log(
          '[ChatRoomScreen] 현재 WebSocket 상태:',
          webSocketService.getStatus(),
        );

        // 연결 상태 변경 리스너 설정
        webSocketService.onConnectionStatusChange(status => {
          if (isComponentMounted) {
            setWsStatus(status);
            console.log('[ChatRoomScreen] WebSocket 상태 변경:', status);
          }
        });

        // currentUserId는 이미 state에서 가져옴
        console.log(`[ChatRoomScreen] 현재 사용자 ID: ${currentUserId}`);

        // 메시지 수신 리스너 설정
        webSocketService.setMessageListener((dmMessage) => {
          console.log('[ChatRoomScreen] 새 DM 메시지 수신:', dmMessage);
          if (isComponentMounted && dmMessage.dmChatRoomId === dmChatRoomId) {
            setMessages(prev => {
              console.log('[ChatRoomScreen] 메시지 추가 전 개수:', prev.length);
              const updated = [...prev, dmMessage];
              console.log(
                '[ChatRoomScreen] 메시지 추가 후 개수:',
                updated.length,
              );
              return updated;
            });
            // 새 메시지가 도착하면 스크롤을 맨 아래로
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
          }
        });

        // WebSocket 연결 (DM 구독 포함) - 내 ID로 구독
        await webSocketService.connectWebSocket(currentUserId);

        console.log(
          '[ChatRoomScreen] WebSocket 연결 후 상태:',
          webSocketService.getStatus(),
        );
      } catch (error) {
        console.error('[ChatRoomScreen] WebSocket 초기화 실패:', error);
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

    // 클린업
    return () => {
      console.log(
        `[ChatRoomScreen] 컴포넌트 언마운트: WebSocket 연결 해제`,
      );
      isComponentMounted = false;
      webSocketService.disconnect();
    };
  }, [dmChatRoomId, chatRoomDetail, currentUserId]);

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

  // 메시지 전송 핸들러
  const handleSendMessage = async (text: string) => {
    if (!dmChatRoomId) {
      toastService.error('오류', '채팅방 정보가 없습니다.');
      return;
    }

    try {
      // API를 통한 메시지 전송
      await sendMessageMutation.mutateAsync({
        dmChatRoomId,
        content: text,
      });

      // WebSocket을 통한 DM 메시지 전송 (테스트용)
      if (webSocketService.isConnected() && currentUserId) {
        // 상대방 사용자 ID 찾기
        const targetUser = chatRoomDetail?.data?.participants?.find(
          p => p.user.userId !== currentUserId
        );

        if (targetUser?.user?.userId) {
          const success = webSocketService.sendDmMessage(targetUser.user.userId, text);
          if (success) {
            console.log('[ChatRoomScreen] DM 메시지 WebSocket 전송 성공');
          } else {
            console.warn('[ChatRoomScreen] DM 메시지 WebSocket 전송 실패');
          }
        }
      } else {
        console.warn('[ChatRoomScreen] WebSocket이 연결되어 있지 않거나 사용자 ID가 없음');
      }

      // 메시지 전송 후 스크롤을 맨 아래로
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    } catch (error: any) {
      console.error('메시지 전송 실패:', error);

      // FCM 관련 에러인 경우 다른 메시지 표시
      if (
        error.message?.includes('firebase') ||
        error.message?.includes('token')
      ) {
        toastService.error(
          '알림 오류',
          '메시지는 전송되었지만 푸시 알림에 문제가 있습니다.',
        );
      } else {
        toastService.error('전송 실패', '메시지 전송에 실패했습니다.');
      }
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

  // 현재 사용자 ID를 secureStorage에서 가져오기
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

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

        {/* WebSocket 연결 상태 표시 */}
        <View
          style={{
            backgroundColor:
              wsStatus === 'connected'
                ? '#4CAF50'
                : wsStatus === 'connecting'
                ? '#FF9800'
                : '#F44336',
            paddingVertical: 4,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <RNText style={{color: 'white', fontSize: 12}}>
            WebSocket:{' '}
            {wsStatus === 'connected'
              ? '연결됨'
              : wsStatus === 'connecting'
              ? '연결 중...'
              : wsStatus === 'error'
              ? '연결 오류'
              : '연결 해제됨'}
          </RNText>
          {(wsStatus === 'error' || wsStatus === 'disconnected') && (
            <TouchableWithoutFeedback
              onPress={async () => {
                try {
                  await webSocketService.reconnect();
                  toastService.success('성공', 'WebSocket 재연결되었습니다.');
                } catch (error) {
                  console.error('재연결 실패:', error);
                  toastService.error(
                    '오류',
                    'WebSocket 재연결에 실패했습니다.',
                  );
                }
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                  marginLeft: 8,
                }}>
                <RNText
                  style={{
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}>
                  재연결
                </RNText>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>

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
              // message 및 sender 안전성 검사
              if (!message || !message.sender) {
                console.warn('Invalid message or sender:', message);
                return null;
              }

              const user = getUserById(message.sender.userId);
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
                  readCount={message.isRead ? 0 : 1}
                  isMine={message.sender.userId === currentUserId}
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
