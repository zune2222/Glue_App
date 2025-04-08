import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {theme} from '../../../../app/styles/theme';
import {
  AppLogo,
  TitleSection,
  SocialLoginSection,
} from '../../../../widgets/auth/welcome';
import {useTranslation} from 'react-i18next';
import {changeLanguage, Language} from '../../../../shared/lib/i18n';
import {SafeArea} from '../../../../shared/ui';

const WelcomeScreen = () => {
  const {i18n} = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang =
      currentLang === Language.KOREAN ? Language.ENGLISH : Language.KOREAN;
    changeLanguage(newLang);
  };

  return (
    <View style={styles.background}>
      <SafeArea style={styles.container}>
        <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
          <Text style={styles.langButtonText}>
            {i18n.language === Language.KOREAN ? 'English' : '한국어'}
          </Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <AppLogo />
          <TitleSection />
          <SocialLoginSection />
        </View>
      </SafeArea>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  langButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    zIndex: 100,
  },
  langButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F4F4F',
  },
});

export default WelcomeScreen;
