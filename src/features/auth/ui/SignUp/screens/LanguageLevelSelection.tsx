import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';
import {useTranslation} from 'react-i18next';
import LevelButton from '@shared/ui/LevelButton';

type LanguageLevelSelectionProps = {
  selectedLevel: string | null;
  onLevelSelect: (level: string) => void;
  nativeLanguage: string | null;
};

const LanguageLevelSelection = ({
  selectedLevel,
  onLevelSelect,
  nativeLanguage,
}: LanguageLevelSelectionProps) => {
  const {t} = useTranslation();

  // 수준 옵션 정의
  const levelOptions = [
    {
      id: 'beginner',
      name: t('signup.languageLevel.beginner'),
      imageUri:
        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/opsam5as_expires_30_days.png',
    },
    {
      id: 'elementary',
      name: t('signup.languageLevel.elementary'),
      imageUri:
        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/hkjuuf3o_expires_30_days.png',
    },
    {
      id: 'intermediate',
      name: t('signup.languageLevel.intermediate'),
      imageUri:
        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/e96z1kp8_expires_30_days.png',
    },
    {
      id: 'advanced',
      name: t('signup.languageLevel.advanced'),
      imageUri:
        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/vng2kfti_expires_30_days.png',
    },
    {
      id: 'proficient',
      name: t('signup.languageLevel.proficient'),
      imageUri:
        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/xkjb1jao_expires_30_days.png',
    },
  ];

  // 선택된 모국어의 이름을 가져오는 함수
  const getNativeLanguageName = () => {
    if (!nativeLanguage) return '';

    // 아래는 nativeLanguage 값에 따라 적절한 언어 이름을 반환
    // 예를 들어, 'korean'이면 '한국어'를 반환
    return t(`signup.nativeLanguage.${nativeLanguage}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {t('signup.languageLevel.title', {
            language: getNativeLanguageName(),
          })}
        </Text>
        <Text style={styles.subtitle}>
          {t('signup.languageLevel.subtitle')}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {levelOptions.map(level => (
          <LevelButton
            key={level.id}
            label={level.name}
            levelImageUri={level.imageUri}
            isSelected={selectedLevel === level.id}
            onPress={() => onLevelSelect(level.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 64,
  },
  title: {
    ...typography.h2,
    color: colors.richBlack,
    marginBottom: 10,
  },
  subtitle: {
    ...typography.body2,
    color: colors.charcoal,
  },
  optionsContainer: {
    marginBottom: 30,
  },
});

export default LanguageLevelSelection;
