import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ChevronLeft, ChevronDown} from '../../../shared/assets/images';
import {colors} from '../../../app/styles/colors';
import {Text} from '../../../shared/ui/typography/Text';

type RouteParams = {
  groupType: string;
};

const MAX_MEMBERS = 10;

const GroupCreateStep2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {t} = useTranslation();
  const {groupType} = route.params as RouteParams;

  const [myLanguage, setMyLanguage] = useState('한국어');
  const [exchangeLanguage, setExchangeLanguage] = useState('영어');
  const [memberCount, setMemberCount] = useState('8');

  const [showMyLanguageModal, setShowMyLanguageModal] = useState(false);
  const [showExchangeLanguageModal, setShowExchangeLanguageModal] =
    useState(false);
  const [showMemberCountModal, setShowMemberCountModal] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    // 다음 페이지로 이동
    navigation.navigate('GroupCreateStep3', {
      groupType,
      myLanguage,
      exchangeLanguage,
      memberCount: Number(memberCount),
    });
  };

  const languageOptions = [
    '한국어',
    '영어',
    '일본어',
    '중국어',
    '독일어',
    '프랑스어',
    '스페인어',
  ];
  const memberCountOptions = Array.from({length: MAX_MEMBERS}, (_, i) =>
    String(i + 1),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('group.create.title')}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.stepText}>
          {t('group.create.step', {step: 2, total: 4})}
        </Text>

        <Text style={styles.titleText}>
          고려할 언어와 모임 인원을{'\n'}선택해주세요
        </Text>

        {/* 언어 선택 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>언어 교환</Text>
          </View>

          <View style={styles.languageSelectionRow}>
            <Text style={styles.labelText}>나의 언어인</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowMyLanguageModal(true)}>
              <Text style={styles.dropdownButtonText}>{myLanguage}</Text>
              <ChevronDown width={16} height={16} />
            </TouchableOpacity>

            <Text style={styles.labelText}>과</Text>
          </View>

          <View style={styles.languageSelectionRow}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowExchangeLanguageModal(true)}>
              <Text style={styles.dropdownButtonText}>{exchangeLanguage}</Text>
              <ChevronDown width={16} height={16} />
            </TouchableOpacity>

            <Text style={styles.labelText}>를 교환할게요.</Text>
          </View>
        </View>

        {/* 인원 선택 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>모임 인원</Text>
          </View>

          <View style={styles.languageSelectionRow}>
            <Text style={styles.labelText}>우리 모임의 인원은</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowMemberCountModal(true)}>
              <Text style={styles.dropdownButtonText}>{memberCount}명</Text>
              <ChevronDown width={16} height={16} />
            </TouchableOpacity>

            <Text style={styles.labelText}>이에요.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{t('common.next')}</Text>
        </TouchableOpacity>
      </View>

      {/* 언어 선택 모달 - 내 언어 */}
      <Modal
        transparent={true}
        visible={showMyLanguageModal}
        animationType="fade"
        onRequestClose={() => setShowMyLanguageModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMyLanguageModal(false)}>
          <View style={styles.modalContainer}>
            {languageOptions.map((lang, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  myLanguage === lang && styles.selectedModalItem,
                ]}
                onPress={() => {
                  setMyLanguage(lang);
                  setShowMyLanguageModal(false);
                }}>
                <Text
                  style={[
                    styles.modalItemText,
                    myLanguage === lang && styles.selectedModalItemText,
                  ]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 언어 선택 모달 - 교환 언어 */}
      <Modal
        transparent={true}
        visible={showExchangeLanguageModal}
        animationType="fade"
        onRequestClose={() => setShowExchangeLanguageModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowExchangeLanguageModal(false)}>
          <View style={styles.modalContainer}>
            {languageOptions.map((lang, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  exchangeLanguage === lang && styles.selectedModalItem,
                ]}
                onPress={() => {
                  setExchangeLanguage(lang);
                  setShowExchangeLanguageModal(false);
                }}>
                <Text
                  style={[
                    styles.modalItemText,
                    exchangeLanguage === lang && styles.selectedModalItemText,
                  ]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 인원 선택 모달 */}
      <Modal
        transparent={true}
        visible={showMemberCountModal}
        animationType="fade"
        onRequestClose={() => setShowMemberCountModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMemberCountModal(false)}>
          <View style={styles.modalContainer}>
            {memberCountOptions.map((count, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  memberCount === count && styles.selectedModalItem,
                ]}
                onPress={() => {
                  setMemberCount(count);
                  setShowMemberCountModal(false);
                }}>
                <Text
                  style={[
                    styles.modalItemText,
                    memberCount === count && styles.selectedModalItemText,
                  ]}>
                  {count}명
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    marginHorizontal: 17,
    position: 'relative',
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    color: colors.darkCharcoal,
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  stepText: {
    color: colors.charcoal,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 26,
    marginLeft: 19,
  },
  titleText: {
    color: colors.darkCharcoal,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
    marginLeft: 19,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 19,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionTitleText: {
    color: colors.charcoal,
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageSelectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  labelText: {
    color: colors.charcoal,
    fontSize: 16,
    marginHorizontal: 4,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.lightSilver,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 100,
  },
  dropdownButtonText: {
    color: colors.charcoal,
    fontSize: 16,
    marginRight: 8,
  },
  bottomContainer: {
    paddingHorizontal: 19,
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: colors.batteryChargedBlue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedModalItem: {
    backgroundColor: '#F4FCFD',
  },
  modalItemText: {
    color: colors.charcoal,
    fontSize: 16,
  },
  selectedModalItemText: {
    color: colors.batteryChargedBlue,
    fontWeight: 'bold',
  },
});

export default GroupCreateStep2;
