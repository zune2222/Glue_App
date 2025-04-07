import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {theme} from '../../../../app/styles/theme';
import {colors} from '../../../../app/styles/colors';
import {typography} from '../../../../app/styles/typography';
import {AppleSvg, GoogleSvg, KakaoSvg} from '../../../../shared/assets/images';

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
        <View style={styles.iconContainer}>
          <GoogleSvg width={30} height={30} />
        </View>
      ),
    },
    apple: {
      container: [styles.socialButton, styles.appleButton],
      text: [styles.socialButtonText, styles.appleButtonText],
      label: t('auth.welcome.continueWithApple'),
      icon: (
        <View style={styles.iconContainer}>
          <AppleSvg width={50} height={50} />
        </View>
      ),
    },
    kakao: {
      container: [styles.socialButton, styles.kakaoButton],
      text: [styles.socialButtonText, styles.kakaoButtonText],
      label: t('auth.welcome.continueWithKakao'),
      icon: (
        <View style={styles.iconContainer}>
          <KakaoSvg width={16} height={16} />
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
    flexDirection: 'row',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadow.light,
  },
  socialButtonText: {
    ...typography.button,
    textAlign: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  googleButton: {
    backgroundColor: '#ffffff',
  },
  googleButtonText: {
    color: colors.richBlack,
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  appleButtonText: {
    color: '#ffffff',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    color: '#392020',
  },
});
