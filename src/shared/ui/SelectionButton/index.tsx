import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';

type SelectionButtonProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: object;
};

const SelectionButton = ({
  label,
  isSelected,
  onPress,
  style,
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
        style,
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: isSelected ? colors.ghostWhite : colors.manatee,
          },
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
  text: {
    ...typography.h3,
    fontWeight: 'bold',
  },
});

export default SelectionButton;
