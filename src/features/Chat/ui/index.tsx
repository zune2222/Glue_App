import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeArea} from '../../../shared/ui';

const ChatListScreen = () => {
  return (
    <SafeArea>
      <View style={styles.container}>
        <Text style={styles.title}>메시지 목록 화면</Text>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ChatListScreen;
