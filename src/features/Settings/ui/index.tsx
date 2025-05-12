import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeArea} from '../../../shared/ui';
import {Text} from '../../../shared/ui/typography/Text';

const SettingsScreen = () => {
  return (
    <SafeArea>
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.sectionItem}>
            <Text variant="body1" weight="medium" style={styles.itemTitle}>
              언어 설정
            </Text>
            <Text variant="body2" color="#757575" style={styles.itemValue}>
              한국어
            </Text>
          </View>
          <View style={styles.sectionItem}>
            <Text variant="body1" weight="medium" style={styles.itemTitle}>
              알림 설정
            </Text>
            <Text variant="body2" color="#757575" style={styles.itemValue}>
              켜짐
            </Text>
          </View>
          <View style={styles.sectionItem}>
            <Text variant="body1" weight="medium" style={styles.itemTitle}>
              다크 모드
            </Text>
            <Text variant="body2" color="#757575" style={styles.itemValue}>
              시스템 설정
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionItem}>
            <Text variant="body1" weight="medium" style={styles.itemTitle}>
              계정 정보
            </Text>
          </View>
          <View style={styles.sectionItem}>
            <Text variant="body1" weight="medium" style={styles.itemTitle}>
              개인정보 처리방침
            </Text>
          </View>
          <View style={styles.sectionItem}>
            <Text variant="body1" weight="medium" style={styles.itemTitle}>
              서비스 이용약관
            </Text>
          </View>
          <View style={styles.sectionItem}>
            <Text
              variant="body1"
              weight="medium"
              color="#FF3B30"
              style={styles.logoutText}>
              로그아웃
            </Text>
          </View>
        </View>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
  },
  itemValue: {
    marginLeft: 'auto',
  },
  logoutText: {
    fontSize: 16,
  },
});

export default SettingsScreen;
