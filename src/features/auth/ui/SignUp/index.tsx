import React, {useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {changeLanguage, Language} from '@shared/lib/i18n';
import SignUpLayout from './layout';
import LanguageSelection from './screens/LanguageSelection';
import NameInput from './screens/NameInput';

// 네비게이션 타입 정의
type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
};

type SignUpScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const SignUpScreen = ({navigation}: SignUpScreenProps) => {
  const [step, setStep] = useState(1); // 현재 진행 단계
  const totalSteps = 5; // 회원가입 총 단계
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    'korean',
  );
  const [name, setName] = useState('');
  const {i18n} = useTranslation();

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    // 다음 단계로 이동
    setStep(step + 1);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);

    // 실제 앱 언어 변경
    const newLang = language === 'korean' ? Language.KOREAN : Language.ENGLISH;
    changeLanguage(newLang);
  };

  const handleNameChange = (name: string) => {
    setName(name);
  };

  // 현재 단계에 따라 다른 화면 렌더링
  const renderScreen = () => {
    switch (step) {
      case 1:
        return (
          <LanguageSelection
            onLanguageSelect={handleLanguageSelect}
            initialLanguage={selectedLanguage}
          />
        );
      case 2:
        return <NameInput onNameChange={handleNameChange} initialName={name} />;
      // 추후 다른 단계 추가 예정
      default:
        return (
          <LanguageSelection
            onLanguageSelect={handleLanguageSelect}
            initialLanguage={selectedLanguage}
          />
        );
    }
  };

  // 현재 단계에 따른 다음 버튼 활성화 여부
  const isNextButtonDisabled = () => {
    switch (step) {
      case 1:
        return !selectedLanguage;
      case 2:
        return name.trim() === '';
      default:
        return false;
    }
  };

  return (
    <SignUpLayout
      navigation={navigation}
      currentStep={step}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleGoBack}
      isNextDisabled={isNextButtonDisabled()}>
      {renderScreen()}
    </SignUpLayout>
  );
};

export default SignUpScreen;
