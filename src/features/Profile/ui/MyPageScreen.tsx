import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileCard } from './components/ProfileCard';
import { GroupHistoryCard } from './components/GroupHistoryCard';
import { LikedGroupCard } from './components/LikedGroupCard';
import { LanguageCard } from './components/LanguageCard';
import { MyInfoItem } from './components/MyInfoItem';
import { styles } from './styles/MyPageScreen.styles';
import { useProfile, useGroupHistory, useLikedGroups } from '../model/useProfile';
import { RightArrowIcon } from '@shared/assets/images';
import CustomHeader from '@widgets/header/ui/CustomHeader';

export const MyPageScreen = () => {
  const navigation = useNavigation();
  const { profile } = useProfile();
  const { history } = useGroupHistory();
  const { liked } = useLikedGroups();
   // 임시 더미 프로필 데이터
  const dummyProfile = {
    avatar: require('@shared/assets/images/logo.png'),
    nickname: '김글루',
    bio: '잘 부탁드려요',
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView contentContainerStyle={styles.content}>

{/* ── 프로필 섹션 (더미 데이터) ── */}
        <TouchableOpacity
          style={styles.profileRow}
          onPress={() => navigation.navigate('ProfileDetail')}
        >
          <Image
            source={dummyProfile.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.nickname}>{dummyProfile.nickname}</Text>
            <Text style={styles.bio}>{dummyProfile.bio}</Text>
          </View>
          
          {/* 오른쪽 화살표 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileDetail')}
           hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
         >
            <RightArrowIcon width={24} height={24} />
          </TouchableOpacity>        
         </TouchableOpacity>
        {/* 히스토리 필터 + 리스트 */}
        <View style={styles.section}>
          {history.map(item => (
            <GroupHistoryCard key={item.id} item={item} />
          ))}
        </View>
        {/* 좋아요 리스트 */}
        <View style={styles.section}>
          {liked.map(item => (
            <LikedGroupCard key={item.id} item={item} />
          ))}   
        </View>
        {/* 언어 설정 */}
        <Text style={styles.sectionTitle}>언어 설정</Text>
        <View style={styles.languageContainer}>
          <LanguageCard
            title="나의 언어"
            language={profile?.language}
            level={profile?.languageLevel}
            onEdit={() => navigation.navigate('ProfileEdit')}
          />
          <LanguageCard
            title="교환 언어"
            language={profile?.exchangeLanguage}
            level={profile?.exchangeLanguageLevel}
            onEdit={() => navigation.navigate('ProfileEdit')}
          />
        </View>
        {/* 내 정보 리스트 */}
        <Text style={styles.sectionTitle}>내 정보</Text>
        <View style={styles.infoList}>
          <MyInfoItem label="내가 모임 히스토리" onPress={() => navigation.navigate('GroupHistory')} />
          <MyInfoItem label="내 좋아요 목록" onPress={() => navigation.navigate('LikedGroups')} />
          <MyInfoItem label="내 방명록" onPress={() => navigation.navigate('Guestbook')} />
          <MyInfoItem label="공개범위 설정" onPress={() => navigation.navigate('PrivacySettings')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};