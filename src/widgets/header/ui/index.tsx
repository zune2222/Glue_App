import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface HeaderProps {
  route: {
    name: string;
  };
}

export const Header = (props: HeaderProps) => {
  const getTitle = () => {
    switch (props.route.name) {
      case 'Board':
        return '홈';
      case 'Messages':
        return '채팅';
      case 'Profile':
        return '프로필';
      case 'Settings':
        return '설정';
      default:
        return props.route.name;
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{getTitle()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#44FF54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;
