import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {Crown} from '@shared/assets/images';
// 인라인 스타일 정의
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginLeft: 19,
    marginRight: 19,
  },
  myContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  contentContainer: {
    alignItems: 'flex-start',
    marginRight: 8,
    maxWidth: '70%',
  },
  myContentContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
    marginRight: 0,
  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderName: {
    color: '#303030',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  hostIcon: {
    width: 16,
    height: 16,
  },
  bubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    minWidth: 80,
  },
  myBubble: {
    backgroundColor: '#1CBFDC',
  },
  messageText: {
    color: '#303030',
    fontSize: 14,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  myTimestampContainer: {
    marginRight: 8,
    paddingRight: 0,
    marginLeft: 3,
  },
  timestamp: {
    color: '#303030',
    fontSize: 10,
    marginRight: 6,
  },
  readCount: {
    color: '#9DA2AF',
    fontSize: 10,
  },
});

export interface MessageProps {
  id: string;
  text: string;
  isMine: boolean;
  sender: {
    id: string;
    name: string;
    isHost?: boolean;
    profileImage: string;
  };
  timestamp: string;
  readCount?: number;
}

const ChatMessage: React.FC<MessageProps> = ({
  text,
  isMine,
  sender,
  timestamp,
  readCount,
}) => {
  return (
    <View
      style={[
        styles.container,
        isMine ? styles.myContainer : styles.otherContainer,
      ]}>
      {!isMine && (
        <Image
          source={{uri: sender.profileImage}}
          resizeMode="cover"
          style={styles.profileImage}
        />
      )}

      <View
        style={[styles.contentContainer, isMine && styles.myContentContainer]}>
        {!isMine && (
          <View style={styles.senderContainer}>
            <Text style={styles.senderName}>{sender.name}</Text>
            {sender.isHost && <Crown style={styles.hostIcon} />}
          </View>
        )}

        <TouchableOpacity
          style={[styles.bubble, isMine && styles.myBubble]}
          onPress={() => Alert.alert('메시지', text)}>
          <Text style={[styles.messageText, isMine && styles.myMessageText]}>
            {text}
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.timestampContainer,
            isMine && styles.myTimestampContainer,
          ]}>
          <Text style={styles.timestamp}>{timestamp}</Text>
          {readCount !== undefined && (
            <Text style={styles.readCount}>{readCount}</Text>
          )}
        </View>
      </View>

      {isMine && (
        <Image
          source={{uri: sender.profileImage}}
          resizeMode="cover"
          style={styles.profileImage}
        />
      )}
    </View>
  );
};

export default ChatMessage;
