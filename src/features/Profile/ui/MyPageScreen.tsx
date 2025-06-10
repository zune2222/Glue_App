import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from '@shared/ui/typography/Text';
import {useTranslation} from 'react-i18next';

import {LanguageCard} from './components/LanguageCard';
import {MyInfoItem} from './components/MyInfoItem';
import {styles} from './styles/MyPageScreen.styles';
import {useMyPage} from '../model/useMyPage';
import {getLanguageText, getLanguageLevelText} from '../model/utils';
import {RightArrowIcon} from '@shared/assets/images';
import CustomHeader from '@widgets/header/ui/CustomHeader';
import {secureStorage} from '@shared/lib/security';

export const MyPageScreen = () => {
  const navigation = useNavigation<any>();
  const {myPageInfo, isLoading, isError, error} = useMyPage();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const {t} = useTranslation();

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userId = await secureStorage.getUserId();
        setCurrentUserId(userId);
      } catch (error) {
        console.error('사용자 ID 가져오기 실패:', error);
      }
    };
    getCurrentUserId();
  }, []);

  // 기본 프로필 이미지
  const defaultAvatar = require('@shared/assets/images/logo.png');

  // 내 방명록으로 이동
  const handleGuestbookPress = () => {
    if (currentUserId && myPageInfo?.userNickname) {
      navigation.navigate('Guestbook', {
        userId: currentUserId,
        userNickname: myPageInfo.userNickname,
      });
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader />
        <View
          style={[
            styles.content,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{marginTop: 16}}>{t('profile.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader />
        <View
          style={[
            styles.content,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text style={{color: 'red', textAlign: 'center'}}>
            {error?.message || t('profile.loadError')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── 프로필 섹션 (실제 API 데이터) ── */}
        <TouchableOpacity
          style={styles.profileRow}
          onPress={() => navigation.navigate('ProfileEdit')}>
          <Image
            source={
              myPageInfo?.profileImageUrl
                ? {uri: myPageInfo.profileImageUrl}
                : defaultAvatar
            }
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.nickname}>
              {myPageInfo?.userNickname || t('profile.defaultUser')}
            </Text>
            <Text style={styles.bio}>
              {myPageInfo?.description || t('profile.defaultBio')}
            </Text>
          </View>

          {/* 오른쪽 화살표 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileEdit')}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <RightArrowIcon width={24} height={24} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 언어 설정 */}
        <Text style={styles.sectionTitle}>{t('profile.languageSettings')}</Text>
        <View style={styles.languageContainer}>
          <LanguageCard
            title={t('profile.myLanguage')}
            language={
              myPageInfo
                ? getLanguageText(myPageInfo.mainLanguage, t)
                : t('profile.notSet')
            }
            level={
              myPageInfo
                ? getLanguageLevelText(myPageInfo.mainLanguageLevel, t)
                : t('profile.notSet')
            }
            onEdit={() => navigation.navigate('ProfileEdit')}
          />
          <LanguageCard
            title={t('profile.exchangeLanguage')}
            language={
              myPageInfo
                ? getLanguageText(myPageInfo.learningLanguage, t)
                : t('profile.notSet')
            }
            level={
              myPageInfo
                ? getLanguageLevelText(myPageInfo.learningLanguageLevel, t)
                : t('profile.notSet')
            }
            onEdit={() => navigation.navigate('ProfileEdit')}
          />
        </View>

        {/* 내 정보 리스트 */}
        <Text style={styles.sectionTitle}>{t('profile.myInfo')}</Text>
        <View style={styles.infoList}>
          <MyInfoItem
            label={t('profile.myGroupsHistory')}
            onPress={() => navigation.navigate('GroupHistory')}
          />
          <MyInfoItem
            label={t('profile.myParticipatingGroups')}
            onPress={() => navigation.navigate('LikedGroups')}
          />
          <MyInfoItem
            label={t('profile.myLikes')}
            onPress={() => navigation.navigate('LikedGroups')}
          />
          <MyInfoItem
            label={t('profile.myGuestbook')}
            onPress={handleGuestbookPress}
          />
          <MyInfoItem
            label={t('profile.privacySettings')}
            onPress={() => navigation.navigate('PrivacySettings')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
