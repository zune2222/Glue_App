import React from 'react';
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from 'react-native-toast-message';
import {useTheme} from '@/app/providers/theme';

/**
 * 커스텀 토스트 구성 생성 함수
 */
export const createToastConfig = (): ToastConfig => {
  const {theme} = useTheme();

  // 기본 스타일 설정
  const baseStyle = {
    borderLeftWidth: 4,
    height: 'auto',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    minHeight: 60,
    borderRadius: 8,
  };

  // 기본 텍스트 스타일
  const baseText1Style = {
    fontSize: 16,
    fontWeight: '600',
  };

  const baseText2Style = {
    fontSize: 14,
  };

  return {
    success: props => (
      <BaseToast
        {...props}
        style={{
          ...baseStyle,
          backgroundColor: theme.colors.background,
          borderLeftColor: theme.colors.success,
        }}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{...baseText1Style, color: theme.colors.text}}
        text2Style={{...baseText2Style, color: theme.colors.textSecondary}}
      />
    ),
    error: props => (
      <ErrorToast
        {...props}
        style={{
          ...baseStyle,
          backgroundColor: theme.colors.background,
          borderLeftColor: theme.colors.error,
        }}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{...baseText1Style, color: theme.colors.text}}
        text2Style={{...baseText2Style, color: theme.colors.textSecondary}}
      />
    ),
    info: props => (
      <BaseToast
        {...props}
        style={{
          ...baseStyle,
          backgroundColor: theme.colors.background,
          borderLeftColor: theme.colors.info,
        }}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{...baseText1Style, color: theme.colors.text}}
        text2Style={{...baseText2Style, color: theme.colors.textSecondary}}
      />
    ),
    warning: props => (
      <BaseToast
        {...props}
        style={{
          ...baseStyle,
          backgroundColor: theme.colors.background,
          borderLeftColor: theme.colors.warning,
        }}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{...baseText1Style, color: theme.colors.text}}
        text2Style={{...baseText2Style, color: theme.colors.textSecondary}}
      />
    ),
  };
};

/**
 * 앱 전체에서 사용하는 토스트 컴포넌트
 */
export const AppToast: React.FC = () => {
  const toastConfig = createToastConfig();
  return <Toast config={toastConfig} />;
};
