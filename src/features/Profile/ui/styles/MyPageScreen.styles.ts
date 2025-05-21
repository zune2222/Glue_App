// src/features/Profile/ui/styles/MyPageScreen.styles.ts
import { StyleSheet } from 'react-native';
import { semanticColors, typography, spacing } from '@app/styles';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticColors.background },
  content: { padding: spacing.md },
  section: { marginBottom: spacing.ls },
  sectionTitle: {
    ...typography.h4,
    color: semanticColors.text,
    marginTop: spacing.ls,
    marginBottom: spacing.sm,
  },
  languageContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  infoList: { marginTop: spacing.md },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: semanticColors.surface,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  infoContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  nickname: {
    ...typography.h3,
    color: semanticColors.text,
  },
  bio: {
    ...typography.body2,
    color: semanticColors.textSecondary,
    marginTop: spacing.xs,
  },
});