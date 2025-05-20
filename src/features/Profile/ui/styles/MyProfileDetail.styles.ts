// src/features/Profile/ui/styles/MyProfileDetail.styles.ts
import { StyleSheet } from 'react-native';
import { semanticColors, typography, spacing, borderRadius, shadow } from '@app/styles';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticColors.background, padding: spacing.md },
  infoSection: { marginBottom: spacing.lg },
  label: { ...typography.body2, color: semanticColors.textSecondary },
  value: { ...typography.body1, color: semanticColors.text },
  editButton: {
    backgroundColor: semanticColors.primary, padding: spacing.sm,
    borderRadius: spacing.xs, alignItems: 'center',
  },
  editText: { ...typography.button, color: semanticColors.surface },
});