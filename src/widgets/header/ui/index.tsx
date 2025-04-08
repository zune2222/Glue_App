import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../../shared/ui/typography';

interface HeaderProps {
  route: {
    name: string;
  };
  theme?: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
  };
}

export const Header = (props: HeaderProps) => {
  const {theme} = props;

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
    <View
      style={[styles.header, theme && {backgroundColor: theme.colors.primary}]}>
      <Text
        variant="h4"
        weight="bold"
        color={theme?.colors.primary ? '#FFFFFF' : undefined}>
        {getTitle()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // 그림자 효과 추가
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default Header;
