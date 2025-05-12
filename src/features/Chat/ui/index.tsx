import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeArea} from '../../../shared/ui';
import {Text} from '../../../shared/ui/typography/Text';

const ChatListScreen = () => {
  return (
    <SafeArea>
      <View style={styles.container}>
        <Text variant="subtitle1" weight="medium" style={styles.title}>
          메시지 목록 화면
        </Text>
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
  },
});

export default ChatListScreen;
