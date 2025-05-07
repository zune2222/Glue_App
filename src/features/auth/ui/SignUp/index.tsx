import React, {useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import SignUpLayout from './layout';
import LanguageSelection from './screens/LanguageSelection';

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

  return (
    <SignUpLayout
      navigation={navigation}
      currentStep={step}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleGoBack}
      isNextDisabled={!selectedLanguage}>
      {renderScreen()}
    </SignUpLayout>
  );
};

export default SignUpScreen;
