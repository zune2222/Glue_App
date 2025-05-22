import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {GroupItemCard} from './components/GroupItemCard';
import {FloatingButton} from './components/FloatingButton';
import {commonStyles} from './styles/groupStyles';
import {Text} from '../../../shared/ui/typography/Text';
import {useNavigation} from '@react-navigation/native';
import GroupListHeader from './components/GroupListHeader';
import {useInfinitePosts} from '../api/hooks';
import {PostItem} from '../api/api';
import {toastService} from '../../../shared/lib/notifications/toast';

// 카테고리 타입 및 카테고리 ID 매핑
type CategoryType = 'all' | 'study' | 'social' | 'help';

const CATEGORY_ID_MAP: Record<CategoryType, number | undefined> = {
  all: undefined, // 전체 (필터링 없음)
  study: 1, // 공부
  social: 2, // 친목
  help: 3, // 도움
};

/**
 * 모임 목록 화면 컴포넌트
 */
const GroupList: React.FC = () => {
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  // 선택된 카테고리 ID 가져오기
  const selectedCategoryId = CATEGORY_ID_MAP[selectedCategory];

  // 무한 스크롤 데이터 가져오기
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfinitePosts(selectedCategoryId);

  // 모든 페이지의 게시글을 하나의 배열로 병합
  const allPosts = data?.pages.flatMap(page => (page as any).data.posts) || [];

  // 게시글 추가 로딩 핸들러 (무한 스크롤)
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 끌어서 새로고침 핸들러
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // 모임 아이템 클릭 핸들러
  const handleGroupPress = (postId: number) => {
    // 그룹 상세 페이지로 이동
    navigation.navigate('GroupDetail', {postId});
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

  // 게시글 렌더링 함수
  const renderPostItem = ({item}: {item: PostItem}) => {
    // PostItem을 GroupItemCard에 필요한 형식으로 변환
    const groupItem = {
      id: item.postId.toString(),
      title: item.title,
      description:
        item.content.length > 100
          ? item.content.substring(0, 100) + '...'
          : item.content,
      category: getCategoryTextFromId(item.categoryId),
      categoryColor: getCategoryColorFromId(item.categoryId),
      categoryTextColor: '#FFFFFF',
      likes: item.likeCount,
      viewCounts: `${item.viewCount}`,
      participants: `${item.currentParticipants}/${item.maxParticipants}`,
      time: formatDate(item.createdAt),
      image: item.thumbnailUrl || undefined,
    };

    return (
      <GroupItemCard
        item={groupItem}
        onPress={() => handleGroupPress(item.postId)}
      />
    );
  };

  // 카테고리 ID에서 텍스트로 변환
  const getCategoryTextFromId = (categoryId: number): string => {
    switch (categoryId) {
      case 1:
        return t('group.categories.study');
      case 2:
        return t('group.categories.social');
      case 3:
        return t('group.categories.help');
      default:
        return '';
    }
  };

  // 카테고리 ID에서 색상으로 변환
  const getCategoryColorFromId = (categoryId: number): string => {
    switch (categoryId) {
      case 1: // 공부
        return '#3498db';
      case 2: // 친목
        return '#2ecc71';
      case 3: // 도움
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 에러 처리
  if (isError) {
    toastService.error(t('common.error'), t('group.error.fetch_failed'));
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* 헤더 컴포넌트 */}
      <GroupListHeader
        categoryText={getCategoryDisplayText()}
        onCategoryPress={() => setIsDropdownVisible(true)}
      />

      {/* 모임 목록 */}
      <FlatList
        data={allPosts}
        renderItem={renderPostItem}
        keyExtractor={item => item.postId.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !isFetchingNextPage}
            onRefresh={handleRefresh}
            colors={['#1CBFDC']}
            tintColor={'#1CBFDC'}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#1CBFDC" />
            ) : (
              <Text>{t('group.search.noResults')}</Text>
            )}
          </View>
        )}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#1CBFDC" />
            </View>
          ) : null
        }
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default GroupList;
