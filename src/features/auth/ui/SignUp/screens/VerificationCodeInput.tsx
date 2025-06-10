import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import {Text} from '@shared/ui/typography';
import {useVerifyCode, useSendVerificationCode} from '../../../api';

type VerificationCodeInputProps = {
  onVerificationComplete: (code: string) => void;
  email?: string; // 이메일 추가
};

const VerificationCodeInput = ({
  onVerificationComplete,
  email = '',
}: VerificationCodeInputProps) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const {t} = useTranslation();

  // 인증 코드 입력을 위한 ref 생성
  const hiddenInputRef = useRef<TextInput>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // 인증 코드 검증 및 전송 mutation
  const verifyCode = useVerifyCode();
  const sendVerificationCode = useSendVerificationCode();

  // 컴포넌트 마운트 시 카운트다운 시작
  useEffect(() => {
    setIsCounting(true);
  }, []);

  // 인증번호 타이머 처리
  useEffect(() => {
    if (isCounting && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0) {
      setIsCounting(false);
    }
  }, [isCounting, resendCountdown]);

  // 인증번호 입력값 변경 처리
  const handleCodeChange = (text: string) => {
    // 숫자만 입력 가능하도록 필터링
    const numericText = text.replace(/[^0-9]/g, '');
    const newCode = Array(6).fill(''); // 빈 배열로 초기화

    // 입력된 문자열을 배열에 개별 숫자로 저장
    for (let i = 0; i < numericText.length && i < 6; i++) {
      newCode[i] = numericText[i];
    }

    // 배열에 저장된 값으로 코드 상태 업데이트
    setCode(newCode);

    // 입력이 완료되었을 때 인증 시도
    if (numericText.length === 6) {
      handleVerifyCode(numericText);
    }

    // 다음 입력 칸으로 포커스 이동 또는 포커스 해제
    if (numericText.length < 6 && numericText.length > 0) {
      setFocusedIndex(numericText.length - 1);
    } else {
      setFocusedIndex(null);
    }
  };

  // 인증 코드 검증 처리
  const handleVerifyCode = async (verificationCode: string) => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: t('signup.verification.emailRequired'),
        position: 'bottom',
      });
      return;
    }

    // 개발 모드에서 test@test.com이면 인증 건너뛰기
    if (__DEV__ && email === 'test@test.com' && verificationCode === '123456') {
      Toast.show({
        type: 'success',
        text1: '[DEV] 인증이 건너뛰어졌습니다',
        position: 'bottom',
      });
      onVerificationComplete(verificationCode);
      return;
    }

    try {
      const result = await verifyCode.mutateAsync({
        email,
        code: verificationCode,
      });
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: t('signup.verification.verificationSuccess'),
          position: 'bottom',
        });
        onVerificationComplete(verificationCode);
      } else {
        Toast.show({
          type: 'error',
          text1: t('signup.verification.verificationFailed'),
          position: 'bottom',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('signup.verification.verificationFailed'),
        position: 'bottom',
      });
    }
  };

  // 인증번호 재전송 처리
  const handleResendCode = async () => {
    if (!isCounting && email) {
      try {
        await sendVerificationCode.mutateAsync(email);

        // 인증번호 재전송 토스트 메시지 표시
        Toast.show({
          type: 'info',
          text1: t('signup.verification.resendSuccess'),
          position: 'bottom',
          visibilityTime: 3000,
        });

        // 카운트다운 재시작
        setResendCountdown(30);
        setIsCounting(true);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('signup.verification.resendFailed'),
          position: 'bottom',
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          variant="h2"
          weight="semiBold"
          color={colors.richBlack}
          style={styles.title}>
          {t('signup.verification.title')}
        </Text>
      </View>

      {/* 숨겨진 실제 입력 필드 */}
      <TextInput
        ref={hiddenInputRef}
        style={styles.hiddenInput}
        keyboardType="number-pad"
        maxLength={6}
        value={code.join('')}
        onChangeText={handleCodeChange}
        caretHidden={true}
      />

      {/* 표시용 인증 코드 입력 박스 */}
      <View style={styles.codeContainer}>
        {[0, 1, 2, 3, 4, 5].map(index => (
          <Pressable
            key={`code-${index}`}
            style={[
              styles.codeBox,
              code[index] ? styles.filledCodeBox : {},
              focusedIndex === index ? styles.focusedCodeBox : {},
            ]}
            onPress={() => hiddenInputRef.current?.focus()}>
            <Text
              variant="body1"
              weight="bold"
              color={colors.richBlack}
              style={styles.codeText}>
              {code[index]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 검증 상태 표시 */}
      {verifyCode.isPending && (
        <View style={styles.verifyingContainer}>
          <ActivityIndicator
            size="small"
            color={colors.batteryChargedBlue}
            style={styles.verifyingIndicator}
          />
          <Text variant="caption" color={colors.richBlack}>
            {t('signup.verification.verifying')}
          </Text>
        </View>
      )}

      {/* 인증번호 재전송 */}
      <TouchableOpacity
        onPress={handleResendCode}
        disabled={isCounting || sendVerificationCode.isPending}
        style={styles.resendContainer}>
        <Text
          variant="caption"
          color={colors.richBlack}
          style={styles.resendText}>
          {t('signup.verification.didNotReceive')}
          <Text
            variant="caption"
            color={isCounting ? colors.manatee : colors.batteryChargedBlue}
            style={styles.resendLink}>
            {' '}
            {t('signup.verification.resend')}
            {isCounting ? `(${resendCountdown}s)` : ''}
          </Text>
        </Text>
        {sendVerificationCode.isPending && (
          <ActivityIndicator
            size="small"
            color={colors.batteryChargedBlue}
            style={styles.resendIndicator}
          />
        )}
      </TouchableOpacity>

      {/* 개발 모드에서만 보이는 빠른 인증 버튼 */}
      {__DEV__ && email === 'test@test.com' && (
        <TouchableOpacity
          style={styles.devButton}
          onPress={() => handleCodeChange('123456')}>
          <Text variant="button" color={colors.batteryChargedBlue}>
            [DEV] 인증 코드 자동 입력 (123456)
          </Text>
        </TouchableOpacity>
      )}
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
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  codeBox: {
    width: 45,
    height: 58,
    backgroundColor: 'white',
    borderColor: colors.manatee,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCodeBox: {
    borderColor: colors.batteryChargedBlue,
  },
  focusedCodeBox: {
    borderColor: colors.batteryChargedBlue,
  },
  codeText: {
    fontSize: 20,
  },
  verifyingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  verifyingIndicator: {
    marginRight: 10,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    marginLeft: 5,
  },
  resendLink: {},
  resendIndicator: {
    marginLeft: 10,
  },
  devButton: {
    backgroundColor: colors.antiFlashWhite,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.batteryChargedBlue,
  },
});

export default VerificationCodeInput;
