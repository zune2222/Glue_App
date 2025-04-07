import React, {ReactNode} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryProvider} from './query';
import {ThemeProvider, useTheme} from './theme';
import {NavigationContainer} from '@react-navigation/native';
import {I18nextProvider} from 'react-i18next';
import i18n from '@/shared/lib/i18n';

// 앱 프로바이더 타입
interface AppProviderProps {
  children: ReactNode;
}

// 테마에 맞는 상태바 설정 컴포넌트
const ThemedStatusBar = () => {
  const {theme} = useTheme();
  return (
    <StatusBar
      barStyle={theme.colors.statusBarStyle}
      backgroundColor={theme.colors.background}
    />
  );
};

// 앱 콘텐츠 래퍼 컴포넌트
const AppContent = ({children}: {children: ReactNode}) => {
  const {theme} = useTheme();

  return (
    <SafeAreaProvider style={{backgroundColor: theme.colors.background}}>
      <ThemedStatusBar />
      {children}
    </SafeAreaProvider>
  );
};

/**
 * 앱 전체 프로바이더 컴포넌트
 * 모든 글로벌 프로바이더를 통합하여 제공합니다.
 */
export const AppProvider = ({children}: AppProviderProps) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
            <AppContent>{children}</AppContent>
          </NavigationContainer>
        </I18nextProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
