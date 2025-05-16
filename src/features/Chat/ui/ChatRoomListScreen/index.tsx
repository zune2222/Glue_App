import React, {useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {styles} from './styles';
import {ChatRoom} from '../../entities/types';
import {ChatRoomItem, TabHeader} from '../../components';

interface ChatRoomListScreenProps {
  chatRooms: ChatRoom[];
  onChatRoomPress: (roomId: string) => void;
}

const ChatRoomListScreen: React.FC<ChatRoomListScreenProps> = ({
  chatRooms,
  onChatRoomPress,
}) => {
  const [activeTab] = useState<'chat' | 'message'>('chat');

  return (
    <SafeAreaView style={styles.container}>
      <TabHeader activeTab={activeTab} />

      <ScrollView style={styles.scrollView}>
        {chatRooms.map(room => (
          <ChatRoomItem key={room.id} room={room} onPress={onChatRoomPress} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatRoomListScreen;
