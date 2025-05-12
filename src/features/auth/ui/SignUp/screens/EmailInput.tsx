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

type EmailInputProps = {
  onEmailChange: (email: string) => void;
  initialEmail?: string;
};

const EmailInput = ({onEmailChange, initialEmail = ''}: EmailInputProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [isFocused, setIsFocused] = useState(false);
  const {t} = useTranslation();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    onEmailChange(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('signup.email.title')}</Text>
        <Text style={styles.subtitle}>{t('signup.email.subtitle')}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={handleEmailChange}
          placeholder={t('signup.email.placeholder')}
          placeholderTextColor={colors.manatee}
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: colors.charcoal,
  },
  inputContainer: {
    marginBottom: 40,
  },
  label: {
    color: colors.auroMetalSaurus,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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

export default EmailInput;
