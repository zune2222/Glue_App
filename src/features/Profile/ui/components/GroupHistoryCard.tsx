// src/features/Profile/ui/components/GroupHistoryCard.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@shared/ui/typography/Text';
import { GroupHistoryItem } from '../../model/types';
import { styles } from '../styles/GroupHistory.styles';

interface Props { item: GroupHistoryItem; }
export const GroupHistoryCard = ({ item }: Props) => (
  <TouchableOpacity style={styles.historyCard}>
    <Text style={styles.historyTitle}>{item.title}</Text>
    <Text style={styles.historyMeta}>{item.place} • {item.participants}명</Text>
    {item.isHost && <Text style={styles.historyHost}>Host</Text>}
  </TouchableOpacity>
);