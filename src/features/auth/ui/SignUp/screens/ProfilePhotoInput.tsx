import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {colors} from '@app/styles/colors';
import {typography} from '@app/styles/typography';
import {useTranslation} from 'react-i18next';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import {
  PERMISSIONS,
  RESULTS,
  request,
  check,
  Permission,
} from 'react-native-permissions';
import CameraIcon from '@shared/assets/icons/CameraIcon';
import PlusIcon from '@shared/assets/icons/PlusIcon';

type ProfilePhotoInputProps = {
  onPhotoSelect: (uri: string | null) => void;
  initialPhotoUri?: string | null;
};

const ProfilePhotoInput = ({
  onPhotoSelect,
  initialPhotoUri = null,
}: ProfilePhotoInputProps) => {
  const [photoUri, setPhotoUri] = useState<string | null>(initialPhotoUri);
  const {t} = useTranslation();

  // 이미지 선택 핸들러
  const handleSelectPhoto = () => {
    Alert.alert(
      t('common.select'),
      t('signup.profilePhoto.selectOption'),
      [
        {
          text: t('signup.profilePhoto.camera'),
          onPress: () => checkPermissionAndProceed('camera'),
        },
        {
          text: t('signup.profilePhoto.gallery'),
          onPress: () => checkPermissionAndProceed('gallery'),
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  // 권한 확인 및 처리
  const checkPermissionAndProceed = async (type: 'camera' | 'gallery') => {
    try {
      let permission: Permission;

      if (type === 'camera') {
        permission =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA;
      } else {
        permission =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.PHOTO_LIBRARY
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }

      const result = await check(permission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(t('common.error'), t('signup.profilePhoto.unavailable'));
          break;
        case RESULTS.DENIED:
          const requestResult = await request(permission);
          if (requestResult === RESULTS.GRANTED) {
            type === 'camera' ? openCamera() : openGallery();
          }
          break;
        case RESULTS.GRANTED:
          type === 'camera' ? openCamera() : openGallery();
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            t('common.permission'),
            t('signup.profilePhoto.blocked'),
            [
              {
                text: t('common.ok'),
                onPress: () => console.log('사용자가 설정으로 이동하지 않음'),
              },
              {
                text: t('signup.profilePhoto.goToSettings'),
                onPress: () => {
                  // 여기서 설정으로 이동하는 코드 추가
                  // (react-native-permissions의 openSettings 함수 사용)
                },
              },
            ],
          );
          break;
      }
    } catch (error) {
      console.log('권한 확인 중 오류 발생:', error);
    }
  };

  // 카메라 열기
  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 500,
        maxWidth: 500,
      },
      (response: ImagePickerResponse) => {
        handleImagePickerResponse(response);
      },
    );
  };

  // 갤러리 열기
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 500,
        maxWidth: 500,
      },
      (response: ImagePickerResponse) => {
        handleImagePickerResponse(response);
      },
    );
  };

  // 이미지 선택 응답 처리
  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('사용자가 이미지 선택을 취소했습니다');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert(t('common.error'), t('signup.profilePhoto.error'));
    } else if (response.assets && response.assets.length > 0) {
      const selectedAsset: Asset = response.assets[0];
      const uri = selectedAsset.uri;

      if (uri) {
        setPhotoUri(uri);
        onPhotoSelect(uri);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('signup.profilePhoto.title')}</Text>
        <Text style={styles.subtitle}>{t('signup.profilePhoto.subtitle')}</Text>
      </View>

      <View style={styles.photoContainer}>
        <View>
          <TouchableOpacity
            style={styles.photoCircle}
            onPress={handleSelectPhoto}
            activeOpacity={0.8}>
            {photoUri ? (
              <Image source={{uri: photoUri}} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <View style={styles.iconContainer}>
                  <CameraIcon
                    width={40}
                    height={40}
                    color={colors.auroMetalSaurus}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSelectPhoto}
            style={styles.editContainer}>
            <View style={styles.editIconBackground}>
              <PlusIcon width={16} height={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 64,
  },
  title: {
    ...typography.h2,
    color: colors.richBlack,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: colors.charcoal,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  photoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.antiFlashWhite,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  editContainer: {
    position: 'absolute',
    bottom: 15,
    right: 5,
  },
  editIconBackground: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.batteryChargedBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});

export default ProfilePhotoInput;
