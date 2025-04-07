import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';
import {useTheme} from '@/app/providers/theme';
import {TextProps} from './types';

// 폰트 굵기 매핑 함수 (kebab-case 대신 PascalCase 사용)
const getFontFamily = (weight: string): string => {
  if (!weight) return 'Pretendard-Regular';

  // 첫 글자만 대문자로 변환 (예: 'semiBold' → 'SemiBold')
  const capitalizedWeight = weight.charAt(0).toUpperCase() + weight.slice(1);
  return `Pretendard-${capitalizedWeight}`;
};

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
  // weight 속성이 제공되면 해당 가중치 사용, 아니면 기본 variant 스타일의 fontFamily 사용
  const fontFamily = weight ? getFontFamily(weight) : baseStyle.fontFamily;

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
