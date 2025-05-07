import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const Header = () => {
  return (
    <View style={styles.navbar}>
      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/y30cgyqd_expires_30_days.png',
        }}
        resizeMode={'stretch'}
        style={styles.logo}
      />
      <View style={styles.flex1}></View>
      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/b7z391og_expires_30_days.png',
        }}
        resizeMode={'stretch'}
        style={styles.navbarIcon}
      />
      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/n1po82jh_expires_30_days.png',
        }}
        resizeMode={'stretch'}
        style={[styles.navbarIcon, styles.marginLeft0]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    paddingHorizontal: 19,
    marginBottom: 19,
  },
  logo: {
    width: 35,
    height: 25,
  },
  navbarIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  marginLeft0: {
    marginRight: 0,
  },
  flex1: {
    flex: 1,
  },
});

export default Header;
