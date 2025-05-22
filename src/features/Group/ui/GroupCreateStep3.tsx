import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {colors} from '../../../app/styles/colors';
import {Text} from '../../../shared/ui/typography/Text';
import {CameraIcon} from '../../../shared/assets/images';
import GroupCreateHeader from './components/GroupCreateHeader';
import {toastService} from '../../../shared/lib/notifications/toast';

const GroupCreateStep3 = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {t} = useTranslation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    // route.params가 존재하는지 확인 후 사용
    const routeParams = route.params || {};

    // 다음 페이지로 이동 - 파라미터 이름을 GroupCreateStep4에서 기대하는 이름과 일치시킴
    navigation.navigate('GroupCreateStep4', {
      ...routeParams,
      groupTitle: title,
      groupContent: content,
      imageUrls: image ? [image] : [],
    });
  };

  const checkAndRequestPermission = async () => {
    // iOS와 Android의 권한 체크 로직이 다름
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    try {
      const result = await check(permission);

      switch (result) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.DENIED:
          const requestResult = await request(permission);
          return requestResult === RESULTS.GRANTED;
        case RESULTS.BLOCKED:
          toastService.error(
            t('common.permission_required'),
            t('common.photo_permission_blocked'),
          );
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error(t('common.permission_check_error'), error);
      return false;
    }
  };

  const handleAddImage = async () => {
    const hasPermission = await checkAndRequestPermission();

    if (!hasPermission) {
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.8,
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log(t('group.create.step3.image_cancel'));
      } else if (response.errorCode) {
        console.log(t('group.create.step3.image_error'), response.errorMessage);
        toastService.error(
          t('common.error'),
          t('group.create.step3.image_selection_error'),
        );
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        if (selectedImage.uri) {
          setImage(selectedImage.uri);
          toastService.success(t('group.create.step3.image_added'));
        }
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GroupCreateHeader title={t('group.create.title')} onBack={handleBack} />

      <ScrollView style={styles.scrollView}>
        <Text style={styles.stepText}>
          {t('group.create.step', {step: 3, total: 4})}
        </Text>

        <Text style={styles.titleText}>{t('group.create.step3.title')}</Text>

        {/* 제목 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            {t('group.create.step3.group_name_title')}
          </Text>
          <TextInput
            style={styles.titleInput}
            placeholder={t('group.create.step3.group_name_placeholder')}
            placeholderTextColor={colors.manatee}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        {/* 내용 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            {t('group.create.step3.detail_content')}
          </Text>
          <TextInput
            style={styles.contentInput}
            placeholder={t('group.create.step3.detail_content_placeholder')}
            placeholderTextColor={colors.manatee}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            numberOfLines={8}
            maxLength={500}
          />
        </View>

        {/* 사진 추가 */}
        <View style={styles.imageContainer}>
          {image ? (
            <View style={styles.previewContainer}>
              <Image
                source={{uri: image}}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}>
                <Text style={styles.removeImageText}>X</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handleAddImage}>
              <View style={styles.addImageContent}>
                <CameraIcon style={styles.cameraIcon} />
                <Text style={styles.addImageText}>
                  {t('group.create.step3.image_count')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            title.trim() !== '' && content.trim() !== ''
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          disabled={title.trim() === '' || content.trim() === ''}
          onPress={handleNext}>
          <Text style={styles.nextButtonText}>{t('common.next')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  stepText: {
    color: colors.charcoal,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 26,
    marginLeft: 19,
  },
  titleText: {
    color: colors.darkCharcoal,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
    marginLeft: 19,
  },
  inputContainer: {
    marginBottom: 24,
    paddingHorizontal: 19,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.charcoal,
    marginBottom: 8,
  },
  titleInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.lightSilver,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.charcoal,
  },
  contentInput: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: colors.lightSilver,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 14,
    color: colors.charcoal,
  },
  imageContainer: {
    paddingHorizontal: 19,
    marginBottom: 30,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.lightSilver,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageContent: {
    alignItems: 'center',
  },
  cameraIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  addImageText: {
    fontSize: 12,
    color: colors.manatee,
  },
  previewContainer: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.darkCharcoal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomContainer: {
    paddingHorizontal: 19,
    paddingBottom: 20,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.batteryChargedBlue,
  },
  inactiveButton: {
    backgroundColor: '#BBECF4',
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroupCreateStep3;
