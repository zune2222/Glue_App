import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {useTranslation} from 'react-i18next';
import {Text} from '@shared/ui/typography/Text';

type EmailInputProps = {
  onEmailChange: (email: string) => void;
  initialEmail?: string;
  onValidityChange?: (isValid: boolean) => void;
};

const EmailInput = ({
  onEmailChange,
  initialEmail = '',
  onValidityChange,
}: EmailInputProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [isFocused, setIsFocused] = useState(false);
  const {t} = useTranslation();

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    onEmailChange(text);

    // 유효성 상태를 상위 컴포넌트에 전달
    if (onValidityChange) {
      onValidityChange(isValidEmail(text));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="h2" color={colors.richBlack} style={styles.title}>
          {t('signup.email.title')}
        </Text>
        <Text variant="body2" color={colors.charcoal} style={styles.subtitle}>
          {t('signup.email.subtitle')}
        </Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
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
    marginBottom: 20,
  },
  notice: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default EmailInput;
