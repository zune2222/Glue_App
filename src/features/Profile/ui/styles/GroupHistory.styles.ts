// src/features/Profile/ui/styles/GroupHistory.styles.ts
import { StyleSheet } from 'react-native';
import { semanticColors, typography, spacing, borderRadius, shadow } from '@app/styles';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticColors.background },
  list: { padding: spacing.md },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', margin: spacing.md },
  filterButton: { padding: spacing.sm, borderRadius: spacing.xs },
  filterActive: { backgroundColor: semanticColors.primary },
  filterText: { ...typography.body1, color: semanticColors.text },
  historyCard: {
    backgroundColor: semanticColors.surface, padding: spacing.md,
    borderRadius: spacing.sm, marginBottom: spacing.sm,
  },
  historyTitle: { ...typography.subtitle1, color: semanticColors.text },
  historyMeta: { ...typography.body2, color: semanticColors.textSecondary, marginTop: spacing.xs },
  historyHost: { ...typography.caption, color: semanticColors.secondary, marginTop: spacing.xs },
});