import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/app/providers/theme';
import {toastService} from '@/shared/lib/notifications/toast';
import {modalService} from '@/shared/lib/notifications/modal';
import {Header} from '@/widgets/header/ui';

/**
 * 알림 예제 페이지
 * 다양한 토스트와 모달을 표시하는 예제 페이지입니다.
 */
export const NotificationExampleScreen: React.FC = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  // 버튼 스타일
  const buttonStyle = [styles.button, {backgroundColor: theme.colors.primary}];

  // 버튼 텍스트 스타일
  const buttonTextStyle = [styles.buttonText, {color: '#FFFFFF'}];

  // 토스트 예제
  const showSuccessToast = () => {
    toastService.success(
      t('notification.toast.successTitle'),
      t('notification.toast.successMessage'),
    );
  };

  const showErrorToast = () => {
    toastService.error(
      t('notification.toast.errorTitle'),
      t('notification.toast.errorMessage'),
    );
  };

  const showInfoToast = () => {
    toastService.info(
      t('notification.toast.infoTitle'),
      t('notification.toast.infoMessage'),
    );
  };

  const showWarningToast = () => {
    toastService.warning(
      t('notification.toast.warningTitle'),
      t('notification.toast.warningMessage'),
    );
  };

  // 모달 예제
  const showAlertModal = () => {
    modalService.alert(
      t('notification.modal.alertTitle'),
      t('notification.modal.alertMessage'),
    );
  };

  const showConfirmModal = () => {
    modalService.confirm(
      t('notification.modal.confirmTitle'),
      t('notification.modal.confirmMessage'),
      () => {
        // 확인 눌렀을 때
        toastService.success(t('notification.modal.confirmButtonPressed'));
      },
      () => {
        // 취소 눌렀을 때
        toastService.info(t('notification.modal.cancelButtonPressed'));
      },
    );
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Header title={t('notification.title')} />

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          {t('notification.toastSection')}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={buttonStyle} onPress={showSuccessToast}>
            <Text style={buttonTextStyle}>
              {t('notification.toast.showSuccess')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={buttonStyle} onPress={showErrorToast}>
            <Text style={buttonTextStyle}>
              {t('notification.toast.showError')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={buttonStyle} onPress={showInfoToast}>
            <Text style={buttonTextStyle}>
              {t('notification.toast.showInfo')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={buttonStyle} onPress={showWarningToast}>
            <Text style={buttonTextStyle}>
              {t('notification.toast.showWarning')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
          {t('notification.modalSection')}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={buttonStyle} onPress={showAlertModal}>
            <Text style={buttonTextStyle}>
              {t('notification.modal.showAlert')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={buttonStyle} onPress={showConfirmModal}>
            <Text style={buttonTextStyle}>
              {t('notification.modal.showConfirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
