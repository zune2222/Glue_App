// src/features/Profile/model/useProfile.ts

import { useApiQuery, useApiMutation } from '@/shared/lib/api/hooks';
import { mockProfileApi as api } from './api';
import {
  UserProfile,
  GroupHistoryItem,
  LikedGroupItem,
} from './types';

/**
 * 프로필 정보 조회/수정 훅
 */
export function useProfile() {
  // 조회
  const profileQuery = useApiQuery<UserProfile>(
    ['profile'],
    () => api.fetchProfile()
  );

  // 수정
  const updateProfileMutation = useApiMutation<UserProfile, Partial<UserProfile>>(
    'profile',
    (data) => api.updateProfile(data),
    {
      onSuccess: () => {
        // 수정 성공 시 프로필 다시 불러오기
        profileQuery.refetch();
      },
    }
  );

  return {
    profile: profileQuery.data?.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isLoading,
    updateError: updateProfileMutation.error,
  };
}

/**
 * 모임 히스토리 조회 훅
 */
export function useGroupHistory() {
  const historyQuery = useApiQuery<GroupHistoryItem[]>(
    ['profile', 'history'],
    () => api.fetchGroupHistory()
  );

  return {
    history: historyQuery.data?.data || [],
    isLoading: historyQuery.isLoading,
    isError: historyQuery.isError,
    refetchHistory: historyQuery.refetch,
  };
}

/**
 * 좋아요한 모임 조회 훅
 */
export function useLikedGroups() {
  const likedQuery = useApiQuery<LikedGroupItem[]>(
    ['profile', 'liked'],
    () => api.fetchLikedGroups()
  );

  return {
    liked: likedQuery.data?.data || [],
    isLoading: likedQuery.isLoading,
    isError: likedQuery.isError,
    refetchLiked: likedQuery.refetch,
  };
}