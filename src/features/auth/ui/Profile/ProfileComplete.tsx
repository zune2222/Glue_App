import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Button, Text, SafeArea} from '@shared/ui';
import {ProfileStackParamList} from './index';
import * as RootNavigation from '@app/navigation/RootNavigation';

type ProfileCompleteRouteProps = RouteProp<
  ProfileStackParamList,
  'ProfileComplete'
>;

const ProfileCompleteScreen = () => {
  const route = useRoute<ProfileCompleteRouteProps>();
  const {name, nickname, gender} = route.params || {};

  const handleComplete = () => {
    // 가입 완료 후 앱 메인 화면으로 이동
    // 전역 네비게이션 함수 사용
    RootNavigation.navigateToMain();
  };

  return (
    <View style={styles.container}>
      <SafeArea style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h2" weight="semiBold" style={styles.title}>
              환영합니다!
            </Text>
            <Text
              variant="body1"
              color="#4F4F4F"
              align="center"
              style={styles.subtitle}>
              {nickname}님의 프로필 설정이 완료되었습니다.
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.infoItem}>
              <Text variant="body1" color="#6B7280" style={styles.label}>
                이름
              </Text>
              <Text
                variant="body1"
                weight="medium"
                color="#111827"
                style={styles.value}>
                {name}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text variant="body1" color="#6B7280" style={styles.label}>
                닉네임
              </Text>
              <Text
                variant="body1"
                weight="medium"
                color="#111827"
                style={styles.value}>
                {nickname}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text variant="body1" color="#6B7280" style={styles.label}>
                성별
              </Text>
              <Text
                variant="body1"
                weight="medium"
                color="#111827"
                style={styles.value}>
                {gender === 'male' ? '남성' : '여성'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label="GLUE 시작하기"
            onPress={handleComplete}
            variant="primary"
          />
        </View>
      </SafeArea>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 90,
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {},
  profileInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 24,
    marginTop: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  label: {},
  value: {},
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
});

export default ProfileCompleteScreen;
