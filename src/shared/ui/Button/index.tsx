import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Text} from '../typography';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  style,
  textStyle,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    if (disabled) return [styles.button, styles.disabledButton, style];

    switch (variant) {
      case 'primary':
        return [styles.button, styles.primaryButton, style];
      case 'secondary':
        return [styles.button, styles.secondaryButton, style];
      default:
        return [styles.button, styles.primaryButton, style];
    }
  };

  const getTextStyle = () => {
    if (disabled)
      return [styles.buttonText, styles.disabledButtonText, textStyle];

    switch (variant) {
      case 'primary':
        return [styles.buttonText, styles.primaryButtonText, textStyle];
      case 'secondary':
        return [styles.buttonText, styles.secondaryButtonText, textStyle];
      default:
        return [styles.buttonText, styles.primaryButtonText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={getTextStyle()}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: '#1CBFDC',
  },
  secondaryButton: {
    backgroundColor: 'rgba(28, 191, 220, 0.30)',
  },
  disabledButton: {
    backgroundColor: 'rgba(28, 191, 220, 0.30)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: 'white',
  },
  disabledButtonText: {
    color: 'white',
  },
});
