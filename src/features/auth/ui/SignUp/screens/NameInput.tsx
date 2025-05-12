import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';
import {useTranslation} from 'react-i18next';

type NameInputProps = {
  onNameChange: (name: string) => void;
  initialName?: string;
};

const NameInput = ({onNameChange, initialName = ''}: NameInputProps) => {
  const [name, setName] = useState(initialName);
  const [isFocused, setIsFocused] = useState(false);
  const {t} = useTranslation();

  const handleNameChange = (text: string) => {
    setName(text);
    onNameChange(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('signup.name.title')}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={name}
          onChangeText={handleNameChange}
          placeholder={t('signup.name.placeholder')}
          placeholderTextColor={colors.manatee}
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View
          style={[
            styles.inputBorder,
            {
              borderColor: isFocused
                ? colors.batteryChargedBlue
                : colors.lightSilver,
            },
          ]}
        />
      </View>
    </KeyboardAvoidingView>
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
  label: {
    color: colors.richBlack,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  input: {
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 0,
    color: colors.richBlack,
  },
  inputBorder: {
    height: 1,
    backgroundColor: colors.lightSilver,
  },
});

export default NameInput;
