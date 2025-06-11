import {
  createNavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';

// 네비게이션 참조 생성
export const navigationRef = createNavigationContainerRef();

/**
 * 특정 화면으로 이동하는 함수
 * @param name 이동할 화면 이름
 * @param params 전달할 파라미터
 */
export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    // @ts-ignore - 타입 오류 무시
    navigationRef.navigate(name, params);
  } else {
    // 네비게이션이 준비되지 않은 경우 오류 로깅
    console.error('Navigation is not ready yet!');
  }
}

/**
 * 이전 화면으로 돌아가는 함수
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  } else {
    console.error('Cannot go back or navigation is not ready!');
  }
}

/**
 * 네비게이션 스택을 리셋하는 함수
 * @param routes 새로운 라우트 배열
 * @param index 활성화할 라우트 인덱스
 */
export function reset(
  routes: {name: string; params?: object}[],
  index: number = 0,
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  } else {
    console.error('Navigation is not ready yet!');
  }
}

/**
 * 메인 화면으로 이동하는 특수 함수
 * 복잡한 중첩 네비게이션 구조를 처리합니다.
 */
export function navigateToMain() {
  if (navigationRef.isReady()) {
    // 루트 네비게이션 상태를 리셋하고 메인으로 이동
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
          },
        ],
      }),
    );
  } else {
    console.error('Navigation is not ready yet!');
  }
}

/**
 * 특정 탭으로 이동하는 함수
 * @param tabName 이동할 탭 이름
 */
export function navigateToTab(tabName: string) {
  if (navigationRef.isReady()) {
    // 중첩된 네비게이션을 처리하여 탭으로 이동
    navigationRef.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'MainTabs',
          params: {
            screen: tabName,
          },
        },
      }),
    );
  } else {
    console.error('Navigation is not ready yet!');
  }
}

/**
 * 현재 네비게이션 상태를 가져오는 함수
 */
export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return null;
}

/**
 * 인증 화면(로그인)으로 이동하는 함수
 * 로그아웃 시 사용됩니다.
 */
export function navigateToAuth() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Auth',
          },
        ],
      }),
    );
  } else {
    console.error('Navigation is not ready yet!');
  }
}
