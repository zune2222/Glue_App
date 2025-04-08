import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeArea} from '../../../shared/ui';

const HomeScreen = () => {
  // 예시 게시글 데이터
  const boardItems = [
    {
      id: 1,
      title: '오늘의 공지사항입니다.',
      author: '관리자',
      date: '2023-07-15',
      views: 128,
    },
    {
      id: 2,
      title: '리액트 네이티브 스터디 모집',
      author: '개발자',
      date: '2023-07-14',
      views: 85,
    },
    {
      id: 3,
      title: '앱 업데이트 관련 안내',
      author: '관리자',
      date: '2023-07-13',
      views: 224,
    },
    {
      id: 4,
      title: 'FSD 패턴 적용 방법',
      author: '아키텍트',
      date: '2023-07-10',
      views: 156,
    },
    {
      id: 5,
      title: '사용자 경험 개선 제안',
      author: '디자이너',
      date: '2023-07-09',
      views: 92,
    },
  ];

  return (
    <SafeArea>
      <View style={styles.container}>
        {boardItems.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.itemMeta}>
              <Text style={styles.itemMetaText}>{item.author}</Text>
              <Text style={styles.itemMetaText}>
                {item.date} • 조회 {item.views}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  itemCard: {
    backgroundColor: 'white',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemMetaText: {
    color: '#757575',
    fontSize: 12,
  },
});

export default HomeScreen;
