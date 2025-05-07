import React, {ReactNode} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {colors} from '@app/styles/colors';
import {Button} from '@shared/ui/Button';
import BackArrow from '@shared/assets/images/backArrow.svg';

// 네비게이션 타입 정의
type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
};

type SignUpLayoutProps = {
  navigation?: NavigationProp<RootStackParamList>;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  nextButtonLabel?: string;
  isNextDisabled?: boolean;
};

const SignUpLayout = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextButtonLabel = '다음',
  isNextDisabled = false,
}: SignUpLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled">
          {/* 상단 바 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <BackArrow width={21} height={18} />
            </TouchableOpacity>
            <View style={styles.headerSpacer} />
          </View>

          {/* 진행 상태 바 */}
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {width: `${(currentStep / totalSteps) * 100}%`},
              ]}
            />
          </View>

          {/* 컨텐츠 영역 */}
          <View style={styles.contentContainer}>{children}</View>
        </ScrollView>

        {/* 다음 버튼 */}
        <View style={styles.buttonContainer}>
          <Button
            label={nextButtonLabel}
            onPress={onNext}
            variant={isNextDisabled ? 'disabled' : 'primary'}
            disabled={isNextDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  headerSpacer: {
    flex: 1,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.batteryChargedBlue,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUpLayout;
