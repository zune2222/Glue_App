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

  const [messages, setMessages] = useState<DmMessageResponse[]>([]);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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

  // WebSocket 연결 및 구독
  useEffect(() => {
    if (!dmChatRoomId) return;

    let isComponentMounted = true;

    const initializeWebSocket = async () => {
      try {
        // WebSocket 연결
        await webSocketService.connect();

        if (!isComponentMounted) return;

        // 채팅방 구독
        webSocketService.subscribeToChatRoom(dmChatRoomId, newMessage => {
          if (isComponentMounted) {
            setMessages(prev => [...prev, newMessage]);
            // 새 메시지가 도착하면 스크롤을 맨 아래로
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
          }
        });
      } catch (error) {
        console.error('WebSocket 초기화 실패:', error);
        if (isComponentMounted) {
          toastService.error('연결 오류', 'WebSocket 연결에 실패했습니다.');
        }
      }
    };

    initializeWebSocket();

    // 클린업
    return () => {
      isComponentMounted = false;
      if (dmChatRoomId) {
        webSocketService.unsubscribeFromChatRoom(dmChatRoomId);
      }
    };
  }, [dmChatRoomId]);

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
      await sendMessageMutation.mutateAsync({
        dmChatRoomId,
        content: text,
      });

      // 메시지 전송 후 스크롤을 맨 아래로
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
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

  // 현재 사용자 ID 가져오기 (첫 번째 참가자를 현재 사용자로 가정)
  const currentUserId = chatRoomDetail?.data?.participants?.[0]?.user?.userId;

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
              // message 및 sender 안전성 검사
              if (!message || !message.sender) {
                console.warn('Invalid message or sender:', message);
                return null;
              }

              const user = getUserById(message.sender.userId);
              if (!user) return null;

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
