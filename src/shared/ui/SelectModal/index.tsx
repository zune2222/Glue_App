import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import {Text} from '../typography';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectModalProps {
  title: string;
  options: SelectOption[];
  isVisible: boolean;
  onClose: () => void;
  onSelect: (option: SelectOption) => void;
  selectedValue?: string;
}

const {height} = Dimensions.get('window');

export const SelectModal: React.FC<SelectModalProps> = ({
  title,
  options,
  isVisible,
  onClose,
  onSelect,
  selectedValue,
}) => {
  // 옵션 선택 핸들러
  const handleOptionSelect = (option: SelectOption) => {
    // 약간의 지연을 주어 iOS에서 더 잘 작동하도록 함
    setTimeout(
      () => {
        onSelect(option);
        onClose();
      },
      Platform.OS === 'ios' ? 100 : 0,
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen">
      <View style={styles.container}>
        {/* 백드롭 영역 - 모달 외부 터치시 닫힘 */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionItem}
                activeOpacity={0.6}
                onPress={() => handleOptionSelect(option)}>
                <Text
                  style={[
                    styles.optionText,
                    option.value === selectedValue
                      ? styles.selectedOptionText
                      : styles.unselectedOptionText,
                  ]}>
                  {option.label}
                </Text>

                {option.value === selectedValue && (
                  <View style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* iOS에서 명확한 취소 버튼 추가 */}
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.7}
            onPress={onClose}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // iOS에서 더 높은 z-index 보장
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 24,
    maxHeight: height * 0.7,
    // iOS에서 그림자 추가
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: '#030712',
  },
  optionsContainer: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12, // 터치 영역 확장
    borderRadius: 8,
    // 터치 시 배경색 변경 (iOS에서 더 명확한 피드백)
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  optionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  selectedOptionText: {
    color: '#030712',
    fontWeight: '600', // 선택된 항목 강조
  },
  unselectedOptionText: {
    color: '#9DA2AF',
    fontWeight: '400',
  },
  checkIcon: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#1CBFDC',
    borderRadius: 6, // 동그란 체크 아이콘
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  cancelText: {
    fontSize: 16,
    color: '#FF3B30', // iOS 스타일 취소 버튼 색상
    fontWeight: '600',
  },
});
