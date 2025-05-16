import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import EmptyChatScreen from '../EmptyChatScreen';
import ChatRoomListScreen from '../ChatRoomListScreen';
import {fetchChatRooms} from '../../model';
import {ChatRoom} from '../../entities/types';

interface ChatListScreenProps {
  navigation?: any;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({navigation}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        const rooms = await fetchChatRooms();
        setChatRooms(rooms);
      } catch (error) {
        console.error('채팅방 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, []);

  const handleExplorePress = () => {
    // 모임 둘러보기 화면으로 이동하는 로직
    Alert.alert('모임 둘러보기', '모임 둘러보기 화면으로 이동합니다.');
  };

  const handleChatRoomPress = (roomId: string) => {
    // 채팅방 상세 화면으로 이동하는 로직
    if (navigation) {
      navigation.navigate('Chat', {roomId});
    }
  };

  // 로딩 중이면 아무것도 보여주지 않음
  if (loading) {
    return null; // 로딩 컴포넌트를 추가할 수 있음
  }

  // 채팅방이 없는 경우 빈 화면 표시
  if (chatRooms.length === 0) {
    return <EmptyChatScreen onExplorePress={handleExplorePress} />;
  }

  // 채팅방이 있는 경우 채팅방 목록 표시
  return (
    <ChatRoomListScreen
      chatRooms={chatRooms}
      onChatRoomPress={handleChatRoomPress}
    />
  );
};

export default ChatListScreen;
