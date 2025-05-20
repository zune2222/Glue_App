import React from 'react';
import {SafeAreaView, View, Image, FlatList} from 'react-native';
import {GroupListProps} from '../model/types';
import {MOCK_GROUPS} from '../model/mockData';
import {GroupItemCard} from './components/GroupItemCard';
import {FloatingButton} from './components/FloatingButton';
import {commonStyles} from './styles/groupStyles';
import {Text} from '../../../shared/ui/typography/Text';
import {Bell, ChevronDown, Search} from '@shared/assets/images';

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

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* 상단 상태바 */}

      {/* 서브 헤더 */}
      <View style={commonStyles.subHeader}>
        <Text
          variant="subtitle1"
          weight="medium"
          style={commonStyles.subHeaderTitle}>
          {'전체'}
        </Text>
        <ChevronDown style={commonStyles.iconSmall} />
        <View style={commonStyles.flexFill} />
        <Search style={[commonStyles.iconSmall, commonStyles.iconRight]} />
        <Bell style={commonStyles.iconSmall} />
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
    </SafeAreaView>
  );
};

export default GroupList;
