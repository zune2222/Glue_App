import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';

type BirthDateInputProps = {
  onBirthDateChange: (date: Date) => void;
  initialDate?: Date | null;
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BirthDateInput = ({
  onBirthDateChange,
  initialDate = null,
}: BirthDateInputProps) => {
  const [birthDate, setBirthDate] = useState<Date | null>(initialDate || null);
  const [modalVisible, setModalVisible] = useState(false);
  const {t, i18n} = useTranslation();

  // 현재 언어에 따른 locale 설정
  const currentLocale = i18n.language === 'ko' ? 'ko-KR' : 'en-US';

  // 기본 날짜는 20년 전
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 20);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setModalVisible(false);
    }

    if (selectedDate) {
      setBirthDate(selectedDate);
      onBirthDateChange(selectedDate);
    }
  };

  const openDatePicker = () => {
    setModalVisible(true);
  };

  const closeDatePicker = () => {
    setModalVisible(false);
  };

  const confirmIOSDate = () => {
    closeDatePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('signup.birthdate.title')}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.dateInput} onPress={openDatePicker}>
          <Text style={[styles.dateText, !birthDate && styles.placeholderText]}>
            {birthDate
              ? formatDate(birthDate)
              : t('signup.birthdate.placeholder')}
          </Text>
        </TouchableOpacity>
        <View style={styles.inputBorder}></View>
      </View>

      {/* 날짜 선택 모달 */}
      {Platform.OS === 'ios' ? (
        <Modal
          transparent
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeDatePicker}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={closeDatePicker}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>
                    {t('common.cancel')}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {t('signup.birthdate.selectDate')}
                </Text>
                <TouchableOpacity
                  onPress={confirmIOSDate}
                  style={styles.modalButton}>
                  <Text style={[styles.modalButtonText, styles.confirmButton]}>
                    {t('common.ok')}
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={birthDate || defaultDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                style={styles.dateTimePicker}
                locale={currentLocale}
              />
            </View>
          </View>
        </Modal>
      ) : (
        modalVisible && (
          <DateTimePicker
            value={birthDate || defaultDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            locale={currentLocale}
          />
        )
      )}
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
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 40,
  },
  dateInput: {
    paddingVertical: 8,
  },
  dateText: {
    ...typography.body1,
    color: colors.richBlack,
    fontWeight: 'bold',
    fontSize: 18,
  },
  placeholderText: {
    color: colors.auroMetalSaurus,
  },
  inputBorder: {
    height: 1,
    backgroundColor: colors.lightSilver,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.ghostWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightSilver,
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    ...typography.button,
    color: colors.batteryChargedBlue,
  },
  confirmButton: {
    fontWeight: '600',
  },
  modalTitle: {
    ...typography.h4,
    color: colors.richBlack,
  },
  dateTimePicker: {
    height: 200,
    width: '100%',
  },
});

export default BirthDateInput;
