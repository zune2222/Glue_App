import React, {useEffect, useState} from 'react';
import {AppProvider} from './providers';
import {AppNavigator} from './providers/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import * as RootNavigation from './navigation/RootNavigation';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 인증 상태 확인
    const checkAuthState = async () => {
      try {
        const authToken = await AsyncStorage.getItem('auth_token');
        setIsLoggedIn(!!authToken);
      } catch (error) {
        console.error('인증 상태 확인 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
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
    <AppProvider>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1CBFDC" />
        </View>
      ) : (
        <AppNavigator />
      )}
    </AppProvider>
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
