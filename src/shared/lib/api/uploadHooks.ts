import {useMutation} from '@tanstack/react-query';
import {
  getPresignedUrl,
  uploadFileToS3,
  uploadFile,
  validateUploadedImage,
} from './upload';
import type {PresignedUrlRequest, PresignedUrlResponse} from './upload';
import ImageResizer from '@bam.tech/react-native-image-resizer';

// Presigned URL 요청 훅
export const usePresignedUrl = () => {
  return useMutation<PresignedUrlResponse, Error, PresignedUrlRequest>({
    mutationFn: getPresignedUrl,
  });
};

// S3 파일 업로드 훅
export const useS3Upload = () => {
  return useMutation<
    void,
    Error,
    {presignedUrl: string; file: File | Blob; contentType: string}
  >({
    mutationFn: ({presignedUrl, file, contentType}) =>
      uploadFileToS3(presignedUrl, file, contentType),
  });
};

// 전체 파일 업로드 프로세스 훅
export const useFileUpload = () => {
  return useMutation<
    string,
    Error,
    {bucketObject: string; file: File | Blob; fileName: string}
  >({
    mutationFn: ({bucketObject, file, fileName}) =>
      uploadFile(bucketObject, file, fileName),
  });
};

// React Native용 이미지 업로드 훅 (이미지 리사이징 포함)
export const useImageUpload = () => {
  return useMutation<
    string,
    Error,
    {
      bucketObject: string;
      imageUri: string;
      fileName?: string;
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  >({
    mutationFn: async ({
      bucketObject,
      imageUri,
      fileName,
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 80,
    }) => {
      try {
        console.log('🚀 이미지 업로드 시작:', {
          bucketObject,
          imageUri,
          fileName,
        });

        // 1단계: 이미지 리사이징 및 압축
        console.log('🔄 이미지 리사이징 시작...', {
          maxWidth,
          maxHeight,
          quality,
        });
        const resizedImage = await ImageResizer.createResizedImage(
          imageUri,
          maxWidth,
          maxHeight,
          'JPEG', // 항상 JPEG로 변환 (호환성 최대화)
          quality,
          0, // rotation
          undefined, // outputPath
          false, // keepMeta
          {
            mode: 'contain', // 비율 유지하면서 최대 크기에 맞춤
            onlyScaleDown: true, // 이미 작은 이미지는 확대하지 않음
          },
        );

        console.log('✅ 이미지 리사이징 완료:', {
          originalUri: imageUri,
          resizedUri: resizedImage.uri,
          originalSize: resizedImage.size
            ? `${(resizedImage.size / 1024 / 1024).toFixed(2)}MB`
            : 'unknown',
          width: resizedImage.width,
          height: resizedImage.height,
        });

        // 2단계: 리사이징된 이미지를 Blob으로 변환
        console.log('📱 리사이징된 이미지 fetch 시작:', resizedImage.uri);
        const response = await fetch(resizedImage.uri);

        if (!response.ok) {
          console.error(
            '❌ fetch 응답 실패:',
            response.status,
            response.statusText,
          );
          throw new Error(
            `이미지를 읽을 수 없습니다: ${response.status} ${response.statusText}`,
          );
        }

        const blob = await response.blob();

        if (!blob || blob.size === 0) {
          console.error('❌ 빈 Blob 생성됨');
          throw new Error('이미지 파일이 비어있습니다');
        }

        console.log('✅ 이미지 Blob 변환 성공:', {
          size: blob.size,
          type: blob.type,
          sizeInMB: (blob.size / 1024 / 1024).toFixed(2) + 'MB',
        });

        // 3단계: 파일명 설정 (항상 .jpg 확장자 사용)
        const finalFileName = fileName
          ? fileName.replace(/\.(png|jpeg|webp|gif)$/i, '.jpg')
          : `image_${Date.now()}.jpg`;
        console.log('📝 최종 파일명:', finalFileName);

        // 4단계: 파일 업로드
        const result = await uploadFile(bucketObject, blob, finalFileName);
        console.log('🎉 업로드 완료, 공개 URL:', result);

        // 5단계: 업로드된 이미지 검증
        console.log('🔍 업로드된 이미지 검증 시작...');
        const isValid = await validateUploadedImage(result);

        if (!isValid) {
          console.error('❌ 업로드된 이미지가 손상되었거나 접근할 수 없습니다');
          throw new Error(
            '업로드된 이미지를 확인할 수 없습니다. 다시 시도해주세요.',
          );
        }

        console.log('✅ 이미지 검증 완료!');

        return result;
      } catch (error) {
        console.error('💥 이미지 업로드 실패:', error);

        // ImageResizer 관련 에러 처리
        if (error instanceof Error) {
          if (error.message.includes('Image resizer')) {
            throw new Error(
              '이미지 처리 중 오류가 발생했습니다. 다른 이미지를 시도해주세요.',
            );
          } else if (error.message.includes('Network request failed')) {
            throw new Error('네트워크 연결을 확인해주세요.');
          } else if (error.message.includes('fetch')) {
            throw new Error('이미지 파일을 읽는 중 오류가 발생했습니다.');
          }
        }

        throw error;
      }
    },
  });
};
