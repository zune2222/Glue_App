// src/features/Profile/ui/components/LikedGroupCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LikedGroupItem } from '../../model/types';
import { styles } from '../styles/LikedGroups.styles';

interface Props { item: LikedGroupItem; }
export const LikedGroupCard = ({ item }: Props) => (
  <TouchableOpacity style={styles.likedCard}>
    <Text style={styles.likedTitle}>{item.title}</Text>
    <Text style={styles.likedMeta}>{item.place} • {item.participants}명</Text>
  </TouchableOpacity>
);