// src/features/Profile/ui/styles/LanguageCard.styles.ts
import { StyleSheet } from 'react-native';
import { semanticColors, typography, spacing } from '@app/styles';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: semanticColors.surface,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: { ...typography.subtitle2, color: semanticColors.text },
  edit: { ...typography.button, color: semanticColors.primary },
  body: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  label: { ...typography.body2, color: semanticColors.textSecondary },
  value: { ...typography.body1, color: semanticColors.text },
});