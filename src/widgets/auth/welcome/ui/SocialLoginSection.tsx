import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {SocialLoginButton} from '../../../../features/Auth/social-login-button';

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

  // 소셜 로그인 핸들러 - 실제 구현시에는 인증 로직 추가
  const handleSocialLogin = async (provider: string) => {
    console.log(`${provider} 로그인 시도`);

    try {
      // 소셜 로그인 성공 시 처리
      // TODO: 실제 인증 로직 구현
      // 임시 토큰 저장 (실제로는 로그인 성공 후 받은 토큰을 저장)
      // await AsyncStorage.setItem('auth_token', 'dummy_token');

      // 프로필 설정 화면으로 이동
      navigation.navigate('Auth', {
        screen: 'Profile',
      });
    } catch (error) {
      console.error('소셜 로그인 오류:', error);
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
