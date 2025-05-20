import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {Header, TabBar, NotificationItem} from './components';
import {NotificationIconType} from './components/NotificationItem';

// 임시 알림 데이터
const NEWS_DATA = [
  {
    id: '1',
    iconType: 'meeting' as NotificationIconType,
    title: '모임 만남 잊지 않으셨죠?',
    content: '내일은 김클루님의 모임 만남 예정일이에요! 😊',
    time: '05.08. 12:21',
  },
  {
    id: '2',
    iconType: 'guestbook' as NotificationIconType,
    title: '새로운 방명록',
    content: '신짱구 : 정말 친절하시고 분위기도 편하게 만들어주셨...',
    time: '05.08. 12:21',
  },
  {
    id: '3',
    iconType: 'meeting' as NotificationIconType,
    title: '모임 만남 잊지 않으셨죠?',
    content: '내일은 김클루님의 모임 만남 예정일이에요! 😊',
    time: '05.08. 12:21',
  },
  {
    id: '4',
    iconType: 'reply' as NotificationIconType,
    title: '내가 남긴 방명록 답글',
    content: '신짱구 : 감사합니다 ㅎㅎ! 다음에 또 모임에서 만날 수...',
    time: '05.08. 12:21',
  },
  {
    id: '5',
    iconType: 'guestbook' as NotificationIconType,
    title: '방명록을 남겨보세요',
    content: '어제 만난 모임의 친구들에게 방명록을 남겨보세요!',
    time: '05.08. 12:21',
  },
];

const NOTICE_DATA = [
  {
    id: '1',
    iconType: 'update' as NotificationIconType,
    title: '모임 기능 업데이트 안내',
    content: '새로운 기능이 업데이트 되었어요.',
    time: '2025.05.08. 14:21',
  },
  {
    id: '2',
    iconType: 'party' as NotificationIconType,
    title: 'Party D-2',
    content: '하이드아웃에서의 파티 예정일이 곧 다가와요!',
    time: '2025.05.08. 14:21',
  },
];

const NotificationsScreen = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'notice'>('news');

  const handleTabChange = (tab: 'news' | 'notice') => {
    setActiveTab(tab);
  };

  const renderNotifications = () => {
    const data = activeTab === 'news' ? NEWS_DATA : NOTICE_DATA;

    return data.map(item => (
      <NotificationItem
        key={item.id}
        iconType={item.iconType}
        title={item.title}
        content={item.content}
        time={item.time}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.scrollView}>
      <Header />
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.notificationsContainer}>
          {renderNotifications()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  notificationsContainer: {
    marginHorizontal: 19,
    marginTop: 26,
  },
});

export default NotificationsScreen;
