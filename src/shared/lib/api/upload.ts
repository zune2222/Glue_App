import axios from 'axios';
import {config} from '@shared/config/env';

// Presigned URL 요청 타입
export interface PresignedUrlRequest {
  bucketObject: string; // S3 버킷의 폴더명 (예: post_images, profile_images)
  extension: string; // 파일 확장자 (예: jpg, png)
}

// Presigned URL 응답 타입
export interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
}

// Axios 인스턴스 생성
const uploadApi = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
});

// 요청 인터셉터: 인증 토큰 추가
uploadApi.interceptors.request.use(
  async (config) => {
    try {
      const {secureStorage} = await import('@shared/lib/security');
      const token = await secureStorage.getToken();
      console.log('presigned URL 요청시 토큰:', token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization 헤더 설정됨:', config.headers.Authorization);
      } else {
        console.error('토큰이 없습니다!');
      }
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Presigned URL 요청 API
export const getPresignedUrl = async (
  params: PresignedUrlRequest,
): Promise<PresignedUrlResponse> => {
  try {
    console.log('프리사인URL 요청 시작:', params);
    
    const response = await uploadApi.get('/v1/upload/presigned-url', {
      params: {
        bucketObject: params.bucketObject,
        extension: params.extension,
      },
    });

    console.log('프리사인URL 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('Presigned URL 요청 실패:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      if (status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else if (status === 403) {
        throw new Error('파일 업로드 권한이 없습니다.');
      } else if (status === 400) {
        throw new Error(`잘못된 요청입니다: ${message}`);
      } else if (status === 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`업로드 준비 중 오류가 발생했습니다: ${message}`);
      }
    }
    
    throw error;
  }
};

// S3에 파일 업로드
export const uploadFileToS3 = async (
  presignedUrl: string,
  file: File | Blob,
  contentType: string,
): Promise<void> => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('S3 파일 업로드 실패:', error);
    throw error;
  }
};

// 파일 업로드 전체 프로세스
export const uploadFile = async (
  bucketObject: string,
  file: File | Blob,
  fileName: string,
): Promise<string> => {
  try {
    // 파일 확장자 추출
    const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Presigned URL 요청
    const {presignedUrl, publicUrl} = await getPresignedUrl({
      bucketObject,
      extension,
    });

    // 파일 타입 결정
    const contentType = getContentType(extension);

    // S3에 파일 업로드
    await uploadFileToS3(presignedUrl, file, contentType);

    // 업로드된 파일의 공개 URL 반환
    return publicUrl;
  } catch (error) {
    console.error('파일 업로드 실패:', error);
    throw error;
  }
};

// 파일 확장자에 따른 Content-Type 결정
const getContentType = (extension: string): string => {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
};