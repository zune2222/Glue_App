/**
 * API 에러 클래스
 * 서버 에러 응답을 일관된 형식으로 표현합니다.
 */
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    status: number = 500,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/**
 * 네트워크 에러 클래스
 * 네트워크 연결 실패 등의 에러를 표현합니다.
 */
export class NetworkError extends Error {
  constructor(message: string = '네트워크 연결을 확인해주세요.') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * 인증 에러 클래스
 * 인증 관련 에러를 표현합니다.
 */
export class AuthError extends Error {
  code: string;

  constructor(message: string, code: string = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

// 에러 코드 정의
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

// 에러 코드에 따른 사용자 친화적 메시지
export const getErrorMessage = (error: Error): string => {
  if (error instanceof ApiError) {
    switch (error.code) {
      case ErrorCode.AUTH_REQUIRED:
        return '로그인이 필요합니다.';
      case ErrorCode.AUTH_EXPIRED:
        return '로그인 세션이 만료되었습니다. 다시 로그인해주세요.';
      case ErrorCode.NOT_FOUND:
        return '요청하신 정보를 찾을 수 없습니다.';
      case ErrorCode.VALIDATION_ERROR:
        return '입력하신 정보가 올바르지 않습니다.';
      case ErrorCode.PERMISSION_DENIED:
        return '접근 권한이 없습니다.';
      case ErrorCode.SERVER_ERROR:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      default:
        return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  } else if (error instanceof NetworkError) {
    return '네트워크 연결을 확인해주세요.';
  } else if (error instanceof AuthError) {
    switch (error.code) {
      case 'INVALID_CREDENTIALS':
        return '아이디 또는 비밀번호가 올바르지 않습니다.';
      case 'ACCOUNT_DISABLED':
        return '비활성화된 계정입니다. 고객센터에 문의해주세요.';
      default:
        return '인증 과정에서 오류가 발생했습니다.';
    }
  }

  return '알 수 없는 오류가 발생했습니다.';
};
