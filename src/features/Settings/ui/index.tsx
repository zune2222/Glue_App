import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text} from '../../../shared/ui/typography/Text';
import SettingsHeader from '../../../widgets/header/ui/SettingsHeader';
import {useTranslation} from 'react-i18next';
import {changeLanguage, Language, LANGUAGE_NAMES} from '@shared/lib/i18n';
import {CenterModal, CenterModalOption} from '@shared/ui/CenterModal';

const SettingsScreen = () => {
  const {t, i18n} = useTranslation();
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  // 언어 옵션 생성
  const languageOptions: CenterModalOption[] = [
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
  const handleLanguageChange = async (option: CenterModalOption) => {
    try {
      const success = await changeLanguage(option.value as Language);
      if (success) {
        console.log(`${t('settings.languageChanged')}: ${option.label}`);
        // 언어 변경 성공 시 추가 동작을 여기에 구현할 수 있습니다
        // 예: Toast 메시지 표시, 앱 재시작 등
      }
    } catch (error) {
      console.error(t('settings.languageChangeError'), error);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert(t('settings.logout'), t('settings.logoutConfirm'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('settings.logout'),
        style: 'destructive',
        onPress: () => {
          // TODO: 로그아웃 로직 구현
          console.log(t('settings.logoutProcessing'));
        },
      },
    ]);
  };

  // 회원탈퇴 처리
  const handleWithdrawal = () => {
    Alert.alert(t('settings.withdrawal'), t('settings.withdrawalConfirm'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('common.withdraw'),
        style: 'destructive',
        onPress: () => {
          // TODO: 회원탈퇴 로직 구현
          console.log(t('settings.withdrawalProcessing'));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SettingsHeader />

      <ScrollView style={styles.content}>
        {/* 앱 설정 섹션 */}
        <View style={styles.section}>
          <Text
            variant="subtitle1"
            weight="semiBold"
            style={styles.sectionTitle}>
            {t('settings.appSettings')}
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsLanguageModalVisible(true)}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.languageSettings')}
            </Text>
            <Text variant="body1" weight="regular" style={styles.menuValue}>
              {LANGUAGE_NAMES[i18n.language as Language] ||
                LANGUAGE_NAMES[Language.KOREAN]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 이용 안내 섹션 */}
        <View style={styles.section}>
          <Text
            variant="subtitle1"
            weight="semiBold"
            style={styles.sectionTitle}>
            {t('settings.usageGuide')}
          </Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.appVersion')}
            </Text>
            <Text variant="body1" weight="regular" style={styles.menuValue}>
              1.0.0
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 문의하기 화면으로 이동
              console.log(t('settings.inquiry') + ' 클릭');
            }}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.inquiry')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 공지사항 화면으로 이동
              console.log(t('settings.announcements') + ' 클릭');
            }}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.announcements')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 서비스 이용약관 화면으로 이동
              console.log(t('settings.termsOfService') + ' 클릭');
            }}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.termsOfService')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 개인정보 처리방침 화면으로 이동
              console.log(t('settings.privacyPolicy') + ' 클릭');
            }}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.privacyPolicy')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={() => {
              // TODO: 오픈소스 라이선스 화면으로 이동
              console.log(t('settings.openSourceLicense') + ' 클릭');
            }}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.openSourceLicense')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 기타 섹션 */}
        <View style={styles.section}>
          <Text
            variant="subtitle1"
            weight="semiBold"
            style={styles.sectionTitle}>
            {t('settings.others')}
          </Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleWithdrawal}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.withdrawal')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={handleLogout}>
            <Text variant="body1" weight="regular" style={styles.menuLabel}>
              {t('settings.logout')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 언어 선택 모달 */}
      <CenterModal
        title={
          t('settings.languageSelect') ||
          t('settings.systemLanguageSelectFallback')
        }
        options={languageOptions}
        isVisible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
        onSelect={handleLanguageChange}
        selectedValue={i18n.language}
      />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuLabel: {
    color: '#333333',
  },
  menuValue: {
    color: '#666666',
  },
};

export default SettingsScreen;
