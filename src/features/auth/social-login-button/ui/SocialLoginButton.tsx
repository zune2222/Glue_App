import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AppleSvg, GoogleSvg, KakaoSvg} from '../../../../shared/assets/images';
import {useTranslation} from 'react-i18next';

// 소셜 로그인 버튼 타입
export type SocialButtonProps = {
  type: 'google' | 'apple' | 'kakao';
  onPress: () => void;
};

// 소셜 로그인 버튼 컴포넌트
export const SocialLoginButton = ({type, onPress}: SocialButtonProps) => {
  const {t} = useTranslation();

  // 각 소셜 로그인별 스타일 및 텍스트 정의
  const buttonStyles = {
    google: {
      container: [styles.socialButton, styles.googleButton],
      text: [styles.socialButtonText, styles.googleButtonText],
      label: t('auth.welcome.continueWithGoogle'),
      icon: (
        <View style={styles.googleIconContainer}>
          <GoogleSvg width={18} height={18} />
        </View>
      ),
    },
    apple: {
      container: [styles.socialButton, styles.appleButton],
      text: [styles.socialButtonText, styles.appleButtonText],
      label: t('auth.welcome.continueWithApple'),
      icon: (
        <View style={styles.appleIconContainer}>
          <AppleSvg width={15} height={18} />
        </View>
      ),
    },
    kakao: {
      container: [styles.socialButton, styles.kakaoButton],
      text: [styles.socialButtonText, styles.kakaoButtonText],
      label: t('auth.welcome.continueWithKakao'),
      icon: (
        <View style={styles.kakaoIconContainer}>
          <KakaoSvg width={18} height={18} />
        </View>
      ),
    },
  };

  const {container, text, label, icon} = buttonStyles[type];

  return (
    <TouchableOpacity style={container} onPress={onPress}>
      {icon}
      <Text style={text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    width: 244,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderRadius: 4,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
  // Google 버튼 스타일
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#747775',
    paddingHorizontal: 12,
  },
  googleIconContainer: {
    width: 18,
    height: 18,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#1F1F1F',
  },
  // Apple 버튼 스타일
  appleButton: {
    backgroundColor: '#050708',
    paddingHorizontal: 32,
    gap: 9,
  },
  appleIconContainer: {
    width: 15,
    height: 18.75,
    marginRight: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButtonText: {
    color: 'white',
  },
  // 카카오 버튼 스타일
  kakaoButton: {
    backgroundColor: '#FEE500',
    paddingVertical: 10,
  },
  kakaoIconContainer: {
    width: 18,
    height: 18,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoButtonText: {
    color: 'black',
  },
});
