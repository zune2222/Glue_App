// src/features/Profile/ui/LikedGroupsScreen.tsx
import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { LikedGroupCard } from './components/LikedGroupCard';
import { useLikedGroups } from '../model/useProfile';
import { styles } from './styles/LikedGroups.styles';

export const LikedGroupsScreen = () => {
  const { liked } = useLikedGroups();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={liked}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <LikedGroupCard item={item} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};