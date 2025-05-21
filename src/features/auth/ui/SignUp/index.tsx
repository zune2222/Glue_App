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
import LanguageLevelSelection from './screens/LanguageLevelSelection';
import UniversitySelection from './screens/UniversitySelection';
import DepartmentSelection from './screens/DepartmentSelection';
import EmailInput from './screens/EmailInput';
import VerificationCodeInput from './screens/VerificationCodeInput';
import NicknameInput from './screens/NicknameInput';
import ProfilePhotoInput from './screens/ProfilePhotoInput';
import IntroductionScreen from './screens/IntroductionScreen';
import SignupCompleteScreen from './screens/SignupCompleteScreen';
import {useSendVerificationCode} from '../../api';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';

// 네비게이션 타입 정의
type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Main: undefined;
};

type SignUpScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const SignUpScreen = ({navigation}: SignUpScreenProps) => {
  const [step, setStep] = useState(1); // 현재 진행 단계
  const totalSteps = 13; // 회원가입 총 단계 (소개 추가로 13으로 변경)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    'korean',
  );
  const [name, setName] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(new Date());
  const [nativeLanguage, setNativeLanguage] = useState<string | null>(null);
  const [languageLevel, setLanguageLevel] = useState<string | null>(null);
  const [university, setUniversity] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 유효성 상태 추가
  const [verificationCode, setVerificationCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [introduction, setIntroduction] = useState(''); // 한 줄 소개 상태 추가
  const [isSignupComplete, setIsSignupComplete] = useState(false); // 회원가입 완료 상태 추가

  // 이메일 인증 코드 발송 뮤테이션
  const sendVerificationCode = useSendVerificationCode();

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
    if (isSignupComplete) {
      // 가입 완료 화면에서는 뒤로가기 없음
      return;
    }

    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = async () => {
    if (isSignupComplete) {
      // 가입 완료 화면에서 시작하기 버튼 클릭
      navigation.navigate('Main');
      return;
    }

    // 마지막 단계에서 다음을 눌렀을 때 가입 완료 화면으로 전환
    if (step === totalSteps) {
      // 여기서 실제 회원가입 API 호출 등의 로직을 수행할 수 있음
      setIsSignupComplete(true);
      return;
    }

    // 이메일 화면에서 다음 버튼 클릭 시 인증 코드 발송
    if (step === 9) {
      try {
        // 인증 코드 발송 중 알림
        Toast.show({
          type: 'info',
          text1: t('signup.email.sendingVerification'),
          position: 'bottom',
        });

        // 인증 코드 발송 API 호출
        await sendVerificationCode.mutateAsync(email);

        // 성공 알림
        Toast.show({
          type: 'success',
          text1: t('signup.email.verificationSent'),
          position: 'bottom',
        });

        // 다음 단계로 이동
        setStep(step + 1);
      } catch (error) {
        // 오류 알림

        setStep(step + 1);
        Toast.show({
          type: 'error',
          text1: t('signup.email.sendFailed'),
          position: 'bottom',
        });
      }
      return;
    }

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

  const handleLanguageLevelSelect = (level: string) => {
    setLanguageLevel(level);
  };

  const handleUniversitySelect = (univ: string) => {
    setUniversity(univ);
  };

  const handleDepartmentSelect = (dept: string) => {
    setDepartment(dept);
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  // 이메일 유효성 상태 처리 함수
  const handleEmailValidityChange = (isValid: boolean) => {
    setIsEmailValid(isValid);
  };

  const handleVerificationComplete = (code: string) => {
    setVerificationCode(code);
  };

  const handleNicknameChange = (nickname: string) => {
    setNickname(nickname);
  };

  const handlePhotoSelect = (uri: string | null) => {
    setProfilePhotoUri(uri);
  };

  // 한 줄 소개 변경 핸들러 추가
  const handleIntroductionChange = (text: string) => {
    setIntroduction(text);
  };

  // 닉네임 중복 확인 함수
  const checkNicknameDuplicate = async (nickname: string): Promise<boolean> => {
    // 실제 구현에서는 API 호출하여 중복 확인
    // 예시: 글루라는 닉네임은 중복으로 설정
    const isDuplicate = nickname.toLowerCase() === '글루';
    setIsNicknameDuplicate(isDuplicate);
    return isDuplicate;
  };

  // 회원가입 완료 후 시작하기
  const handleStartApp = () => {
    navigation.navigate('Main');
  };

  // i18n hook
  const {t} = useTranslation();

  // 현재 단계에 따라 다른 화면 렌더링
  const renderScreen = () => {
    // 회원가입 완료 화면
    if (isSignupComplete) {
      return (
        <SignupCompleteScreen nickname={nickname} onStart={handleStartApp} />
      );
    }

    // 회원가입 진행 화면
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
      case 6:
        return (
          <LanguageLevelSelection
            selectedLevel={languageLevel}
            onLevelSelect={handleLanguageLevelSelect}
            nativeLanguage={nativeLanguage}
          />
        );
      case 7:
        return (
          <UniversitySelection
            selectedUniversity={university}
            onUniversitySelect={handleUniversitySelect}
          />
        );
      case 8:
        return (
          <DepartmentSelection
            selectedDepartment={department}
            onDepartmentSelect={handleDepartmentSelect}
          />
        );
      case 9:
        return (
          <EmailInput
            onEmailChange={handleEmailChange}
            initialEmail={email}
            onValidityChange={handleEmailValidityChange}
          />
        );
      case 10:
        return (
          <VerificationCodeInput
            onVerificationComplete={handleVerificationComplete}
            email={email}
          />
        );
      case 11:
        return (
          <NicknameInput
            onNicknameChange={handleNicknameChange}
            initialNickname={nickname}
            onNicknameCheck={checkNicknameDuplicate}
          />
        );
      case 12:
        return (
          <ProfilePhotoInput
            onPhotoSelect={handlePhotoSelect}
            initialPhotoUri={profilePhotoUri}
          />
        );
      case 13: // 한 줄 소개 화면 추가
        return (
          <IntroductionScreen
            introduction={introduction}
            onIntroductionChange={handleIntroductionChange}
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
    // 회원가입 완료 화면에서는 버튼 항상 활성화
    if (isSignupComplete) {
      return false;
    }

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
      case 6:
        return !languageLevel;
      case 7:
        return !university;
      case 8:
        return !department;
      case 9:
        return email.trim() === '' || !isEmailValid; // 이메일 유효성 검사 추가
      case 10:
        return verificationCode.length !== 6;
      case 11:
        return nickname.trim() === '' || isNicknameDuplicate;
      case 12:
        return false; // 프로필 사진은 선택 사항
      case 13: // 한 줄 소개 활성화 조건 추가
        return introduction.trim() === '';
      default:
        return false;
    }
  };

  // 회원가입 완료 화면일 때는 레이아웃을 사용하지 않음
  if (isSignupComplete) {
    return (
      <Animated.View style={{opacity: fadeAnim, flex: 1}}>
        {renderScreen()}
      </Animated.View>
    );
  }

  return (
    <SignUpLayout
      currentStep={step}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleGoBack}
      isNextDisabled={isNextButtonDisabled()}
      isLoading={step === 9 && sendVerificationCode.isPending}>
      <Animated.View style={{opacity: fadeAnim, flex: 1}}>
        {renderScreen()}
      </Animated.View>
    </SignUpLayout>
  );
};

export default SignUpScreen;
