import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {MOCK_GROUPS} from '../model/mockData';
import {GroupItemCard} from './components/GroupItemCard';
import {FloatingButton} from './components/FloatingButton';
import {commonStyles} from './styles/groupStyles';
import {Text} from '../../../shared/ui/typography/Text';
import {useNavigation} from '@react-navigation/native';
import GroupListHeader from './components/GroupListHeader';

// 카테고리 타입
type CategoryType = 'all' | 'study' | 'social' | 'help';

/**
 * 모임 목록 화면 컴포넌트
 */
const GroupList: React.FC = () => {
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [filteredGroups, setFilteredGroups] = useState(MOCK_GROUPS);

  // 카테고리에 따라 모임 목록을 필터링하는 함수
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredGroups(MOCK_GROUPS);
    } else {
      // MOCK_GROUPS의 카테고리 값과 일치하는 한국어 카테고리 매핑
      const categoryMapping: Record<CategoryType, string> = {
        all: '', // all 카테고리는 사용하지 않음
        study: '공부',
        social: '친목',
        help: '도움',
      };

      // 선택된 카테고리에 해당하는 모임만 필터링
      const filtered = MOCK_GROUPS.filter(
        group => group.category === categoryMapping[selectedCategory],
      );
      setFilteredGroups(filtered);
    }
  }, [selectedCategory]);

  // 모임 아이템 클릭 핸들러
  const handleGroupPress = (groupId: string) => {
    // 그룹 상세 페이지로 이동
    navigation.navigate('GroupDetail', {groupId});
  };

  // 글쓰기 버튼 클릭 핸들러
  const handleCreatePress = () => {
    navigation.navigate('GroupCreate');
  };

  // 카테고리 변경 핸들러
  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsDropdownVisible(false);
  };

  // 카테고리 표시 텍스트
  const getCategoryDisplayText = () => {
    switch (selectedCategory) {
      case 'study':
        return t('group.categories.study');
      case 'social':
        return t('group.categories.social');
      case 'help':
        return t('group.categories.help');
      default:
        return t('group.all');
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* 헤더 컴포넌트 */}
      <GroupListHeader
        categoryText={getCategoryDisplayText()}
        onCategoryPress={() => setIsDropdownVisible(true)}
      />

      {/* 모임 목록 */}
      <FlatList
        data={filteredGroups}
        renderItem={({item}) => (
          <GroupItemCard item={item} onPress={handleGroupPress} />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      {/* 글쓰기 버튼 */}
      <FloatingButton onPress={handleCreatePress} label={t('group.write')} />

      {/* 카테고리 드롭다운 모달 */}
      <Modal
        transparent={true}
        visible={isDropdownVisible}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownVisible(false)}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                selectedCategory === 'all' && styles.selectedItem,
              ]}
              onPress={() => handleCategorySelect('all')}>
              <Text
                variant="body1"
                weight="semiBold"
                color={selectedCategory === 'all' ? '#303030' : '#9DA2AF'}
                style={styles.dropdownText}>
                {t('group.all')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownItem,
                selectedCategory === 'study' && styles.selectedItem,
              ]}
              onPress={() => handleCategorySelect('study')}>
              <Text
                variant="body1"
                weight="semiBold"
                color={selectedCategory === 'study' ? '#303030' : '#9DA2AF'}
                style={styles.dropdownText}>
                {t('group.categories.study')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownItem,
                selectedCategory === 'social' && styles.selectedItem,
              ]}
              onPress={() => handleCategorySelect('social')}>
              <Text
                variant="body1"
                weight="semiBold"
                color={selectedCategory === 'social' ? '#303030' : '#9DA2AF'}
                style={styles.dropdownText}>
                {t('group.categories.social')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownItem,
                selectedCategory === 'help' && styles.selectedItem,
              ]}
              onPress={() => handleCategorySelect('help')}>
              <Text
                variant="body1"
                weight="semiBold"
                color={selectedCategory === 'help' ? '#303030' : '#9DA2AF'}
                style={styles.dropdownText}>
                {t('group.categories.help')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 100,
    left: 15,
    width: 120,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#303030',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedItem: {
    // backgroundColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
  },
});

export default GroupList;
