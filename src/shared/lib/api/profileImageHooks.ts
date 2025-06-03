import {useMutation} from '@tanstack/react-query';
import {updateProfileImage} from './profileImageApi';
import type {UpdateProfileImageRequest, ApiResponse} from './profileImageApi';
import {useImageUpload} from './uploadHooks';

// 프로필 이미지 업데이트 훅
export const useUpdateProfileImage = () => {
  return useMutation<ApiResponse<any>, Error, UpdateProfileImageRequest>({
    mutationFn: updateProfileImage,
  });
};

// 전체 프로필 이미지 업로드 + 업데이트 프로세스 훅
export const useProfileImageUploadAndUpdate = () => {
  const imageUpload = useImageUpload();
  const updateImage = useUpdateProfileImage();

  return useMutation<
    string,
    Error,
    {
      imageUri: string;
      fileName?: string;
    }
  >({
    mutationFn: async ({imageUri, fileName}) => {
      try {
        // 1. S3에 이미지 업로드
        const publicUrl = await imageUpload.mutateAsync({
          bucketObject: 'profile_images',
          imageUri: imageUri,
          fileName: fileName || `profile_${Date.now()}.jpg`,
        });

        // 2. 프로필 이미지 URL 업데이트
        await updateImage.mutateAsync({
          profileImageUrl: publicUrl,
        });

        // 3. 업로드된 이미지 URL 반환
        return publicUrl;
      } catch (error) {
        console.error('프로필 이미지 업로드 및 업데이트 실패:', error);
        throw error;
      }
    },
  });
};