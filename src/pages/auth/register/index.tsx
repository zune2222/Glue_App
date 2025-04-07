import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RegisterForm} from '@/features/auth/register-form';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setLoading(true);
      // 실제로는 API 호출 및 회원가입 처리
      console.log('회원가입 요청', values);

      // 성공 시 로그인 페이지로 이동
      setLoading(false);
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false);
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>회원가입</Text>

            <RegisterForm onSubmit={handleRegister} isLoading={loading} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>로그인</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Welcome')}
              style={styles.backButton}>
              <Text style={styles.backButtonText}>돌아가기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    marginLeft: 5,
    padding: 5,
  },
  loginButtonText: {
    color: '#4A90E2',
    fontWeight: '600',
    fontSize: 14,
  },
  backButton: {
    marginTop: 30,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
  },
});

export default RegisterScreen;
