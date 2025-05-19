// src/features/Profile/ui/components/LanguageCard.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@shared/ui/typography/Text';

import { styles } from '../styles/LanguageCard.styles';

interface LanguageCardProps {
  title: string;
  language?: string;
  level?: string;
  onEdit: () => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ title, language, level, onEdit }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.edit}>수정</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.body}>
      <Text style={styles.label}>언어</Text>
      <Text style={styles.value}>{language}</Text>
    </View>
    <View style={styles.body}>
      <Text style={styles.label}>수준</Text>
      <Text style={styles.value}>{level}</Text>
    </View>
  </View>
);