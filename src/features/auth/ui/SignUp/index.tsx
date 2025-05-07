import React, {useState, useRef, useEffect, useCallback} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {changeLanguage, Language} from '@shared/lib/i18n';
import {Animated} from 'react-native';
import SignUpLayout from './layout';
import LanguageSelection from './screens/LanguageSelection';
import NameInput from './screens/NameInput';
import GenderSelection from './screens/GenderSelection';
import BirthDateInput from './screens/BirthDateInput';
import NativeLanguageSelection from './screens/NativeLanguageSelection';

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
  const totalSteps = 6; // 회원가입 총 단계
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    'korean',
  );
  const [name, setName] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [nativeLanguage, setNativeLanguage] = useState<string | null>(null);

  // 애니메이션 값
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentView, setCurrentView] = useState(1);

  // 화면 전환 애니메이션 함수
  const animateTransition = useCallback(
    (nextStep: number) => {
      // 현재 화면 페이드 아웃
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // 화면이 완전히 투명해지면 다음 화면으로 내용 변경
        setCurrentView(nextStep);

        // 새 화면 페이드 인
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    },
    [fadeAnim],
  );

  // step이 변경될 때마다 애니메이션 실행
  useEffect(() => {
    if (currentView !== step) {
      animateTransition(step);
    }
  }, [step, currentView, animateTransition]);

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

  const handleGenderSelect = (gender: string) => {
    setGender(gender);
  };

  const handleBirthDateChange = (date: Date) => {
    setBirthDate(date);
  };

  const handleNativeLanguageSelect = (language: string) => {
    setNativeLanguage(language);
  };

  // 현재 단계에 따라 다른 화면 렌더링
  const renderScreen = () => {
    switch (currentView) {
      case 1:
        return (
          <LanguageSelection
            onLanguageSelect={handleLanguageSelect}
            initialLanguage={selectedLanguage}
          />
        );
      case 2:
        return <NameInput onNameChange={handleNameChange} initialName={name} />;
      case 3:
        return (
          <GenderSelection
            selectedGender={gender}
            onGenderSelect={handleGenderSelect}
          />
        );
      case 4:
        return (
          <BirthDateInput
            onBirthDateChange={handleBirthDateChange}
            initialDate={birthDate}
          />
        );
      case 5:
        return (
          <NativeLanguageSelection
            selectedLanguage={nativeLanguage}
            onLanguageSelect={handleNativeLanguageSelect}
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

  // 현재 단계에 따른 다음 버튼 활성화 여부
  const isNextButtonDisabled = () => {
    switch (step) {
      case 1:
        return !selectedLanguage;
      case 2:
        return name.trim() === '';
      case 3:
        return !gender;
      case 4:
        return !birthDate;
      case 5:
        return !nativeLanguage;
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
      <Animated.View style={{opacity: fadeAnim, flex: 1}}>
        {renderScreen()}
      </Animated.View>
    </SignUpLayout>
  );
};

export default SignUpScreen;
