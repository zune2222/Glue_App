import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text} from '../../../shared/ui/typography/Text';
import CustomHeader from '../../../widgets/header/ui/CustomHeader';
import {useTranslation} from 'react-i18next';
import {changeLanguage, Language, LANGUAGE_NAMES} from '@shared/lib/i18n';
import {SelectModal, SelectOption} from '@shared/ui/SelectModal';

const SettingsScreen = () => {
  const {t, i18n} = useTranslation();
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

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
    } catch (error) {
      console.error('언어 변경 중 오류:', error);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => {
          // TODO: 로그아웃 로직 구현
          console.log('로그아웃 처리');
        },
      },
    ]);
  };

  // 회원탈퇴 처리
  const handleWithdrawal = () => {
    Alert.alert(
      '회원탈퇴',
      '정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: () => {
            // TODO: 회원탈퇴 로직 구현
            console.log('회원탈퇴 처리');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="설정" />

      <ScrollView style={styles.content}>
        {/* 앱 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appSettings')}</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsLanguageModalVisible(true)}>
            <Text style={styles.menuLabel}>{t('settings.languageSettings')}</Text>
            <Text style={styles.menuValue}>
              {LANGUAGE_NAMES[i18n.language as Language] || LANGUAGE_NAMES[Language.KOREAN]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 이용 안내 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이용 안내</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>앱 버전</Text>
            <Text style={styles.menuValue}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 문의하기 화면으로 이동
              console.log('문의하기 클릭');
            }}>
            <Text style={styles.menuLabel}>문의하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 공지사항 화면으로 이동
              console.log('공지사항 클릭');
            }}>
            <Text style={styles.menuLabel}>공지사항</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 서비스 이용약관 화면으로 이동
              console.log('서비스 이용약관 클릭');
            }}>
            <Text style={styles.menuLabel}>서비스 이용약관</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              // TODO: 개인정보 처리방침 화면으로 이동
              console.log('개인정보 처리방침 클릭');
            }}>
            <Text style={styles.menuLabel}>개인정보 처리방침</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={() => {
              // TODO: 오픈소스 라이선스 화면으로 이동
              console.log('오픈소스 라이선스 클릭');
            }}>
            <Text style={styles.menuLabel}>오픈소스 라이선스</Text>
          </TouchableOpacity>
        </View>

        {/* 기타 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기타</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleWithdrawal}>
            <Text style={styles.menuLabel}>회원탈퇴</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={handleLogout}>
            <Text style={styles.menuLabel}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 언어 선택 모달 */}
      <SelectModal
        title={t('settings.languageSelect')}
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
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#333333',
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
    fontSize: 16,
    color: '#333333',
  },
  menuValue: {
    fontSize: 16,
    color: '#666666',
  },
};

export default SettingsScreen;
