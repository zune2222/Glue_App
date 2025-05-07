import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';
import {useTranslation} from 'react-i18next';

type UniversitySelectionProps = {
  selectedUniversity: string | null;
  onUniversitySelect: (university: string) => void;
};

const UniversitySelection = ({
  selectedUniversity,
  onUniversitySelect,
}: UniversitySelectionProps) => {
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  // 현재는 부산대학교만 선택 가능
  const universities = [{id: 'pusan', name: t('signup.university.pusan')}];

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelect = (id: string) => {
    onUniversitySelect(id);
    closeModal();
  };

  // 선택된 대학교 이름 가져오기
  const getSelectedUniversityName = () => {
    if (!selectedUniversity) return '';

    const selected = universities.find(univ => univ.id === selectedUniversity);
    return selected ? selected.name : '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('signup.university.title')}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.selector} onPress={openModal}>
          <View style={styles.selectorContent}>
            <Text
              style={[
                styles.selectorText,
                !selectedUniversity && styles.placeholderText,
              ]}>
              {selectedUniversity
                ? getSelectedUniversityName()
                : t('signup.university.placeholder')}
            </Text>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/laddv804_expires_30_days.png',
              }}
              resizeMode="stretch"
              style={styles.dropdownIcon}
            />
          </View>
          <View style={styles.selectorBorder} />
        </TouchableOpacity>
      </View>

      {/* 대학교 선택 모달 */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('signup.university.label')}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={universities}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.universityItem}
                  onPress={() => handleSelect(item.id)}>
                  <Text style={styles.universityName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 64,
  },
  title: {
    ...typography.h2,
    color: colors.richBlack,
  },
  inputContainer: {
    marginBottom: 40,
  },
  selector: {
    paddingVertical: 8,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectorText: {
    ...typography.body1,
    color: colors.richBlack,
    fontWeight: 'bold',
    fontSize: 18,
  },
  placeholderText: {
    color: colors.auroMetalSaurus,
  },
  dropdownIcon: {
    width: 24,
    height: 24,
  },
  selectorBorder: {
    height: 1,
    backgroundColor: colors.lightSilver,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.ghostWhite,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightSilver,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.richBlack,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.auroMetalSaurus,
  },
  universityItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightSilver,
  },
  universityName: {
    ...typography.body1,
    color: colors.richBlack,
  },
});

export default UniversitySelection;
