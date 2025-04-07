import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/app/providers/theme';
import {H3} from '@/shared/ui/typography';
import {ThemeToggle} from '@/shared/ui/ThemeToggle';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showThemeToggle?: boolean;
  rightComponent?: React.ReactNode;
}

export const Header = ({
  title,
  showBackButton = false,
  showThemeToggle = true,
  rightComponent,
}: HeaderProps) => {
  const navigation = useNavigation();
  const {theme} = useTheme();

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          ...theme.shadow.light,
        },
      ]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            {/* 백 버튼 아이콘 - 아이콘 라이브러리를 사용하면 좋습니다 */}
            <View style={[styles.backIcon, {borderColor: theme.colors.text}]} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <H3 align="center">{title}</H3>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent}
        {showThemeToggle && <ThemeToggle style={styles.themeToggle} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{rotate: '45deg'}],
  },
  themeToggle: {
    marginLeft: 8,
    padding: 4,
  },
});
