// src/features/Profile/ui/MyProfileDetailScreen.tsx
import React from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Text } from '@shared/ui/typography/Text';

import { useProfile } from '../model/useProfile';
import { styles } from './styles/MyProfileDetail.styles';

export const MyProfileDetailScreen = ({ navigation }) => {
  const { profile } = useProfile();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={styles.label}>Nickname</Text>
        <Text style={styles.value}>{profile.nickname}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>
        <Text style={styles.label}>Bio</Text>
        <Text style={styles.value}>{profile.bio}</Text>
        <Text style={styles.label}>Language</Text>
        <Text style={styles.value}>{profile.language}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('ProfileEdit')}
      >
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};