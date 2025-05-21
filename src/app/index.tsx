import React, {useEffect, useState} from 'react';
import {AppProvider} from './providers';
import {AppNavigator} from './providers/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import * as RootNavigation from './navigation/RootNavigation';
import {useTheme} from './providers/theme';
import {AppToast} from '@/shared/ui/Toast';
import {fcmService} from '@/shared/lib/firebase';
import {logger} from '@/shared/lib/logger';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {theme} = useTheme();

  useEffect(() => {
    // 앱 초기화 로직
    const initializeApp = async () => {
      try {
        // FCM 초기화 및 권한 요청
        await fcmService.requestPermission();

        // iOS의 경우 디바이스 등록 (Android는 내부적으로 무시됨)
        await fcmService.registerDevice();

        // FCM 토큰 가져오기 (백그라운드에서 진행하여 앱 로딩 속도에 영향 없도록)
        fcmService
          .getToken()
          .then(token => {
            if (token) {
              logger.info('FCM 토큰 초기화 완료');
            } else {
              logger.warn('FCM 토큰을 얻지 못했습니다');
            }
          })
          .catch(error => {
            logger.error('FCM 토큰 초기화 오류:', error);
          });

        // 인증 상태 확인
        const authToken = await AsyncStorage.getItem('auth_token');
        setIsLoggedIn(!!authToken);
      } catch (error) {
        logger.error('앱 초기화 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // FCM 토큰 갱신 리스너 설정
    const unsubscribe = fcmService.registerTokenRefreshListener(newToken => {
      logger.info('FCM 토큰이 갱신되었습니다:', newToken);
      // 여기서 필요한 경우 서버에 새 토큰을 전송할 수 있습니다
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 인증 상태에 따른 초기 네비게이션 설정
    if (!isLoading) {
      if (isLoggedIn) {
        // 로그인 상태인 경우 메인 화면으로 이동
        RootNavigation.navigateToMain();
      }
      // 로그인되지 않은 상태는 기본적으로 Auth 스택으로 이동 (AppNavigator의 초기 경로)
    }
  }, [isLoading, isLoggedIn]);

  return (
    <>
      <AppProvider>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1CBFDC" />
          </View>
        ) : (
          <AppNavigator />
        )}
      </AppProvider>
      <AppToast theme={theme} />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default App;
