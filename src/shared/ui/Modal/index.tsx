import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme} from '@/app/providers/theme';
import {ModalState, modalService} from '@/shared/lib/notifications/modal';

/**
 * 앱 전체에서 사용하는 모달 컴포넌트
 * modalService를 통해 모달 상태를 구독하고 표시합니다.
 */
export const AppModal: React.FC = () => {
  const {theme} = useTheme();
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    id: '',
    title: '',
    message: '',
    type: 'alert',
    buttons: [],
    cancelable: true,
  });

  // 모달 서비스 구독
  useEffect(() => {
    const subscription = modalService.modalState$.subscribe(state => {
      setModalState(state);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 모달 닫기 처리
  const handleBackdropPress = () => {
    if (modalState.cancelable) {
      modalService.hide();
    }
  };

  // 버튼이 없는 경우 기본 '확인' 버튼 추가
  const effectiveButtons =
    modalState.buttons && modalState.buttons.length > 0
      ? modalState.buttons
      : [{text: '확인', onPress: () => modalService.hide(), style: 'default'}];

  // 각 버튼 스타일 계산
  const getButtonStyle = (style?: 'default' | 'cancel' | 'destructive') => {
    if (style === 'destructive') {
      return [styles.button, {backgroundColor: theme.colors.error}];
    } else if (style === 'cancel') {
      return [styles.button, {backgroundColor: theme.colors.secondary}];
    }
    return [styles.button, {backgroundColor: theme.colors.primary}];
  };

  // 각 버튼 텍스트 스타일 계산
  const getButtonTextStyle = (style?: 'default' | 'cancel' | 'destructive') => {
    if (style === 'destructive') {
      return [styles.buttonText, {color: '#FFFFFF'}];
    } else if (style === 'cancel') {
      return [styles.buttonText, {color: theme.colors.text}];
    }
    return [styles.buttonText, {color: '#FFFFFF'}];
  };

  return (
    <Modal
      isVisible={modalState.visible}
      onBackdropPress={handleBackdropPress}
      useNativeDriver
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      style={styles.modal}>
      <View style={[styles.container, {backgroundColor: theme.colors.card}]}>
        {/* 커스텀 모달 */}
        {modalState.type === 'custom' && modalState.customContent ? (
          <View style={styles.customContent}>{modalState.customContent}</View>
        ) : (
          <>
            {/* 제목 */}
            {modalState.title ? (
              <Text style={[styles.title, {color: theme.colors.text}]}>
                {modalState.title}
              </Text>
            ) : null}

            {/* 메시지 */}
            {modalState.message ? (
              <Text
                style={[styles.message, {color: theme.colors.textSecondary}]}>
                {modalState.message}
              </Text>
            ) : null}
          </>
        )}

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {effectiveButtons.map((button, index) => (
            <TouchableOpacity
              key={`${button.text}-${index}`}
              style={getButtonStyle(button.style)}
              onPress={button.onPress}>
              <Text style={getButtonTextStyle(button.style)}>
                {button.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  container: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: width - 60,
    maxWidth: 400,
    alignSelf: 'center',
  },
  customContent: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
