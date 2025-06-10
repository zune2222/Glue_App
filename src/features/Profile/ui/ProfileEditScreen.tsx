// src/features/Profile/ui/ProfileEditScreen.tsx
import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Text} from '@shared/ui/typography/Text';
import {useMyPage} from '../model/useMyPage';
import {styles} from './styles/ProfileEdit.styles';
import {useTranslation} from 'react-i18next';
import {changeLanguage, Language, LANGUAGE_NAMES} from '@shared/lib/i18n';
import {SelectModal, SelectOption} from '@shared/ui/SelectModal';
import ProfileEditHeader from '@widgets/header/ui/ProfileEditHeader';

const ProfileEditScreen = () => {
  const {myPageInfo, isLoading, isError, error} = useMyPage();
  const {t, i18n} = useTranslation();

  // 편집 가능한 필드들의 상태
  const [description, setDescription] = useState('');
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  // 기본 프로필 이미지
  const defaultAvatar = require('@shared/assets/images/logo.png');

  // 언어 옵션 생성
  const languageOptions: SelectOption[] = [
    {
      label: LANGUAGE_NAMES[Language.KOREAN],
      value: Language.KOREAN,
    },
    {
      label: LANGUAGE_NAMES[Language.ENGLISH],
      value: Language.ENGLISH,
    },
  ];

  // 언어 변경 핸들러
  const handleLanguageChange = async (option: SelectOption) => {
    try {
      const success = await changeLanguage(option.value as Language);
      if (success) {
        console.log(`${t('settings.languageChanged')}: ${option.label}`);
        // 언어 변경 성공 시 추가 동작을 여기에 구현할 수 있습니다
        // 예: Toast 메시지 표시, 앱 재시작 등
      }
    } catch (languageError) {
      console.error('언어 변경 중 오류:', languageError);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {t('profile.editProfile.loadingProfile')}
          </Text>
        </View>
      </View>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || t('profile.editProfile.loadProfileError')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileEditHeader />
      <ScrollView contentContainerStyle={styles.content}>
        {/* 프로필 이미지 및 닉네임 */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                myPageInfo?.profileImageUrl
                  ? {uri: myPageInfo.profileImageUrl}
                  : defaultAvatar
              }
              style={styles.avatar}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.nickname}>
            {myPageInfo?.userNickname || t('profile.defaultUser')}
          </Text>
        </View>

        {/* 한줄소개 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('profile.editProfile.introduction')}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsDescriptionEditing(!isDescriptionEditing)}>
              <Text style={styles.editButtonText}>{t('common.edit')}</Text>
            </TouchableOpacity>
          </View>

          {isDescriptionEditing ? (
            <TextInput
              style={styles.textInput}
              value={description || myPageInfo?.description || ''}
              onChangeText={setDescription}
              placeholder={t('profile.editProfile.introductionPlaceholder')}
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.descriptionText}>
              {myPageInfo?.description ||
                t('profile.editProfile.defaultIntroduction')}
            </Text>
          )}
        </View>

        {/* 기본 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('profile.editProfile.basicInfo')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('profile.editProfile.name')}
            </Text>
            <Text style={styles.infoValue}>김우주</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('profile.editProfile.nickname')}
            </Text>
            <Text style={styles.infoValue}>
              {myPageInfo?.userNickname || t('profile.defaultUser')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('profile.editProfile.birthDate')}
            </Text>
            <Text style={styles.infoValue}>2002.04.08</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('profile.editProfile.gender')}
            </Text>
            <Text style={styles.infoValue}>
              {t('profile.editProfile.female')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('settings.systemLanguage')}</Text>
            <View style={styles.infoRowRight}>
              <Text style={styles.infoValue}>
                {LANGUAGE_NAMES[i18n.language as Language] ||
                  LANGUAGE_NAMES[Language.KOREAN]}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsLanguageModalVisible(true)}>
                <Text style={styles.editButtonText}>{t('common.edit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 학교 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('profile.editProfile.schoolInfo')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('profile.editProfile.school')}
            </Text>
            <Text style={styles.infoValue}>부산대학교</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('profile.editProfile.department')}
            </Text>
            <Text style={styles.infoValue}>국어국문학과</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('profile.editProfile.email')}
            </Text>
            <Text style={styles.infoValue}>abcdefg1234@pusan.ac.kr</Text>
          </View>
        </View>
      </ScrollView>

      {/* 언어 선택 모달 */}
      <SelectModal
        title={t('settings.systemLanguageSelect')}
        options={languageOptions}
        isVisible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
        onSelect={handleLanguageChange}
        selectedValue={i18n.language}
      />
    </View>
  );
};

export default ProfileEditScreen;
