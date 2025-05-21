// src/features/Profile/ui/components/MyInfoItem.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@shared/ui/typography/Text';

import { styles } from '../styles/MyInfoItem.styles';

interface MyInfoItemProps {
  label: string;
  onPress: () => void;
}

export const MyInfoItem: React.FC<MyInfoItemProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);