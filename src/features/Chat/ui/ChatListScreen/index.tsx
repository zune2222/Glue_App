import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import EmptyChatScreen from '../EmptyChatScreen';
import {fetchChatRooms} from '../../model';
import {ChatRoom} from '../../entities/types';

interface ChatListScreenProps {
  navigation?: any;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({navigation: _}) => {
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

  // 채팅방이 없는 경우 빈 화면 표시
  if (!loading && chatRooms.length === 0) {
    return <EmptyChatScreen onExplorePress={handleExplorePress} />;
  }

  // 채팅방이 있는 경우의 화면 (추후 구현)
  return <EmptyChatScreen onExplorePress={handleExplorePress} />;
};

export default ChatListScreen;
