// src/widgets/header/ui/CustomHeader.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { semanticColors } from '@app/styles/colors';  // ← semanticColors 사용
import { BellIcon, SettingsIcon } from '@shared/assets/images';

interface CustomHeaderProps {
  title?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 좌측 빈 공간 (타이틀 자리) */}
        <View style={styles.placeholder} />
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationsPanel')}
            style={styles.iconButton}
          >
            <BellIcon width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.iconButton}
          >
            <SettingsIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    height: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  placeholder: {
    width: 24, // 좌측 타이틀 대신 빈 공간
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
});