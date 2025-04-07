import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';
import {useTheme} from '@/app/providers/theme';
import {TextProps} from './types';

export const Text = ({
  variant = 'body1',
  color,
  align = 'auto',
  weight,
  style,
  children,
  ...props
}: TextProps) => {
  const {colors, typography} = useTheme();

  // 기본 스타일 가져오기
  const baseStyle = typography[variant];

  // 가중치 재정의 (제공된 경우)
  const fontFamily = weight
    ? `Pretendard-${weight.charAt(0).toUpperCase() + weight.slice(1)}`
    : baseStyle.fontFamily;

  const textStyle = StyleSheet.compose(
    {
      ...baseStyle,
      color: color || colors.text,
      textAlign: align,
      fontFamily,
    },
    style,
  );

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};
