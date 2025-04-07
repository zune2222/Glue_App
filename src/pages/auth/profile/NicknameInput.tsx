import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Input, Button, Text, SafeArea} from '../../../shared/ui';
import {ProfileStackParamList} from './index';

type NicknameInputRouteProps = RouteProp<
  ProfileStackParamList,
  'NicknameInput'
>;

const NicknameInputScreen = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const route = useRoute<NicknameInputRouteProps>();
  const {name} = route.params || {};

  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleNext = () => {
    // 실제 구현에서는 닉네임 중복 체크 API 호출
    if (nickname === '그을루') {
      setError('이미 사용 중인 닉네임이에요.');
      return;
    }

    if (nickname.trim().length > 0) {
      navigation.navigate('GenderSelect', {name, nickname});
    }
  };

  const isNextEnabled = nickname.trim().length > 0;

  return (
    <View style={styles.container}>
      <SafeArea style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h3" weight="semiBold" style={styles.title}>
              GLUE에서 사용할 닉네임을{'\n'}입력해주세요
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Input
              label="닉네임"
              value={nickname}
              onChangeText={text => {
                setNickname(text);
                setError(undefined);
              }}
              placeholder=" "
              error={error}
            />

            <View style={styles.nameContainer}>
              <Input
                label="이름"
                value={name || ''}
                onChangeText={() => {}}
                readOnly
                labelStyle={styles.nameLabel}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label="다음"
            onPress={handleNext}
            variant={isNextEnabled ? 'primary' : 'secondary'}
            disabled={!isNextEnabled}
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
  },
  title: {
    fontSize: 24,
    color: '#030712',
  },
  inputSection: {
    width: '100%',
    gap: 20,
  },
  nameContainer: {
    marginTop: 20,
  },
  nameLabel: {
    color: '#9DA2AF',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
});

export default NicknameInputScreen;
