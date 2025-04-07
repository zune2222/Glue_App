import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {useTheme} from '@/app/providers/theme';
import {Body2} from './typography';

interface ThemeToggleProps {
  style?: any;
}

export const ThemeToggle = ({style}: ThemeToggleProps) => {
  const {themeMode, setThemeMode, isDarkMode} = useTheme();

  const toggleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  // 현재 테마 모드 텍스트 가져오기
  const getModeText = () => {
    switch (themeMode) {
      case 'light':
        return '라이트 모드';
      case 'dark':
        return '다크 모드';
      case 'system':
        return '시스템 설정';
      default:
        return '';
    }
  };

  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: theme.colors.surface}, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View
          style={[
            styles.indicator,
            {
              backgroundColor: isDarkMode
                ? theme.colors.primary
                : theme.colors.secondary,
            },
          ]}
        />
        <Body2>{getModeText()}</Body2>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
});
