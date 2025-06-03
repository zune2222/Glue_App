import {useMutation} from '@tanstack/react-query';
import {getPresignedUrl, uploadFileToS3, uploadFile} from './upload';
import type {PresignedUrlRequest, PresignedUrlResponse} from './upload';

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

// React Native용 이미지 업로드 훅
export const useImageUpload = () => {
  return useMutation<
    string,
    Error,
    {
      bucketObject: string;
      imageUri: string;
      fileName?: string;
    }
  >({
    mutationFn: async ({bucketObject, imageUri, fileName}) => {
      try {
        // React Native에서 이미지 URI를 Blob으로 변환
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // 파일 이름이 없으면 기본 이름 생성
        const finalFileName = fileName || `image_${Date.now()}.jpg`;

        // 파일 업로드
        return await uploadFile(bucketObject, blob, finalFileName);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        throw error;
      }
    },
  });
};