import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {theme} from '../../../../app/styles/theme';
import {colors} from '../../../../app/styles/colors';
import {typography} from '../../../../app/styles/typography';

export const TitleSection = () => {
  const {t} = useTranslation();

  return (
    <>
      <Text style={styles.title}>{t('auth.welcome.title')}</Text>
      <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: colors.ghostWhite,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle1,
    color: colors.ghostWhite,
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
    opacity: 0.9,
  },
});
