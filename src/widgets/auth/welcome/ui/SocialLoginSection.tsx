import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {SocialLoginButton} from '@features/auth/social-login-button';

// 전체 내비게이션 타입 정의
type RootStackParamList = {
  Auth: {
    screen?: string;
    params?: {
      screen?: string;
    };
  };
  Main: {
    screen?: string;
    params?: {
      screen?: string;
    };
  };
};

export const SocialLoginSection = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // 소셜 로그인 핸들러 - 백엔드 연결 전, 바로 회원가입 화면으로 이동
  const handleSocialLogin = async (provider: string) => {
    console.log(`${provider} 로그인 시도`);

    // 회원 정보가 없다고 가정하고 회원가입 화면으로 이동
    if (provider === 'Kakao') {
      navigation.navigate('Auth', {
        screen: 'SignUp',
      });
    } else if (provider === 'Google') {
      navigation.navigate('Auth', {
        screen: 'SignUp',
      });
    } else if (provider === 'Apple') {
      navigation.navigate('Main', {
        screen: 'Home',
      });
    }
  };

  return (
    <View style={styles.container}>
      <SocialLoginButton
        type="kakao"
        onPress={() => handleSocialLogin('Kakao')}
      />

      <SocialLoginButton
        type="google"
        onPress={() => handleSocialLogin('Google')}
      />

      <SocialLoginButton
        type="apple"
        onPress={() => handleSocialLogin('Apple')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
});
