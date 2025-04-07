import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {theme} from '../../../../app/styles/theme';
import {logo} from '../../../../shared/assets/images';

export const AppLogo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image source={logo} style={styles.logoImage} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadow.medium,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
});
