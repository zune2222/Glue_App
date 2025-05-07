import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';
import SelectionButton from '@shared/ui/SelectionButton';

type GenderSelectionProps = {
  selectedGender: string | null;
  onGenderSelect: (gender: string) => void;
};

const GenderSelection = ({
  selectedGender,
  onGenderSelect,
}: GenderSelectionProps) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('signup.gender.title')}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <SelectionButton
          label={t('signup.gender.male')}
          isSelected={selectedGender === 'male'}
          onPress={() => onGenderSelect('male')}
        />

        <SelectionButton
          label={t('signup.gender.female')}
          isSelected={selectedGender === 'female'}
          onPress={() => onGenderSelect('female')}
        />
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
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 30,
  },
});

export default GenderSelection;
