import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Bell, logo, Search} from '@shared/assets/images';
import {useNavigation} from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation<any>();

  const handleBellPress = () => {
    navigation.navigate('NotificationsScreen');
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <Image source={logo} resizeMode={'stretch'} style={styles.logo} />
      </View>
      <View style={styles.flex1}></View>
      <TouchableOpacity>
        <Search style={styles.navbarIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBellPress}>
        <Bell style={[styles.navbarIcon, styles.marginLeft0]} />
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
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 8,
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
