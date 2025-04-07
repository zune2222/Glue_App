import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {semanticColors} from '../../../app/styles/colors';
import {theme} from '../../../app/styles/theme';
import {
  AppLogo,
  TitleSection,
  SocialLoginSection,
  TermsNotice,
} from '../../../widgets/auth/welcome';

const WelcomeScreen = () => {
  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <AppLogo />
          <TitleSection />
          <SocialLoginSection />
          <TermsNotice />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: semanticColors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
});

export default WelcomeScreen;
