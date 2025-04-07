import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {useTranslation} from 'react-i18next';

export const TitleSection = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>
      <Image
        source={require('../../../../shared/assets/images/logo/logo-text.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 120,
  },
  logo: {
    marginTop: 12,
    width: 128,
    height: 32,
  },
  title: {
    fontSize: 50,
    fontWeight: '400',
    textAlign: 'center',
    color: '#44FF54',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    textAlign: 'center',
    color: '#4F4F4F',
  },
});
