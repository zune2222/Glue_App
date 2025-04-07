import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
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
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.container}>
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
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}>
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
  },
  titleContainer: {
    marginBottom: 20,
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
  },
  optionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  selectedOptionText: {
    color: '#030712',
    fontWeight: '400',
  },
  unselectedOptionText: {
    color: '#9DA2AF',
    fontWeight: '400',
  },
  checkIcon: {
    width: 12,
    height: 8.25,
    borderWidth: 2,
    borderColor: '#1CBFDC',
  },
});
