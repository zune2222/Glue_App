// src/features/Profile/ui/styles/MyInfoItem.styles.ts
import { StyleSheet } from 'react-native';
import { semanticColors, typography, spacing } from '@app/styles';

export const styles = StyleSheet.create({
  item: {
    height: 48,
    justifyContent: 'left',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    //backgroundColor: semanticColors.surface,
  },
  label: { ...typography.body1, color: semanticColors.text },
});