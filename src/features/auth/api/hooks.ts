import {useMutation} from '@tanstack/react-query';
import {sendVerificationCode, verifyCode} from './api';
import axios from 'axios';

// 이메일 인증 코드 전송 React Query hook
export const useSendVerificationCode = () => {
  return useMutation({
    mutationFn: (email: string) => sendVerificationCode(email),
    onError: error => {
      console.error('[인증 코드 전송 에러]:', error);

      // Axios 에러인 경우 추가 정보 로깅
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 서버에서 응답을 받은 경우
          console.error('응답 상태:', error.response.status);
          console.error('응답 데이터:', error.response.data);
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          console.error('응답 없음 (네트워크 오류):', error.request);
        } else {
          // 요청 설정 중 오류 발생
          console.error('요청 설정 오류:', error.message);
        }
        console.error('요청 설정:', error.config);
      } else {
        // 일반 에러의 경우
        console.error('에러 메시지:', error.message);
      }
    },
  });
};

// 이메일 인증 코드 검증 React Query hook
export const useVerifyCode = () => {
  return useMutation({
    mutationFn: ({email, code}: {email: string; code: string}) =>
      verifyCode(email, code),
    onError: error => {
      console.error('[인증 코드 검증 에러]:', error);

      // Axios 에러인 경우 추가 정보 로깅
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 서버에서 응답을 받은 경우
          console.error('응답 상태:', error.response.status);
          console.error('응답 데이터:', error.response.data);
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          console.error('응답 없음 (네트워크 오류):', error.request);
        } else {
          // 요청 설정 중 오류 발생
          console.error('요청 설정 오류:', error.message);
        }
        console.error('요청 설정:', error.config);
      } else {
        // 일반 에러의 경우
        console.error('에러 메시지:', error.message);
      }
    },
  });
};
