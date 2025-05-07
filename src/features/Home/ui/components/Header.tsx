import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

const Header = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/y30cgyqd_expires_30_days.png',
          }}
          resizeMode={'stretch'}
          style={styles.logo}
        />
      </View>
      <View style={styles.flex1}></View>
      <TouchableOpacity>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/b7z391og_expires_30_days.png',
          }}
          resizeMode={'stretch'}
          style={styles.navbarIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/n1po82jh_expires_30_days.png',
          }}
          resizeMode={'stretch'}
          style={[styles.navbarIcon, styles.marginLeft0]}
        />
      </TouchableOpacity>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 35,
    height: 25,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#384050',
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
