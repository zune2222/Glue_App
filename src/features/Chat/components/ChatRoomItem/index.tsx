import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {ChatRoom} from '../../entities/types';

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
      <Image
        source={{
          uri:
            room.id === '1'
              ? 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/cm1k26wd_expires_30_days.png'
              : 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/1eld2fix_expires_30_days.png',
        }}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.name}>{room.name}</Text>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/r7i1neqo_expires_30_days.png',
              }}
              resizeMode="contain"
              style={styles.dot}
            />
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
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/lkakza83_expires_30_days.png',
              }}
              resizeMode="contain"
              style={styles.unreadIndicator}
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRoomItem;
