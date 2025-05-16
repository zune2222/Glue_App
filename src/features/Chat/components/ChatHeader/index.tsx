import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';

interface ChatHeaderProps {
  title: string;
  memberCount: number;
  onBackPress: () => void;
  onMenuPress: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  memberCount,
  onBackPress,
  onMenuPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress}>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/asb22nxh_expires_30_days.png',
          }}
          resizeMode="contain"
          style={styles.backButton}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{`${title}  ${memberCount}`}</Text>

      <TouchableOpacity onPress={onMenuPress}>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/lxrs4xgg_expires_30_days.png',
          }}
          resizeMode="contain"
          style={styles.menuButton}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;
