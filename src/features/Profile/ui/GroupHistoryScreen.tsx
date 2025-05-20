// src/features/Profile/ui/GroupHistoryScreen.tsx
import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { GroupHistoryCard } from './components/GroupHistoryCard';
import { useGroupHistory } from '../model/useProfile';
import { styles } from './styles/GroupHistory.styles';

export const GroupHistoryScreen = () => {
  const { history } = useGroupHistory();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <GroupHistoryCard item={item} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};