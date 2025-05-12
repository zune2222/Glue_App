import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Text} from '../../../../shared/ui/typography/Text';

export const TitleSection = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.titleContainer}>
      <Text variant="body2" color="#4F4F4F" style={styles.subtitle}>
        {t('auth.welcome.subtitle')}
      </Text>
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
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
