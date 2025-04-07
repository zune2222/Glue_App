import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '../../../app/providers/theme';
import {Text} from '../typography';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  multiline?: boolean;
  readOnly?: boolean;
  onPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  secureTextEntry = false,
  autoCapitalize = 'none',
  style,
  inputStyle,
  labelStyle,
  multiline = false,
  readOnly = false,
  onPress,
}) => {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return '#ED2D2D';
    if (isFocused) return '#1CBFDC';
    return '#D2D5DB';
  };

  const renderInput = () => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9DA2AF"
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      editable={!disabled && !readOnly}
      multiline={multiline}
      style={[
        styles.input,
        {
          color: '#030712',
          opacity: disabled ? 0.6 : 1,
        },
        inputStyle,
      ]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error ? '#ED2D2D' : disabled ? '#9DA2AF' : '#030712',
            },
            labelStyle,
          ]}>
          {label}
        </Text>
      )}

      <View style={styles.inputContainer}>
        {readOnly && onPress ? (
          <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.readOnlyContainer}>{renderInput()}</View>
          </TouchableWithoutFeedback>
        ) : (
          renderInput()
        )}

        <View
          style={[
            styles.border,
            {
              borderColor: getBorderColor(),
            },
          ]}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  border: {
    height: 1,
    width: '100%',
    marginTop: 8,
  },
  error: {
    color: '#ED2D2D',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '400',
  },
  readOnlyContainer: {
    width: '100%',
  },
});
