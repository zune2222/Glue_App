import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {ChatRoom} from '../../entities/types';
import {dummyProfile} from '@shared/assets/images';
interface ChatRoomItemProps {
  room: ChatRoom;
  onPress: (roomId: string) => void;
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({room, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(room.id)}
      activeOpacity={0.7}>
      <Image source={dummyProfile} resizeMode="cover" style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.name}>{room.name}</Text>
            <View style={styles.dot} />
            <Text style={styles.memberCount}>8</Text>
          </View>
          <Text style={styles.timestamp}>{room.lastMessageTime}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text
            style={styles.lastMessage}
            numberOfLines={1}
            ellipsizeMode="tail">
            {room.lastMessage}
          </Text>
          {room.unreadCount ? (
            <View
              style={[
                styles.unreadIndicator,
                {backgroundColor: '#1CBFDC', borderRadius: 4.5},
              ]}
            />
          ) : (
            <View />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRoomItem;
