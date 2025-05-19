// src/features/Profile/ui/components/ProfileCard.tsx
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@shared/ui/typography/Text';
import { UserProfile } from '../../model/types';
import { styles } from '../styles/MyPageScreen.styles';

interface ProfileCardProps { profile: UserProfile | undefined; }
export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => navigation.navigate('ProfileDetail')}
    >
      <Image source={{ uri: profile?.avatarUrl }} style={styles.avatar} />
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{profile?.nickname}</Text>
        <Text style={styles.bio}>{profile?.bio}</Text>
      </View>
    </TouchableOpacity>
  );
};