import {useApiMutation} from '@/shared/lib/api/hooks';
import {
  sendVerificationCode,
  verifyCode,
  signupWithKakao,
  signinWithKakao,
  NotRegisteredError,
} from './api';

// 모든 API 함수 내보내기
export * from './api';

// 모든 Hook 내보내기
export * from './hooks';

// 이메일 인증 코드 전송 훅
export const useSendVerificationCode = () => {
  return useApiMutation('sendVerificationCode', sendVerificationCode);
};

// 이메일 인증 코드 검증 훅
export const useVerifyCode = () => {
  return useApiMutation(
    'verifyCode',
    (variables: {email: string; code: string}) =>
      verifyCode(variables.email, variables.code),
  );
};

// 카카오 회원가입 훅
export const useKakaoSignup = () => {
  return useApiMutation('kakaoSignup', signupWithKakao);
};

// 카카오 로그인 훅
export const useKakaoSignin = () => {
  return useApiMutation(
    'kakaoSignin',
    (variables: {kakaoToken: string; fcmToken?: string}) =>
      signinWithKakao(variables.kakaoToken, variables.fcmToken),
  );
};
