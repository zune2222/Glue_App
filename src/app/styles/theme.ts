import {colors, semanticColors} from './colors';
import {typography} from './typography';

// 공통 테마 설정
const baseTheme = {
  typography,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
};

// 라이트 테마
export const lightTheme = {
  ...baseTheme,
  colors: {
    ...semanticColors,
    background: colors.ghostWhite,
    surface: colors.antiFlashWhite,
    text: colors.richBlack,
    textSecondary: colors.charcoal,
    border: colors.lightSilver,
    card: colors.antiFlashWhite,
    statusBarStyle: 'dark-content' as const,
  },
  shadow: {
    light: {
      shadowColor: colors.richBlack,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.richBlack,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    heavy: {
      shadowColor: colors.richBlack,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

// 다크 테마
export const darkTheme = {
  ...baseTheme,
  colors: {
    ...semanticColors,
    background: colors.richBlack,
    surface: colors.darkCharcoal,
    text: colors.ghostWhite,
    textSecondary: colors.lightSilver,
    border: colors.charcoal,
    card: colors.darkCharcoal,
    statusBarStyle: 'light-content' as const,
  },
  shadow: {
    light: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 4,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

// 기본 테마
export const theme = lightTheme;
