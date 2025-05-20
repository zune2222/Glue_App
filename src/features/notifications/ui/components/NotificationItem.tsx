import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Bell, Mail, Global, Chat, Users, Logo} from '@shared/assets/images';

export type NotificationIconType =
  | 'meeting'
  | 'guestbook'
  | 'reply'
  | 'update'
  | 'party'
  | 'system'
  | 'message';

export interface NotificationItemProps {
  iconType: NotificationIconType;
  title: string;
  content: string;
  time: string;
  onPress?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  iconType,
  title,
  content,
  time,
  onPress,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'meeting':
        return <Users style={styles.icon} />;
      case 'guestbook':
        return <Chat style={styles.icon} />;
      case 'reply':
        return <Chat style={styles.icon} />;
      case 'update':
        return (
          <Image
            style={styles.icon}
            source={require('@shared/assets/images/logo.png')}
          />
        );
      case 'party':
        return (
          <Image
            style={styles.icon}
            source={require('@shared/assets/images/logo.png')}
          />
        );
      case 'system':
        return (
          <Image
            style={styles.icon}
            source={require('@shared/assets/images/logo.png')}
          />
        );
      case 'message':
        return (
          <Image
            style={styles.icon}
            source={require('@shared/assets/images/logo.png')}
          />
        );
      default:
        return (
          <Image
            style={styles.icon}
            source={require('@shared/assets/images/logo.png')}
          />
        );
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    marginRight: 11,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 14,
    height: 14,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    color: '#303030',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  content: {
    color: '#384050',
    fontSize: 12,
    marginBottom: 4,
  },
  time: {
    color: '#9DA2AF',
    fontSize: 12,
  },
});

export default NotificationItem;
