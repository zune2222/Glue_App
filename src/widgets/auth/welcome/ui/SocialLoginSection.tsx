import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {SocialLoginButton} from '@features/auth/social-login-button';
import {login} from '@react-native-seoul/kakao-login';
import {appleAuth} from '@invertase/react-native-apple-authentication';

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
      try {
        console.log('시작!@#$');
        const token = await login();
        console.log(token, '끝!@#$');
      } catch (error) {
        console.error(error);
      }

      navigation.navigate('Auth', {
        screen: 'SignUp',
      });
    } else if (provider === 'Google') {
      navigation.navigate('Auth', {
        screen: 'SignUp',
      });
    } else if (provider === 'Apple') {
      try {
        // iOS Apple 로그인 처리
        if (Platform.OS === 'ios') {
          // 애플 로그인 요청
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: 0, // appleAuth.Operation.LOGIN의 값은 0입니다
            requestedScopes: [1, 0], // FULL_NAME(1), EMAIL(0)
          });

          // 인증 상태 확인
          const {identityToken, nonce, fullName, email} =
            appleAuthRequestResponse;

          // 여기서 사용자 정보 처리 (서버로 전송하거나 로컬에 저장)
          console.log('Apple 로그인 성공: ', {
            identityToken,
            nonce,
            fullName,
            email,
          });

          // 인증 완료 후 홈 화면으로 이동
          navigation.navigate('Main', {
            screen: 'Home',
          });
        }
      } catch (error) {
        console.error('Apple 로그인 실패: ', error);
      }
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

      {Platform.OS === 'ios' && (
        <SocialLoginButton
          type="apple"
          onPress={() => handleSocialLogin('Apple')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
});
