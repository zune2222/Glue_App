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
import {fetchChatDetails, sendMessage} from '../../model';
import {
  ChatDetails,
  ChatMessage as ChatMessageType,
} from '../../entities/types';

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
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // route.params.roomId가 없으면 기본값이 아니라 에러 처리
  const roomId = route?.params?.roomId;
  const dmChatRoomId = route?.params?.dmChatRoomId;

  // 패널을 드래그하여 닫을 수 있는 PanResponder 설정
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false, // 시작부터 모든 터치를 가로채지 않음
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 가로 이동이 세로 이동보다 크고 최소 10px 이상일 때만 반응
        return (
          gestureState.dx > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        // 오른쪽으로 드래그하는 거리만큼 애니메이션 값 조정
        if (gestureState.dx > 0) {
          slideAnim.setValue(width * 0.25 + gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // 일정 거리 이상 스와이프하면 메뉴 닫기
        if (gestureState.dx > width * 0.2) {
          closeRoomInfo();
        } else {
          // 그렇지 않으면 원래 위치로 돌아가기
          Animated.spring(slideAnim, {
            toValue: width * 0.25,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (showRoomInfo && !isClosing) {
      // 메뉴 열기 애니메이션 (패널 슬라이드 + 배경 페이드인)
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: width * 0.25, // 화면의 25% 위치 (75%만 차지)
          useNativeDriver: true,
          friction: 8, // 부드러운 애니메이션을 위한 설정
          tension: 40,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isClosing) {
      // 메뉴 닫기 애니메이션
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: width,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({finished}) => {
        // 애니메이션이 완료된 후에만 메뉴를 숨김
        if (finished) {
          setShowRoomInfo(false);
          setIsClosing(false);
        }
      });
    }
  }, [showRoomInfo, isClosing, slideAnim, fadeAnim]);

  useEffect(() => {
    const loadChatDetails = async () => {
      if (!roomId && !dmChatRoomId) {
        setError('채팅방 ID가 제공되지 않았습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let details;
        if (dmChatRoomId) {
          // DM 채팅방 정보 로드 (임시로 fetchChatDetails 재사용)
          // 실제로는 DM 채팅방 전용 API 호출 필요
          details = await fetchChatDetails(`dm_${dmChatRoomId}`);
        } else if (roomId) {
          // 일반 채팅방 정보 로드
          details = await fetchChatDetails(roomId);
        }

        if (details) {
          setChatDetails(details);
          setMessages(details.messages);
        } else {
          setError(`채팅방 정보를 찾을 수 없습니다: ${dmChatRoomId || roomId}`);
        }
      } catch (error) {
        console.error('채팅방 정보를 불러오는데 실패했습니다:', error);
        setError('채팅방 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadChatDetails();
  }, [roomId, dmChatRoomId]);

  const handleSendMessage = async (text: string) => {
    if (!chatDetails) return;

    try {
      let newMessage;
      if (dmChatRoomId) {
        // DM 메시지 전송 (임시로 sendMessage 재사용)
        // 실제로는 DM 메시지 전용 API 호출 필요
        newMessage = await sendMessage(`dm_${dmChatRoomId}`, text);
      } else if (roomId) {
        // 일반 메시지 전송
        newMessage = await sendMessage(roomId, text);
      }

      if (newMessage) {
        setMessages(prevMessages => [...prevMessages, newMessage!]);

        // 스크롤을 맨 아래로 이동
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 100);
      }
    } catch (error) {
      console.error('메시지 전송에 실패했습니다:', error);
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
    // 실제로는 채팅방을 나가는 API 호출 후 처리
    setTimeout(() => {
      if (navigation) {
        navigation.goBack();
      }
    }, 300);
  };

  // 로딩 중일 때 로딩 인디케이터 표시
  if (loading) {
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

  // 에러가 있을 때 에러 메시지 표시
  if (error || !chatDetails) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <RNText style={{fontSize: 16, color: '#ff0000', marginBottom: 20}}>
          {error || '채팅방 정보를 찾을 수 없습니다.'}
        </RNText>
        <TouchableWithoutFeedback onPress={handleBackPress}>
          <View
            style={{
              backgroundColor: '#1CBFDC',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 5,
            }}>
            <RNText style={{color: '#fff'}}>뒤로 가기</RNText>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }

  const getUserById = (userId: string) => {
    return chatDetails.users.find(user => user.id === userId);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ChatHeader
          title={chatDetails.name}
          memberCount={chatDetails.memberCount}
          onBackPress={handleBackPress}
          onMenuPress={handleMenuPress}
        />

        <DateDivider date="2025년 04월 12일" />

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
            messages.map(message => {
              const user = getUserById(message.senderId);
              if (!user) return null;

              return (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  text={message.text}
                  timestamp={message.timestamp}
                  readCount={message.readCount}
                  isMine={message.senderId === chatDetails.currentUserId}
                  sender={user}
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
              roomName={chatDetails.name}
              roomIcon={chatDetails.roomIcon}
              memberCount={chatDetails.memberCount}
              isDirectMessage={chatDetails.type === 'direct'}
              members={chatDetails.users.map(user => ({
                id: user.id,
                name: user.name,
                profileImage: user.profileImage,
                isHost: user.isHost,
                isOnline: user.isOnline,
              }))}
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
