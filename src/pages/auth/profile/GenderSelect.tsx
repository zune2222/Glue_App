import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Input, Button, Text, SafeArea} from '../../../shared/ui';
import {SelectModal, SelectOption} from '../../../shared/ui/SelectModal';
import {ProfileStackParamList} from './index';

type GenderSelectRouteProps = RouteProp<ProfileStackParamList, 'GenderSelect'>;

const genderOptions: SelectOption[] = [
  {label: '여성', value: 'female'},
  {label: '남성', value: 'male'},
];

const GenderSelectScreen = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const route = useRoute<GenderSelectRouteProps>();
  const {name, nickname} = route.params || {};

  const [gender, setGender] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNext = () => {
    if (gender) {
      // 실제 구현에서는 프로필 완료 페이지나 홈으로 이동
      navigation.navigate('ProfileComplete', {
        name,
        nickname,
        gender,
      });
    }
  };

  const handleGenderSelect = (option: SelectOption) => {
    setGender(option.value);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const isNextEnabled = !!gender;

  const getSelectedGenderLabel = () => {
    const selected = genderOptions.find(option => option.value === gender);
    return selected ? selected.label : '';
  };

  return (
    <View style={styles.container}>
      <SafeArea style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h3" weight="semiBold" style={styles.title}>
              성별을 선택해주세요
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Input
              label="성별"
              value={getSelectedGenderLabel()}
              onChangeText={() => {}}
              readOnly
              onPress={openModal}
            />

            <View style={styles.fieldContainer}>
              <Input
                label="닉네임"
                value={nickname || ''}
                onChangeText={() => {}}
                readOnly
                labelStyle={styles.secondaryLabel}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Input
                label="이름"
                value={name || ''}
                onChangeText={() => {}}
                readOnly
                labelStyle={styles.secondaryLabel}
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

      <SelectModal
        title="성별을 선택해주세요"
        options={genderOptions}
        isVisible={isModalVisible}
        onClose={closeModal}
        onSelect={handleGenderSelect}
        selectedValue={gender}
      />
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
  fieldContainer: {
    marginTop: 20,
  },
  secondaryLabel: {
    color: '#9DA2AF',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
});

export default GenderSelectScreen;
