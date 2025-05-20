// src/features/Profile/ui/ProfileEditScreen.tsx
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text } from '@shared/ui/typography/Text';

import { styles } from './styles/ProfileEdit.styles';

const ProfileEditScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.editSection}>
      <Text>Edit Profile Screen</Text>
    </View>
  </SafeAreaView>
);

export default ProfileEditScreen;