import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Animated,
  Dimensions,
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
  const slideAnim = useRef(new Animated.Value(width)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const roomId = route?.params?.roomId || '1'; // 기본값 제공

  useEffect(() => {
    if (showRoomInfo) {
      Animated.timing(slideAnim, {
        toValue: width * 0.1, // 화면의 10% 위치에서 멈춤 (남은 10%가 비어있게)
        duration: 300,
        delay: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250, // 닫힐 때는 조금 더 빠르게
        useNativeDriver: true,
      }).start();
    }
  }, [showRoomInfo, slideAnim]);

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
  };

  const closeRoomInfo = () => {
    setShowRoomInfo(false);
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
      <View
        style={[styles.modalOverlay, {display: showRoomInfo ? 'flex' : 'none'}]}
        onTouchEnd={closeRoomInfo}>
        <Animated.View
          style={[
            styles.sidePanel,
            {
              transform: [{translateX: slideAnim}],
            },
          ]}
          onTouchEnd={e => e.stopPropagation()}>
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
      </View>
    </SafeAreaView>
  );
};

export default ChatRoomScreen;
