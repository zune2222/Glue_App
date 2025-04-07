import {config} from '@/shared/config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * 로깅 시스템
 * 개발 환경에서는 모든 로그를 출력하고, 프로덕션 환경에서는 에러만 출력합니다.
 */
class Logger {
  private enableLogging: boolean = config.ENABLE_LOGGING;

  log(level: LogLevel, message: string, data?: any) {
    if (!this.enableLogging && level !== 'error') return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'info':
        console.info(logMessage, data ? data : '');
        break;
      case 'warn':
        console.warn(logMessage, data ? data : '');
        break;
      case 'error':
        console.error(logMessage, data ? data : '');
        // 프로덕션 환경에서는 에러 로깅 서비스로 전송할 수 있음
        // this.sendToErrorService(message, data);
        break;
      case 'debug':
        if (__DEV__) {
          console.debug(logMessage, data ? data : '');
        }
        break;
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  // API 로깅 헬퍼
  logRequest(method: string, url: string, data?: any) {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  logResponse(method: string, url: string, status: number, data?: any) {
    this.debug(`API Response: ${method} ${url} [${status}]`, data);
  }

  logError(method: string, url: string, status: number, error: any) {
    this.error(`API Error: ${method} ${url} [${status}]`, error);
  }
}

export const logger = new Logger();
