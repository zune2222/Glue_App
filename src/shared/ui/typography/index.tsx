import {Text} from './Text';
import {TextProps} from './types';
import React from 'react';

// 기본 Text 컴포넌트 내보내기
export {Text};
export type {TextProps};

// 특화된 컴포넌트들 생성하기
export const H1 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="h1" {...props} />
);

export const H2 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="h2" {...props} />
);

export const H3 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="h3" {...props} />
);

export const H4 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="h4" {...props} />
);

export const Subtitle1 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="subtitle1" {...props} />
);

export const Subtitle2 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="subtitle2" {...props} />
);

export const Body1 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="body1" {...props} />
);

export const Body2 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="body2" {...props} />
);

export const Caption = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="caption" {...props} />
);

export const ButtonText = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="button" {...props} />
);
