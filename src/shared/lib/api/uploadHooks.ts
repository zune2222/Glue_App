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
        console.log('이미지 업로드 시작:', {bucketObject, imageUri, fileName});
        
        // React Native에서 이미지 URI를 Blob으로 변환
        const response = await fetch(imageUri);
        
        if (!response.ok) {
          throw new Error(`이미지를 읽을 수 없습니다: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        if (!blob || blob.size === 0) {
          throw new Error('이미지 파일이 비어있습니다');
        }
        
        console.log('이미지 Blob 변환 성공:', {size: blob.size, type: blob.type});

        // 파일 이름이 없으면 기본 이름 생성
        const finalFileName = fileName || `image_${Date.now()}.jpg`;

        // 파일 업로드
        return await uploadFile(bucketObject, blob, finalFileName);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        
        // 더 구체적인 에러 메시지 제공
        if (error instanceof TypeError && error.message.includes('Network request failed')) {
          throw new Error('네트워크 연결을 확인해주세요.');
        } else if (error instanceof Error && error.message.includes('fetch')) {
          throw new Error('이미지 파일을 읽는 중 오류가 발생했습니다.');
        }
        
        throw error;
      }
    },
  });
};