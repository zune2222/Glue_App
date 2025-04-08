import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeArea} from '../../../shared/ui';

const PostDetailScreen = () => {
  return (
    <SafeArea>
      <View style={styles.container}>
        <Text style={styles.title}>게시글 상세 화면</Text>
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

export default PostDetailScreen;
