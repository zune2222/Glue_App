import React from 'react';
import {SafeAreaView, View, Text, Image, FlatList} from 'react-native';
import {GroupListProps} from '../model/types';
import {MOCK_GROUPS} from '../model/mockData';
import {GroupItemCard} from './components/GroupItemCard';
import {BottomTabBar} from './components/BottomTabBar';
import {FloatingButton} from './components/FloatingButton';
import {commonStyles} from './styles/groupStyles';

/**
 * 모임 목록 화면 컴포넌트
 */
const GroupList: React.FC<GroupListProps> = ({navigation}) => {
  // 모임 아이템 클릭 핸들러
  const handleGroupPress = (groupId: string) => {
    // 그룹 상세 페이지로 이동
    navigation.navigate('GroupDetail', {groupId});
  };

  // 글쓰기 버튼 클릭 핸들러
  const handleCreatePress = () => {
    navigation.navigate('CreateGroup');
  };

  // 탭 버튼 클릭 핸들러
  const handleTabPress = (tabName: 'board' | 'group' | 'chat' | 'profile') => {
    // 메인 탭 네비게이션으로는 바로 이동할 수 없으므로, 실제로는
    // 앱 전체 네비게이션에서 구현해야 함
    console.log(`탭 이동: ${tabName}`);
    // 실제 구현시: navigation.getParent()?.navigate(tabName);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* 상단 상태바 */}

      {/* 서브 헤더 */}
      <View style={commonStyles.subHeader}>
        <Text style={commonStyles.subHeaderTitle}>{'전체'}</Text>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/7y63nh4b_expires_30_days.png',
          }}
          resizeMode={'stretch'}
          style={commonStyles.iconSmall}
        />
        <View style={commonStyles.flexFill} />
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/oeybkq5v_expires_30_days.png',
          }}
          resizeMode={'stretch'}
          style={[commonStyles.iconSmall, commonStyles.iconRight]}
        />
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/1h2q0fzg_expires_30_days.png',
          }}
          resizeMode={'stretch'}
          style={commonStyles.iconSmall}
        />
      </View>

      <View style={commonStyles.divider} />

      {/* 모임 목록 */}
      <FlatList
        data={MOCK_GROUPS}
        renderItem={({item}) => (
          <GroupItemCard item={item} onPress={handleGroupPress} />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      {/* 글쓰기 버튼 */}
      <FloatingButton onPress={handleCreatePress} label="글쓰기" />

      {/* 하단 탭바 */}
    </SafeAreaView>
  );
};

export default GroupList;
