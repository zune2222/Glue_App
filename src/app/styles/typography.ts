import {TextStyle} from 'react-native';

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const fontFamily = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
};

const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 36,
  xxxl: 40,
};

export const createTextStyle = (
  size: keyof typeof fontSize,
  weight: FontWeight = 'regular',
): TextStyle => ({
  fontFamily: fontFamily[weight],
  fontSize: fontSize[size],
  lineHeight: lineHeight[size],
});

export const typography = {
  h1: createTextStyle('xxxl', 'bold'),
  h2: createTextStyle('xxl', 'bold'),
  h3: createTextStyle('xl', 'bold'),
  h4: createTextStyle('lg', 'semibold'),
  subtitle1: createTextStyle('lg', 'medium'),
  subtitle2: createTextStyle('md', 'medium'),
  body1: createTextStyle('md', 'regular'),
  body2: createTextStyle('sm', 'regular'),
  button: createTextStyle('md', 'semibold'),
  caption: createTextStyle('xs', 'regular'),
};
