import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {theme} from '../../../app/styles/theme';
import {colors} from '../../../app/styles/colors';
import {typography} from '../../../app/styles/typography';
import {
  welcomeBackground,
  logo,
  AppleSvg,
  GoogleSvg,
  KakaoSvg,
} from '../../../shared/assets/images';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>;

// 소셜 로그인 버튼 타입
type SocialButtonProps = {
  type: 'google' | 'apple' | 'kakao';
  onPress: () => void;
};

// 소셜 로그인 버튼 컴포넌트
const SocialLoginButton = ({type, onPress}: SocialButtonProps) => {
  const {t} = useTranslation();

  // 각 소셜 로그인별 스타일 및 텍스트 정의
  const buttonStyles = {
    google: {
      container: [styles.socialButton, styles.googleButton],
      text: [styles.socialButtonText, styles.googleButtonText],
      label: t('auth.welcome.continueWithGoogle'),
      Icon: GoogleSvg,
    },
    apple: {
      container: [styles.socialButton, styles.appleButton],
      text: [styles.socialButtonText, styles.appleButtonText],
      label: t('auth.welcome.continueWithApple'),
      Icon: AppleSvg,
    },
    kakao: {
      container: [styles.socialButton, styles.kakaoButton],
      text: [styles.socialButtonText, styles.kakaoButtonText],
      label: t('auth.welcome.continueWithKakao'),
      Icon: KakaoSvg,
    },
  };

  const {container, text, label, Icon} = buttonStyles[type];

  return (
    <TouchableOpacity style={container} onPress={onPress}>
      <Icon width={24} height={24} style={styles.socialIconImage} />
      <Text style={text}>{label}</Text>
    </TouchableOpacity>
  );
};

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const {t} = useTranslation();

  // 소셜 로그인 핸들러 - 실제 구현시에는 인증 로직 추가
  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 로그인 시도`);
    // 소셜 로그인 성공 후 처리
    navigation.navigate('Login'); // 임시로 Login 페이지로 이동
  };

  return (
    <ImageBackground
      source={
        welcomeBackground || {
          uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
        }
      }
      style={styles.background}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{t('auth.welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>

          <View style={styles.buttonContainer}>
            <SocialLoginButton
              type="google"
              onPress={() => handleSocialLogin('Google')}
            />

            <SocialLoginButton
              type="apple"
              onPress={() => handleSocialLogin('Apple')}
            />

            <SocialLoginButton
              type="kakao"
              onPress={() => handleSocialLogin('Kakao')}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.termsText}>
              {t('auth.welcome.termsNotice').split('이용약관')[0]}
              <Text style={styles.termsLink}>{t('auth.welcome.terms')}</Text>
              {t('auth.welcome.termsNotice').includes('개인정보처리방침')
                ? '과 '
                : ' and '}
              <Text style={styles.termsLink}>{t('auth.welcome.privacy')}</Text>
              {t('auth.welcome.termsNotice').split('개인정보처리방침')[1]}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadow.medium,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    ...typography.h1,
    color: colors.ghostWhite,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle1,
    color: colors.ghostWhite,
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: theme.spacing.xl,
  },
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
  socialIconImage: {
    width: 24,
    height: 24,
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
  footer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  termsText: {
    ...typography.caption,
    color: colors.ghostWhite,
    textAlign: 'center',
    opacity: 0.8,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
