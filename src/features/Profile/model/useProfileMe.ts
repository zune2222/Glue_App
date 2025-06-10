import {useQuery} from '@tanstack/react-query';
import {getProfileMe} from '../api/profileApi';

export interface ProfileMeInfo {
  userId: number;
  profileImageUrl: string;
  description: string;
  realName: string;
  nickName: string;
  birthDate: string;
  gender: number;
  systemLanguage: number;
  school: number;
  major: number;
  email: string;
}

/**
 * 본인 프로필 정보 조회 훅
 */
export function useProfileMe() {
  const {data, isLoading, isError, error, refetch} = useQuery<ProfileMeInfo>({
    queryKey: ['profileMe'],
    queryFn: getProfileMe,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전의 cacheTime)
  });

  return {
    profileMe: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
