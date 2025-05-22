import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ChevronLeft} from '../../../shared/assets/images';
import {colors} from '../../../app/styles/colors';
import {Text} from '../../../shared/ui/typography/Text';
import {CameraIcon} from '../../../shared/assets/images';

type RouteParams = {
  groupType: string;
  myLanguage: string;
  exchangeLanguage: string;
  memberCount: number;
};

const GroupCreateStep3 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {t} = useTranslation();
  const params = route.params as RouteParams;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    // 다음 페이지로 이동
    // navigation.navigate('GroupCreateStep4', {
    //   ...params,
    //   title,
    //   content,
    //   image,
    // });
  };

  const handleAddImage = () => {
    // 이미지 선택 기능 구현 예정
    // 여기서는 더미 이미지 URL을 설정
    setImage('https://example.com/dummy-image.jpg');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('group.create.title')}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.stepText}>
          {t('group.create.step', {step: 3, total: 4})}
        </Text>

        <Text style={styles.titleText}>
          모임글의 제목과{'\n'}모임글의 내용을 입력해 주세요
        </Text>

        {/* 제목 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>그룹명 제목</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="그룹명 제목을 입력해주세요"
            placeholderTextColor={colors.manatee}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        {/* 내용 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>상세내용 내용</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="상세내용 내용을 입력해주세요"
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
                <Text style={styles.addImageText}>(0/1)</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    marginHorizontal: 17,
    position: 'relative',
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    color: colors.darkCharcoal,
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
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
