import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';

type SelectionButtonProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  compact?: boolean; // 그리드에 적합한 좁은 버튼인지 여부
};

const SelectionButton = ({
  label,
  isSelected,
  onPress,
  style,
  textStyle,
  compact = false,
}: SelectionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: isSelected
            ? colors.batteryChargedBlue
            : colors.ghostWhite,
          borderColor: isSelected
            ? colors.batteryChargedBlue
            : colors.lightSilver,
        },
        compact && styles.compactButton,
        style,
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: isSelected ? colors.ghostWhite : colors.manatee,
          },
          compact && styles.compactText,
          textStyle,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  compactButton: {
    paddingVertical: 11,
    paddingHorizontal: 8,
    marginBottom: 0,
  },
  text: {
    ...typography.h3,
    fontWeight: 'bold',
  },
  compactText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default SelectionButton;
