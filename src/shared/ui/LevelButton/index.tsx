import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';

type LevelButtonProps = {
  label: string;
  levelImageUri: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

const LevelButton = ({
  label,
  levelImageUri,
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
      <Image
        source={{uri: levelImageUri}}
        resizeMode="stretch"
        style={styles.levelImage}
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
