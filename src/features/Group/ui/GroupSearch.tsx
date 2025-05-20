import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MOCK_GROUPS} from '../model/mockData';
import {GroupItemCard} from './components/GroupItemCard';
import {Text} from '../../../shared/ui/typography/Text';
import {Search, X} from '@shared/assets/images';
import {GroupItem, GroupListNavigationProp} from '../model/types';

// 최근 검색어를 저장할 AsyncStorage 키
const RECENT_SEARCHES_KEY = 'recentGroupSearches';

interface GroupSearchProps {
  navigation: GroupListNavigationProp;
}

const GroupSearch: React.FC<GroupSearchProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<GroupItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 컴포넌트 마운트 시 최근 검색어 로드
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // 최근 검색어 로드 함수
  const loadRecentSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  // 최근 검색어 저장 함수
  const saveRecentSearch = async (search: string) => {
    try {
      if (!search.trim()) return;

      // 중복 검색어 제거하고 최신 검색어를 맨 앞에 추가
      const updatedSearches = [
        search,
        ...recentSearches.filter(item => item !== search),
      ].slice(0, 10); // 최대 10개까지만 저장

      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches),
      );
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  // 검색어로 그룹 검색
  const searchGroups = (text: string) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    const results = MOCK_GROUPS.filter(
      group =>
        group.title.toLowerCase().includes(text.toLowerCase()) ||
        group.description.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchResults(results);
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    if (!searchText.trim()) return;

    setIsSearching(true);
    searchGroups(searchText);
    saveRecentSearch(searchText);
  };

  // 최근 검색어 클릭 핸들러
  const handleRecentSearchPress = (search: string) => {
    setSearchText(search);
    searchGroups(search);
    setIsSearching(true);
    // 최근 검색어 목록에서 해당 검색어를 맨 앞으로 이동
    saveRecentSearch(search);
  };

  // 최근 검색어 삭제 핸들러
  const handleRemoveRecentSearch = async (search: string) => {
    const updatedSearches = recentSearches.filter(item => item !== search);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(updatedSearches),
    );
  };

  // 전체 삭제 핸들러
  const handleClearAll = async () => {
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  // 그룹 아이템 클릭 핸들러
  const handleGroupPress = (groupId: string) => {
    navigation.navigate('GroupDetail', {groupId});
  };

  return (
    <SafeAreaView style={styles.container}>
      {isSearching ? (
        // 검색 결과 화면
        <>
          {/* 검색 헤더 */}
          <View style={styles.searchHeader}>
            <View style={styles.searchInputContainer}>
              <Search width={18} height={18} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={
                  t('group.search.placeholder') ||
                  '제목, 모임 카테고리, 내용 검색'
                }
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsSearching(false);
                setSearchText('');
              }}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>
                {t('common.cancel') || '취소'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 검색 결과 */}
          <FlatList
            data={searchResults}
            renderItem={({item}) => (
              <GroupItemCard item={item} onPress={handleGroupPress} />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text variant="body1">
                  {t('group.search.noResults') || '검색 결과가 없습니다.'}
                </Text>
              </View>
            }
          />
        </>
      ) : (
        // 검색 입력 및 최근 검색어 화면
        <ScrollView style={styles.scrollView}>
          {/* 검색 헤더 */}
          <View style={styles.searchHeader}>
            <View style={styles.searchInputContainer}>
              <Search width={18} height={18} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={
                  t('group.search.placeholder') ||
                  '제목, 모임 카테고리, 내용 검색'
                }
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                autoFocus
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>
                {t('common.cancel') || '취소'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 최근 검색어 헤더 */}
          <View style={styles.recentSearchHeader}>
            <Text style={styles.recentSearchTitle}>
              {t('group.search.recentSearches') || '최근 검색어'}
            </Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearAllText}>
                  {t('group.search.clearAll') || '전체삭제'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 최근 검색어 칩 */}
          <View style={styles.chipContainer}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chip}
                onPress={() => handleRecentSearchPress(search)}>
                <Text style={styles.chipText}>{search}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveRecentSearch(search)}>
                  <X style={styles.chipCloseIcon} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    marginHorizontal: 19,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D2D5DB',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 14,
  },
  searchInput: {
    flex: 1,
    color: '#303030',
    fontSize: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  cancelButton: {
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#9DA2AF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentSearchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
    marginHorizontal: 19,
  },
  recentSearchTitle: {
    color: '#303030',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearAllText: {
    color: '#6C7180',
    fontSize: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginLeft: 19,
    marginRight: 19,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D2D5DB',
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 11,
    marginRight: 7,
    marginBottom: 8,
  },
  chipText: {
    color: '#384050',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 7,
  },
  chipCloseIcon: {
    width: 12,
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default GroupSearch;
