// src/app/styles/index.ts

export * from './colors';           // semanticColors, colors
export * from './typography';       // typography

// theme.ts에서 정의된 lightTheme, darkTheme, spacing, borderRadius, shadow까지 한 번에
import { lightTheme, darkTheme, theme } from './theme';
export { lightTheme, darkTheme, theme };
export const spacing = theme.spacing;
export const borderRadius = theme.borderRadius;
export const shadow = theme.shadow;