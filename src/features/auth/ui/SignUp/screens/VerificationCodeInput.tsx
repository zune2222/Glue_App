import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';

type VerificationCodeInputProps = {
  onVerificationComplete: (code: string) => void;
};

const VerificationCodeInput = ({
  onVerificationComplete,
}: VerificationCodeInputProps) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const {t} = useTranslation();

  // 인증 코드 입력을 위한 ref 생성
  const hiddenInputRef = useRef<TextInput>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
    const newCode = [...code];

    // 입력된 문자열을 배열에 개별 숫자로 저장
    for (let i = 0; i < numericText.length && i < 6; i++) {
      newCode[i] = numericText[i];
    }

    // 배열에 저장된 값으로 코드 상태 업데이트
    setCode(newCode);

    // 입력이 완료되었을 때 onVerificationComplete 호출
    if (numericText.length === 6) {
      onVerificationComplete(numericText);
    }

    // 다음 입력 칸으로 포커스 이동 또는 포커스 해제
    if (numericText.length < 6 && numericText.length > 0) {
      setFocusedIndex(numericText.length - 1);
    } else {
      setFocusedIndex(null);
    }
  };

  // 인증번호 재전송 처리
  const handleResendCode = () => {
    if (!isCounting) {
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
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('signup.verification.title')}</Text>
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
            <Text style={styles.codeText}>{code[index]}</Text>
          </Pressable>
        ))}
      </View>

      {/* 인증번호 재전송 */}
      <TouchableOpacity onPress={handleResendCode} disabled={isCounting}>
        <Text style={styles.resendText}>
          {t('signup.verification.didNotReceive')}
          <Text style={styles.resendLink}>
            {' '}
            {t('signup.verification.resend')}
            {isCounting ? `(${resendCountdown}s)` : ''}
          </Text>
        </Text>
      </TouchableOpacity>
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
    fontWeight: 'bold',
    color: colors.richBlack,
  },
  resendText: {
    fontSize: 12,
    color: colors.richBlack,
    marginLeft: 5,
  },
  resendLink: {
    color: colors.batteryChargedBlue,
    fontSize: 12,
  },
});

export default VerificationCodeInput;
