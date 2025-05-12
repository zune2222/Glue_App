import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';
import LevelIcon from '@shared/assets/icons/LevelIcon';

type LevelButtonProps = {
  label: string;
  level: 1 | 2 | 3 | 4 | 5;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

const LevelButton = ({
  label,
  level,
  isSelected,
  onPress,
  style,
}: LevelButtonProps) => {
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
      <View style={styles.spacer} />
      <LevelIcon
        level={level}
        activeColor={isSelected ? colors.ghostWhite : '#384050'}
        inactiveColor={isSelected ? 'rgba(255, 255, 255, 0.5)' : '#D2D5DB'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  text: {
    ...typography.body1,
    fontWeight: 'bold',
    fontSize: 20,
  },
  spacer: {
    flex: 1,
  },
  levelImage: {
    borderRadius: 8,
    width: 52,
    height: 8,
  },
});

export default LevelButton;
