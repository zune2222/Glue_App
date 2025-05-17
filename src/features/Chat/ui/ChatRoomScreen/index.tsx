import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
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
      roomId: string;
    };
  };
  navigation?: any;
}

const {width} = Dimensions.get('window');

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({route, navigation}) => {
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const roomId = route?.params?.roomId || '1'; // 기본값 제공

  // 패널을 드래그하여 닫을 수 있는 PanResponder 설정
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 오른쪽으로 스와이프할 때만 반응
        return gestureState.dx > 5;
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
      try {
        const details = await fetchChatDetails(roomId);
        if (details) {
          setChatDetails(details);
          setMessages(details.messages);
        }
      } catch (error) {
        console.error('채팅방 정보를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatDetails();
  }, [roomId]);

  const handleSendMessage = async (text: string) => {
    try {
      const newMessage = await sendMessage(roomId, text);
      if (newMessage && chatDetails) {
        setMessages(prevMessages => [...prevMessages, newMessage]);

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

  if (loading || !chatDetails) {
    return null; // 로딩 컴포넌트를 추가할 수 있음
  }

  const getUserById = (userId: string) => {
    return chatDetails.users.find(user => user.id === userId);
  };

  return (
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
        {messages.map(message => {
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
        })}
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
  );
};

export default ChatRoomScreen;
