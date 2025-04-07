import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from 'react-native';

interface RegisterFormProps {
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!name) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!acceptTerms) {
      newErrors.terms = '이용약관에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({name, email, password, confirmPassword});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="이름을 입력하세요"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!isLoading}
        />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="이메일을 입력하세요"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!isLoading}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={[styles.input, errors.password ? styles.inputError : null]}
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password-new"
          editable={!isLoading}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={[
            styles.input,
            errors.confirmPassword ? styles.inputError : null,
          ]}
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}
      </View>

      <View style={styles.termsContainer}>
        <Switch
          value={acceptTerms}
          onValueChange={setAcceptTerms}
          disabled={isLoading}
          trackColor={{false: '#DDD', true: '#4A90E2'}}
        />
        <Text style={styles.termsText}>
          이용약관 및 개인정보처리방침에 동의합니다
        </Text>
      </View>
      {errors.terms ? (
        <Text style={styles.errorText}>{errors.terms}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.submitButton,
          isLoading ? styles.submitButtonDisabled : null,
        ]}
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitButtonText}>회원가입</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterForm;
