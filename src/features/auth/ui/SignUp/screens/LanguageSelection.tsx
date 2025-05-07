import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';

type LanguageSelectionProps = {
  onLanguageSelect: (language: string) => void;
  initialLanguage?: string | null;
};

const LanguageSelection = ({
  onLanguageSelect,
  initialLanguage = 'korean',
}: LanguageSelectionProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    initialLanguage,
  );

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    onLanguageSelect(language);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>시스템 언어를 설정해주세요</Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* 한국어 선택 버튼 */}
        <TouchableOpacity
          onPress={() => handleLanguageSelect('korean')}
          style={[
            styles.languageButton,
            {
              backgroundColor:
                selectedLanguage === 'korean'
                  ? colors.batteryChargedBlue
                  : '#FFFFFF',
              borderColor:
                selectedLanguage === 'korean'
                  ? colors.batteryChargedBlue
                  : colors.lightSilver,
            },
          ]}>
          <Text
            style={[
              styles.languageText,
              {
                color:
                  selectedLanguage === 'korean' ? '#FFFFFF' : colors.manatee,
              },
            ]}>
            한국어
          </Text>
        </TouchableOpacity>

        {/* 영어 선택 버튼 */}
        <TouchableOpacity
          onPress={() => handleLanguageSelect('english')}
          style={[
            styles.languageButton,
            {
              backgroundColor:
                selectedLanguage === 'english'
                  ? colors.batteryChargedBlue
                  : '#FFFFFF',
              borderColor:
                selectedLanguage === 'english'
                  ? colors.batteryChargedBlue
                  : colors.lightSilver,
            },
          ]}>
          <Text
            style={[
              styles.languageText,
              {
                color:
                  selectedLanguage === 'english' ? '#FFFFFF' : colors.manatee,
              },
            ]}>
            영어
          </Text>
        </TouchableOpacity>
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
    marginBottom: 40,
  },
  languageButton: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  languageText: {
    ...typography.h3,
  },
});

export default LanguageSelection;
