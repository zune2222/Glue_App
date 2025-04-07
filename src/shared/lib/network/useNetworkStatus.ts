import {useState, useEffect, useCallback} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {logger} from '@/shared/lib/logger';

interface NetworkStatusHook {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  connectionType: string | null;
  refreshNetworkStatus: () => Promise<NetInfoState>;
}

/**
 * 네트워크 연결 상태를 감지하는 훅
 * 오프라인/온라인 상태 변화를 추적하여 UI에 반영할 수 있습니다.
 */
export const useNetworkStatus = (): NetworkStatusHook => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  // 현재 네트워크 상태 새로고침
  const refreshNetworkStatus = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      setConnectionType(state.type);
      return state;
    } catch (error) {
      logger.error('네트워크 상태 확인 중 오류 발생', error);
      return {} as NetInfoState;
    }
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 네트워크 상태 확인
    refreshNetworkStatus();

    // 네트워크 상태 변경 구독
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      setConnectionType(state.type);

      // 연결 상태 변경 로깅
      if (state.isConnected) {
        logger.info('네트워크 연결됨', {
          type: state.type,
          isInternetReachable: state.isInternetReachable,
        });
      } else {
        logger.warn('네트워크 연결 끊김');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [refreshNetworkStatus]);

  return {
    isConnected,
    isInternetReachable,
    connectionType,
    refreshNetworkStatus,
  };
};
