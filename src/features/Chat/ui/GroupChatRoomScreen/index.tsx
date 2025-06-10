import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text as RNText,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import {styles} from './styles';
import {
  ChatHeader,
  ChatMessage,
  ChatInput,
  ChatRoomInfo,
} from '../../components';
import {
  useGroupMessages,
  useSendGroupMessage,
  useGroupChatRoomDetail,
  useToggleGroupChatRoomNotification,
  useLeaveGroupChatRoom,
} from '../../api/hooks';
import {GroupMessageResponse} from '../../api/api';
import {toastService} from '@shared/lib/notifications/toast';
import {secureStorage} from '@shared/lib/security';
import {useGroupWebSocket} from './hooks';
import {dummyProfile} from '@shared/assets/images';

interface GroupChatRoomScreenProps {
  route?: {
    params: {
      groupChatroomId?: number;
      meetingTitle?: string;
    };
  };
  navigation?: any;
}

const GroupChatRoomScreen: React.FC<GroupChatRoomScreenProps> = ({
  route,
  navigation,
}) => {
  const [messages, setMessages] = useState<GroupMessageResponse[]>([]);
  const scrollViewRef = useRef<FlatList<GroupMessageResponse>>(null);

  const [_stickyDate, setStickyDate] = useState<string>('');

  // 채팅방 정보 모달 관련 상태
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get('window').width),
  ).current;

  // route.params에서 groupChatroomId 가져오기
  const groupChatroomId = route?.params?.groupChatroomId;
  const meetingTitle = route?.params?.meetingTitle || '모임톡';

  // 현재 사용자 정보 상태
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // API 훅들
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGroupMessages(groupChatroomId || -1);

  // 메시지 전송 뮤테이션 훅
  const sendGroupMessageMutation = useSendGroupMessage();

  // 그룹 채팅방 상세 정보 API 훅
  const {
    data: groupChatRoomDetail,
    isError: isGroupDetailError,
    error: groupDetailError,
  } = useGroupChatRoomDetail(groupChatroomId || -1);

  // 알림 토글 뮤테이션 훅
  const toggleNotificationMutation = useToggleGroupChatRoomNotification();

  // 채팅방 나가기 뮤테이션 훅
  const leaveChatRoomMutation = useLeaveGroupChatRoom();

  // WebSocket 연결을 통한 실시간 메시지 수신
  useGroupWebSocket(groupChatroomId, setMessages);

  // 날짜 포맷팅 함수를 먼저 선언
  const formatDateForDivider = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return new Date().toISOString();

      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return new Date().toISOString();
    }
  }, []);

  // 에러 처리
  useEffect(() => {
    if (isMessagesError && messagesError) {
      console.error('[GroupChatRoomScreen] 메시지 목록 에러:', messagesError);
      toastService.error('오류', messagesError.message);
    }
  }, [isMessagesError, messagesError]);

  // 그룹 채팅방 상세 정보 에러 처리
  useEffect(() => {
    if (isGroupDetailError && groupDetailError) {
      console.error(
        '[GroupChatRoomScreen] 그룹 채팅방 상세 정보 에러:',
        groupDetailError,
      );
      toastService.error('오류', groupDetailError.message);
    }
  }, [isGroupDetailError, groupDetailError]);

  // 그룹 채팅방 상세 정보 로드 시 디버깅
  useEffect(() => {
    if (groupChatRoomDetail?.data) {
      console.log('=== 그룹 채팅방 상세 정보 ===');
      console.log('전체 응답:', groupChatRoomDetail.data);
      console.log('참여자 목록:', groupChatRoomDetail.data.participants);
      groupChatRoomDetail.data.participants.forEach((participant, index) => {
        console.log(`참여자 ${index + 1}:`, {
          userId: participant.user.userId,
          userNickname: participant.user.userNickname,
          profileImageUrl: participant.user.profileImageUrl,
          isHost: participant.isHost,
        });
      });
    }
  }, [groupChatRoomDetail]);

  // 무한 스크롤 메시지 데이터를 평면 배열로 변환
  const allMessages = useMemo(() => {
    if (!messagesData?.pages) return [];

    // 모든 페이지의 메시지를 하나의 배열로 합치기
    const combined = messagesData.pages.flatMap(page => page.data || []);

    console.log('📊 그룹 메시지 페이지 합치기 결과:', {
      pageCount: messagesData.pages.length,
      totalMessages: combined.length,
      firstMessage: combined[0]?.groupMessageId,
      lastMessage: combined[combined.length - 1]?.groupMessageId,
    });

    // 중복 제거
    const uniqueMessages = combined.filter(
      (message, index, array) =>
        array.findIndex(m => m.groupMessageId === message.groupMessageId) ===
        index,
    );

    // 시간순으로 정렬 후 역순으로 배치 (inverted FlatList용)
    return uniqueMessages.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, [messagesData]);

  // 메시지 초기 설정 및 무한 스크롤 처리
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastLoadedMessageCount, setLastLoadedMessageCount] = useState(0);

  useEffect(() => {
    if (!allMessages || allMessages.length === 0) return;

    if (isInitialLoad) {
      console.log('🔄 초기 그룹 메시지 로드:', allMessages.length, '개');
      setMessages(allMessages);
      setLastLoadedMessageCount(allMessages.length);
      setIsInitialLoad(false);

      // 초기 로드 시 첫 번째 메시지의 날짜를 sticky date로 설정
      if (allMessages.length > 0) {
        setStickyDate(formatDateForDivider(allMessages[0].createdAt));
      }
    } else if (allMessages.length > lastLoadedMessageCount) {
      const newMessages = allMessages.slice(lastLoadedMessageCount);
      console.log('📄 무한 스크롤 그룹 메시지 추가:', newMessages.length, '개');

      setMessages(prev => {
        const existingIds = new Set(prev.map(msg => msg.groupMessageId));
        const filteredNewMessages = newMessages.filter(
          msg => !existingIds.has(msg.groupMessageId),
        );
        return [...prev, ...filteredNewMessages];
      });

      setLastLoadedMessageCount(allMessages.length);
    }
  }, [
    allMessages,
    isInitialLoad,
    lastLoadedMessageCount,
    formatDateForDivider,
  ]);

  // 현재 사용자 ID 설정
  useEffect(() => {
    const initCurrentUser = async () => {
      try {
        const userId = await secureStorage.getUserId();
        setCurrentUserId(userId);
        console.log('=== 현재 사용자 정보 ===');
        console.log('현재 사용자 ID:', userId);
      } catch (error) {
        console.error('현재 사용자 ID 가져오기 실패:', error);
      }
    };

    initCurrentUser();
  }, []);

  // 메시지 전송 핸들러
  const handleSendMessage = async (text: string) => {
    if (!groupChatroomId || !currentUserId) {
      toastService.error('오류', '채팅방 정보를 찾을 수 없습니다.');
      return;
    }

    console.log(
      '그룹 메시지 전송:',
      text,
      'to groupChatroomId:',
      groupChatroomId,
    );

    // 낙관적 업데이트: 임시 메시지를 즉시 화면에 추가
    const tempMessage: GroupMessageResponse = {
      groupMessageId: Date.now(), // 임시 ID
      groupChatroomId: groupChatroomId,
      sender: {
        userId: currentUserId,
        userNickname: '나', // 임시 닉네임
        profileImageUrl: null,
      },
      message: text,
      createdAt: new Date().toISOString(),
    };

    // 메시지를 즉시 화면에 추가
    setMessages(prev => [tempMessage, ...prev]);

    try {
      await sendGroupMessageMutation.mutateAsync({
        groupChatroomId: groupChatroomId,
        content: text,
      });
      console.log('✅ 그룹 메시지 전송 성공');

      // 성공 시 임시 메시지는 WebSocket을 통해 실제 메시지로 교체될 예정
    } catch (error: any) {
      console.error('❌ 그룹 메시지 전송 실패:', error);

      // 실패 시 임시 메시지 제거
      setMessages(prev =>
        prev.filter(msg => msg.groupMessageId !== tempMessage.groupMessageId),
      );

      toastService.error(
        '메시지 전송 실패',
        error.message || '알 수 없는 오류가 발생했습니다.',
      );
    }
  };

  // 뒤로 가기 핸들러
  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleMenuPress = () => {
    setShowRoomInfo(true);
    setIsClosing(false);
  };

  // 사이드 패널 애니메이션 - ChatRoomScreen과 동일한 방식
  useEffect(() => {
    if (showRoomInfo && !isClosing) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(slideAnim, {
          toValue: Dimensions.get('window').width * 0.25,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (isClosing) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(slideAnim, {
          toValue: Dimensions.get('window').width,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setShowRoomInfo(false);
        setIsClosing(false);
        slideAnim.setValue(Dimensions.get('window').width);
      });
    }
  }, [showRoomInfo, isClosing, fadeAnim, slideAnim]);

  const closeRoomInfo = () => {
    if (!isClosing) {
      setIsClosing(true);
    }
  };

  // 팬 제스처 응답기 - ChatRoomScreen과 동일한 방식
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
          slideAnim.setValue(
            Dimensions.get('window').width * 0.25 + gestureState.dx,
          );
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > Dimensions.get('window').width * 0.2) {
          closeRoomInfo();
        } else {
          Animated.spring(slideAnim, {
            toValue: Dimensions.get('window').width * 0.25,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  // 알림 토글 핸들러
  const handleNotificationToggle = async () => {
    if (!groupChatroomId) return;

    try {
      await toggleNotificationMutation.mutateAsync({groupChatroomId});
      toastService.success('알림 설정', '알림 설정이 변경되었습니다.');
    } catch (error: any) {
      toastService.error(
        '오류',
        error.message || '알림 설정 변경에 실패했습니다.',
      );
    }
  };

  // 채팅방 나가기 핸들러
  const handleLeaveRoom = async () => {
    if (!groupChatroomId) return;

    try {
      await leaveChatRoomMutation.mutateAsync({groupChatroomId});
      toastService.success('채팅방 나가기', '채팅방을 나갔습니다.');
      navigation?.goBack();
    } catch (error: any) {
      toastService.error(
        '오류',
        error.message || '채팅방 나가기에 실패했습니다.',
      );
    }
  };

  // 무한 스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log('📄 더 많은 메시지 로드 요청');
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const formatSafeTime = (dateString: string | null) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      const now = new Date();
      const isToday = now.toDateString() === date.toDateString();

      if (isToday) {
        return date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      } else {
        return date.toLocaleDateString('ko-KR', {
          month: 'numeric',
          day: 'numeric',
        });
      }
    } catch (error) {
      return '';
    }
  };

  // 렌더링 함수들
  const renderItem = useCallback(
    ({item}: {item: GroupMessageResponse}) => {
      const isMyMessage = item.sender.userId === currentUserId;
      return (
        <View>
          <ChatMessage
            id={item.groupMessageId.toString()}
            text={item.message}
            isMine={isMyMessage}
            sender={{
              id: item.sender.userId.toString(),
              name: item.sender.userNickname,
              profileImage: item.sender.profileImageUrl || '',
            }}
            timestamp={formatSafeTime(item.createdAt)}
          />
        </View>
      );
    },
    [currentUserId],
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#1CBFDC" />
        <RNText style={styles.loadingText}>이전 메시지를 불러오는 중...</RNText>
      </View>
    );
  };

  // 로딩 상태
  if (isMessagesLoading && messages.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color="#1CBFDC" />
        <RNText style={{marginTop: 10, color: '#666'}}>
          메시지를 불러오는 중...
        </RNText>
      </SafeAreaView>
    );
  }

  // 에러 발생 시
  if (!groupChatroomId) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <RNText style={{color: 'red', textAlign: 'center', padding: 20}}>
          채팅방 ID가 제공되지 않았습니다.
        </RNText>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ChatHeader
          title={meetingTitle}
          memberCount={groupChatRoomDetail?.data?.participants?.length || 0}
          onBackPress={handleBackPress}
          onMenuPress={handleMenuPress}
        />

        <FlatList
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            messages.length === 0 && {flex: 1},
          ]}
          data={messages}
          keyExtractor={item => item.groupMessageId.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          inverted
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          windowSize={10}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          initialNumToRender={20}
          ListFooterComponent={renderFooter}
        />

        <ChatInput onSend={handleSendMessage} />

        {/* 채팅방 정보 모달 */}
        {groupChatRoomDetail?.data && (
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
                roomName={groupChatRoomDetail.data.meeting.meetingTitle}
                roomIcon={
                  groupChatRoomDetail.data.meeting.meetingImageUrl || undefined
                }
                memberCount={groupChatRoomDetail.data.participants.length}
                category="모임" // 그룹 채팅방 카테고리
                postTitle={groupChatRoomDetail.data.meeting.meetingTitle} // 모임 제목을 postTitle로도 사용
                isDirectMessage={false}
                members={groupChatRoomDetail.data.participants.map(
                  (participant, index) => {
                    // 실제 API 응답 구조에 맞게 user 객체에서 정보 추출
                    const user = participant.user;

                    // 사용자 이름 결정 로직
                    let displayName = '알 수 없는 사용자';

                    if (user.userNickname) {
                      const trimmedName = user.userNickname.trim();
                      if (trimmedName.length > 0) {
                        displayName = trimmedName;
                      }
                    }

                    // 여전히 이름이 없으면 userId 기반으로 생성
                    if (displayName === '알 수 없는 사용자' && user.userId) {
                      displayName = `사용자${user.userId}`;
                    }

                    console.log(`ChatRoomInfo 참여자 ${index + 1} 매핑:`, {
                      original: participant,
                      mapped: {
                        id: user.userId?.toString() || 'unknown',
                        name: displayName,
                        profileImage: user.profileImageUrl || dummyProfile,
                        isHost: participant.isHost,
                      },
                    });

                    return {
                      id: user.userId?.toString() || 'unknown',
                      name: displayName,
                      profileImage:
                        user.profileImageUrl &&
                        user.profileImageUrl.trim() !== ''
                          ? user.profileImageUrl
                          : dummyProfile,
                      isHost: participant.isHost, // 실제 호스트 정보 사용
                      isOnline: false, // TODO: 온라인 상태 정보 추가 필요
                    };
                  },
                )}
                onClose={closeRoomInfo}
                onLeaveRoom={handleLeaveRoom}
                isNotificationEnabled={
                  groupChatRoomDetail.data.pushNotificationOn === 1
                }
                onNotificationToggle={handleNotificationToggle}
                meetingId={groupChatRoomDetail.data.meeting.meetingId}
                navigation={navigation}
              />
            </Animated.View>
          </Animated.View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default GroupChatRoomScreen;
