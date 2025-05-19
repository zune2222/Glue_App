// src/features/Profile/ui/ProfileMainScreen.tsx
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text } from '@shared/ui/typography/Text';

import { styles } from './styles/ProfileMainScreen.styles';

const ProfileMainScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.profileSection}>
      <Text>Main Profile Screen</Text>
    </View>
  </SafeAreaView>
);

export default ProfileMainScreen;