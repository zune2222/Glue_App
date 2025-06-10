import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  SafeAreaView,
  FlatList,
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
  InvitationBubble,
} from '../../components';
import {
  useDmChatRoomDetail,
  useDmMessages,
  useSendDmMessage,
  useToggleDmChatRoomNotification,
  useCreateMeetingInvitation,
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
  const scrollViewRef = useRef<FlatList>(null);

  // route.params에서 dmChatRoomId 가져오기
  const dmChatRoomId = route?.params?.dmChatRoomId;

  // 현재 사용자 ID 상태
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 초대 관련 상태 (더 이상 사용하지 않음)

  // API 훅들
  const {
    data: chatRoomDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useDmChatRoomDetail(dmChatRoomId || -1);

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDmMessages(dmChatRoomId || -1);

  const sendMessageMutation = useSendDmMessage();
  const toggleNotificationMutation = useToggleDmChatRoomNotification();
  const createInvitationMutation = useCreateMeetingInvitation();

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

  // 무한 스크롤 메시지 데이터를 평면 배열로 변환
  const allMessages = useMemo(() => {
    if (!messagesData?.pages) return [];

    // 모든 페이지의 메시지를 하나의 배열로 합치기
    // 첫 번째 페이지가 최신 메시지, 이후 페이지들이 더 오래된 메시지
    const combined = messagesData.pages.flatMap(page => page.data || []);

    console.log('📊 페이지 합치기 결과:', {
      pageCount: messagesData.pages.length,
      totalMessages: combined.length,
      firstMessage: combined[0]?.dmMessageId,
      lastMessage: combined[combined.length - 1]?.dmMessageId,
      pages: messagesData.pages.map(page => ({
        count: page.data?.length || 0,
        first: page.data?.[0]?.dmMessageId,
        last: page.data?.[page.data.length - 1]?.dmMessageId,
      })),
    });

    // 서버에서 이미 시간순으로 정렬해서 주므로 별도 정렬 불필요
    // 단, 중복 제거는 해야 함 (혹시 모를 중복 메시지 방지)
    const uniqueMessages = combined.filter(
      (message, index, array) =>
        array.findIndex(m => m.dmMessageId === message.dmMessageId) === index,
    );

    console.log('📊 중복 제거 후:', {
      totalMessages: uniqueMessages.length,
      firstMessage: uniqueMessages[0]?.dmMessageId,
      lastMessage: uniqueMessages[uniqueMessages.length - 1]?.dmMessageId,
    });

    // 시간순으로 정렬 후 역순으로 배치 (inverted FlatList용)
    return uniqueMessages.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [messagesData]);

  // 메시지 초기 설정 및 무한 스크롤 처리
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastLoadedMessageCount, setLastLoadedMessageCount] = useState(0);

  useEffect(() => {
    if (!allMessages || allMessages.length === 0) return;

    if (isInitialLoad) {
      // 초기 로드
      console.log('🔄 초기 메시지 로드:', allMessages.length, '개');
      setMessages(allMessages);
      setLastLoadedMessageCount(allMessages.length);
      setIsInitialLoad(false);
    } else if (allMessages.length > lastLoadedMessageCount) {
      // 무한 스크롤로 새 메시지 로드 (기존 메시지 뒤에 추가)
      const newMessages = allMessages.slice(lastLoadedMessageCount);
      console.log('📄 무한 스크롤 메시지 추가:', newMessages.length, '개');

      setMessages(prev => {
        // 새로운 메시지들을 기존 메시지 뒤에 추가 (중복 방지)
        const existingIds = new Set(prev.map(msg => msg.dmMessageId));
        const filteredNewMessages = newMessages.filter(
          msg => !existingIds.has(msg.dmMessageId),
        );
        return [...prev, ...filteredNewMessages];
      });

      setLastLoadedMessageCount(allMessages.length);
    }
  }, [allMessages, isInitialLoad, lastLoadedMessageCount]);

  // WebSocket 메시지 리스너 설정 (Provider에서 연결 관리)
  useEffect(() => {
    if (!dmChatRoomId) {
      return;
    }

    let isComponentMounted = true;

    // 메시지 수신 리스너 설정 (이 채팅방 메시지만 필터링)
    webSocketService.setMessageListener((dmMessage: DmMessageResponse) => {
      if (!isComponentMounted) return;

      // 현재 채팅방의 메시지만 처리
      if (dmMessage.dmChatRoomId === dmChatRoomId) {
        setMessages(prev => {
          // 중복 메시지 방지 (실제 메시지 ID로 확인)
          const exists = prev.find(
            msg => msg.dmMessageId === dmMessage.dmMessageId && !msg.isTemp,
          );
          if (exists) {
            console.log('중복 메시지 무시:', dmMessage.dmMessageId);
            return prev;
          }

          // 현재 사용자가 보낸 메시지인 경우 임시 메시지 제거
          const messageSenderId =
            dmMessage.senderId || dmMessage.sender?.userId;
          if (messageSenderId === currentUserId) {
            // 임시 메시지들을 제거하고 실제 메시지 추가
            const withoutTempMessages = prev.filter(msg => !msg.isTemp);
            console.log(
              '내가 보낸 메시지 - 임시 메시지 제거 후 실제 메시지 추가:',
              dmMessage.dmMessageId,
            );
            return [dmMessage, ...withoutTempMessages];
          } else {
            // 다른 사용자가 보낸 메시지는 그냥 추가
            console.log('다른 사용자 메시지 추가:', dmMessage.dmMessageId);
            return [dmMessage, ...prev];
          }
        });
      }
    });

    // 클린업: 리스너만 제거, 연결은 Provider에서 관리
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

  // 메시지 전송 핸들러 - 낙관적 업데이트로 즉시 UI 반영
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!dmChatRoomId || !currentUserId) {
        toastService.error('오류', '채팅방 정보가 없습니다.');
        return;
      }

      // 임시 메시지 ID 생성 (음수로 설정하여 실제 메시지와 구분)
      const tempMessageId = -Date.now();

      // 낙관적 업데이트: 즉시 UI에 메시지 추가
      const tempMessage: DmMessageResponse = {
        dmMessageId: tempMessageId,
        dmChatRoomId,
        senderId: currentUserId,
        content: text,
        isRead: false, // 임시 메시지는 읽지 않음으로 설정
        createdAt: new Date().toISOString(),
        isTemp: true, // 임시 메시지 표시
      };

      // 임시 메시지 즉시 추가
      setMessages(prev => [tempMessage, ...prev]);

      try {
        // REST API를 통한 메시지 전송
        await sendMessageMutation.mutateAsync({
          dmChatRoomId,
          content: text,
        });

        // 전송 성공 시 WebSocket으로 실제 메시지가 들어와서 임시 메시지를 자동으로 교체함
      } catch (error: any) {
        console.error('메시지 전송 실패:', error);

        // 전송 실패 시 임시 메시지 제거
        setMessages(prev =>
          prev.filter(msg => msg.dmMessageId !== tempMessageId),
        );

        toastService.error('전송 실패', '메시지 전송에 실패했습니다.');
      }
    },
    [dmChatRoomId, currentUserId, setMessages, sendMessageMutation],
  );

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

  // React Query 낙관적 업데이트를 사용한 알림 설정 토글 핸들러
  const handleNotificationToggle = async () => {
    console.log('🔔 handleNotificationToggle 호출됨');

    if (!dmChatRoomId) {
      console.log('❌ dmChatRoomId가 없음:', dmChatRoomId);
      return;
    }

    // React Query의 낙관적 업데이트가 모든 것을 처리함
    toggleNotificationMutation.mutate({dmChatRoomId});
  };

  // ============ 초대 관련 함수들 ============

  // 사용자 정보 가져오기 헬퍼 함수
  const getUserById = useCallback(
    (userId: number) => {
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
    },
    [chatRoomDetail?.data?.participants],
  );

  // 모임 초대장 생성 및 채팅 메시지 전송 핸들러
  const handleCreateInvitation = useCallback(async () => {
    if (!chatRoomDetail?.data?.meetingId || !currentUserId) {
      toastService.error('오류', '모임 정보나 사용자 정보를 찾을 수 없습니다.');
      return;
    }

    // 현재 사용자가 아닌 다른 참가자를 찾기 (초대 대상)
    const invitee = chatRoomDetail.data.participants.find(
      (participant: DmChatRoomParticipant) =>
        participant.user.userId !== currentUserId,
    );

    if (!invitee) {
      toastService.error('오류', '초대할 사용자를 찾을 수 없습니다.');
      return;
    }

    try {
      // 초대장 생성 - 실제 초대 대상 사용자 ID 사용
      const invitationResponse = await createInvitationMutation.mutateAsync({
        meetingId: chatRoomDetail.data.meetingId,
        inviteeId: invitee.user.userId, // 실제 초대 대상 사용자 ID
      });

      // 초대장 정보를 JSON 형식으로 채팅 메시지에 전송
      const invitationMessage = JSON.stringify({
        type: 'invitation',
        invitationId: invitationResponse.data.invitationId,
        code: invitationResponse.data.code,
        expiresAt: invitationResponse.data.expiresAt,
        status: invitationResponse.data.status,
        meetingId: invitationResponse.data.meetingId,
        inviteeId: invitationResponse.data.inviteeId,
        senderName: getUserById(currentUserId)?.userName || '알 수 없는 사용자',
        inviteeName: invitee.user.userNickname || '알 수 없는 사용자',
        maxUses: invitationResponse.data.maxUses,
        usedCount: invitationResponse.data.usedCount,
      });

      // 특별한 형식으로 채팅 메시지 전송
      await handleSendMessage(`[INVITATION]${invitationMessage}`);

      toastService.success('성공', '초대장이 채팅방에 전송되었습니다!');
    } catch (error) {
      console.error('초대 생성 실패:', error);
      toastService.error('오류', '초대장 생성에 실패했습니다.');
    }
  }, [
    chatRoomDetail?.data?.meetingId,
    chatRoomDetail?.data?.participants,
    currentUserId,
    createInvitationMutation,
    getUserById,
    handleSendMessage,
  ]);

  // 현재 사용자 ID 초기화
  useEffect(() => {
    const initCurrentUser = async () => {
      const userId = await secureStorage.getUserId();
      setCurrentUserId(userId);
    };
    initCurrentUser();
  }, []);

  // 이전 메시지 로드 핸들러 - 맨 아래 도달시 호출
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 메시지 렌더링 함수
  const renderMessage = useCallback(
    ({item: message}: {item: DmMessageResponse}) => {
      // message 안전성 검사
      if (!message) {
        console.warn('Invalid message:', message);
        return null;
      }

      // senderId 또는 sender.userId 가져오기 (임시 메시지는 senderId, 실제 메시지는 sender.userId)
      const messageSenderId = message.senderId || message.sender?.userId;
      if (!messageSenderId) {
        console.warn('No sender ID found in message:', message);
        return null;
      }

      const user = getUserById(messageSenderId);
      if (!user) {
        return null;
      }

      // 메시지 내용이 초대장 형식인지 확인 ([INVITATION]으로 시작하는지)
      if (message.content && message.content.startsWith('[INVITATION]')) {
        try {
          // [INVITATION] 접두사를 제거하고 JSON 파싱
          const invitationDataStr = message.content.replace('[INVITATION]', '');
          const invitationData = JSON.parse(invitationDataStr);

          return (
            <InvitationBubble
              invitationData={invitationData}
              isCurrentUser={messageSenderId === currentUserId}
              currentUserId={currentUserId || 0}
              sender={{
                name: user.userName || '알 수 없는 사용자',
                profileImage:
                  user.profileImageUrl && user.profileImageUrl.trim() !== ''
                    ? user.profileImageUrl
                    : undefined,
              }}
            />
          );
        } catch (error) {
          console.error('초대 메시지 파싱 오류:', error);
          // 파싱 실패 시 일반 메시지로 표시
        }
      }

      // 일반 텍스트 메시지는 ChatMessage로 렌더링
      return (
        <ChatMessage
          id={message.dmMessageId?.toString() || ''}
          text={message.content || ''}
          timestamp={
            message.createdAt
              ? new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : '시간 미상'
          }
          isMine={messageSenderId === currentUserId}
          sender={{
            id: user?.userId?.toString() || 'unknown',
            name: user.userName || '알 수 없는 사용자',
            profileImage:
              user.profileImageUrl && user.profileImageUrl.trim() !== ''
                ? user.profileImageUrl
                : '',
            isHost: user.isHost || false,
          }}
        />
      );
    },
    [currentUserId, getUserById],
  );

  // 빈 리스트 컴포넌트
  const renderEmptyComponent = useCallback(
    () => (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 50,
          minHeight: 200,
        }}>
        <RNText style={{color: '#999'}}>
          아직 메시지가 없습니다. 첫 메시지를 보내보세요!
        </RNText>
      </View>
    ),
    [],
  );

  // 키 추출 함수
  const keyExtractor = useCallback((item: DmMessageResponse, index: number) => {
    return (
      item.dmMessageId?.toString() ||
      `${item.isTemp ? 'temp' : 'msg'}-${
        item.senderId || item.sender?.userId
      }-${index}-${item.createdAt}`
    );
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

  // 날짜 계산 (메시지가 있으면 첫 번째 메시지 날짜, 없으면 오늘 날짜)
  const getDisplayDate = () => {
    if (messages && messages.length > 0 && messages[0]?.createdAt) {
      return new Date(messages[0].createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

        <DateDivider date={getDisplayDate()} />

        <FlatList
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            messages.length === 0 && {flex: 1},
          ]}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderMessage}
          ListEmptyComponent={renderEmptyComponent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          inverted
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          windowSize={10}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          initialNumToRender={20}
        />

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
                    participant.user.profileImageUrl &&
                    participant.user.profileImageUrl.trim() !== ''
                      ? participant.user.profileImageUrl
                      : dummyProfile,
                  isHost: participant.isHost || false,
                  isOnline: false, // TODO: 온라인 상태 정보 추가 필요
                }),
              )}
              onClose={closeRoomInfo}
              onLeaveRoom={handleLeaveRoom}
              isNotificationEnabled={
                chatRoomDetail.data.isPushNotificationOn === 1
              }
              onNotificationToggle={handleNotificationToggle}
              meetingId={chatRoomDetail.data.meetingId}
              navigation={navigation}
              onInvite={handleCreateInvitation}
            />
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
