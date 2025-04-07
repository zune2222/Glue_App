import {logger} from '@/shared/lib/logger';
import {Platform} from 'react-native';

/**
 * 성능 측정을 위한 유틸리티 클래스
 * 중요한 작업의 실행 시간을 측정하고 로깅합니다.
 */
class PerformanceMonitor {
  private marks: Record<string, number> = {};
  private isProduction = !__DEV__;

  /**
   * 성능 측정 시작
   * @param name 측정 이름
   */
  startMeasure(name: string) {
    this.marks[name] = performance.now();
  }

  /**
   * 성능 측정 종료 및 결과 반환
   * @param name 측정 이름
   * @returns 소요 시간 (밀리초)
   */
  endMeasure(name: string): number | null {
    if (!this.marks[name]) {
      logger.warn(`측정되지 않은 성능 마크: ${name}`);
      return null;
    }

    const duration = performance.now() - this.marks[name];
    delete this.marks[name];

    // 개발 환경에서만 기본 로깅
    if (!this.isProduction) {
      logger.debug(`성능 측정: ${name} (${duration.toFixed(2)}ms)`);
    }

    // 성능이 좋지 않은 경우 (1초 이상) 경고 로그
    if (duration > 1000) {
      logger.warn(`성능 이슈 감지: ${name} (${duration.toFixed(2)}ms)`);
    }

    return duration;
  }

  /**
   * 네트워크 요청 성능 측정
   * @param method HTTP 메서드
   * @param url 요청 URL
   * @param startTime 시작 시간
   * @returns 소요 시간 (밀리초)
   */
  measureNetworkRequest(
    method: string,
    url: string,
    startTime: number,
  ): number {
    const duration = performance.now() - startTime;

    if (!this.isProduction) {
      logger.debug(
        `네트워크 성능: ${method} ${url} (${duration.toFixed(2)}ms)`,
      );
    }

    // 네트워크 요청이 느린 경우 (3초 이상) 경고 로그
    if (duration > 3000) {
      logger.warn(
        `느린 네트워크 요청: ${method} ${url} (${duration.toFixed(2)}ms)`,
      );
    }

    return duration;
  }

  /**
   * 렌더링 성능 측정
   * @param componentName 컴포넌트 이름
   * @param renderTime 렌더링 시간
   */
  measureRender(componentName: string, renderTime: number) {
    // 렌더링이 오래 걸리는 경우 (16ms = 60fps 기준) 경고 로그
    if (renderTime > 16) {
      logger.warn(`느린 렌더링: ${componentName} (${renderTime.toFixed(2)}ms)`);
    }
  }

  /**
   * 메모리 사용량 보고 (Android 전용)
   */
  reportMemoryUsage() {
    if (Platform.OS !== 'android') return;

    if (global.gc) {
      global.gc();
      logger.debug('메모리 가비지 컬렉션 실행');
    }

    // 참고: 실제 앱에서는 React Native의 메모리 사용량 측정 라이브러리 사용 권장
  }
}

export const perfMonitor = new PerformanceMonitor();
