import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ChevronLeft} from '@shared/assets/images';
import {useNavigation} from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ChevronLeft style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>알림</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 17,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    color: '#303030',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
    height: 24,
  },
});

export default Header;
