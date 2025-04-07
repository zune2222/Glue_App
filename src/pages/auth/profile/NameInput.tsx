import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Input, Button, Text, SafeArea} from '../../../shared/ui';
import {ProfileStackParamList} from './index';

const NameInputScreen = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim().length > 0) {
      navigation.navigate('NicknameInput', {name});
    }
  };

  const isNextEnabled = name.trim().length > 0;

  return (
    <View style={styles.container}>
      <SafeArea style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h3" weight="semiBold" style={styles.title}>
              이름을 입력해주세요
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Input
              label="이름"
              value={name}
              onChangeText={setName}
              placeholder=" "
            />
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
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
});

export default NameInputScreen;
