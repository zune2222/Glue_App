import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import {useColorScheme, Appearance} from 'react-native';
import {lightTheme, darkTheme} from '@/app/styles/theme';

// ThemeType 정의
type ThemeType = typeof lightTheme;
type ThemeModeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  themeMode: ThemeModeType;
  setThemeMode: (mode: ThemeModeType) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeMode: 'system',
  setThemeMode: () => {},
  isDarkMode: false,
});

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeModeType>('system');

  // 시스템 설정에 따라 다크모드 여부 결정
  const systemIsDark = colorScheme === 'dark';

  // 현재 테마 모드에 따른 다크모드 여부 계산
  const isDarkMode =
    themeMode === 'system' ? systemIsDark : themeMode === 'dark';

  // 현재 테마 결정
  const theme = isDarkMode ? darkTheme : lightTheme;

  // 시스템 테마 변경 감지
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme: _}) => {
      // 시스템 테마 변경시 자동으로 반영
      // 'system' 모드일 때는 컴포넌트가 리렌더링 되며 테마가 자동으로 적용됨
    });

    return () => {
      subscription.remove();
    };
  }, [themeMode]);

  const contextValue = {
    theme,
    themeMode,
    setThemeMode,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
