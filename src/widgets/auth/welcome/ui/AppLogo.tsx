import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {theme} from '../../../../app/styles/theme';

export const AppLogo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require('../../../../shared/assets/images/logo/logo-transparent.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoImage: {
    width: 128,
    height: 92,
  },
});
