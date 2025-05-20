// src/features/Profile/model/api.ts

import {
  UserProfile,
  GroupHistoryItem,
  LikedGroupItem,
} from './types';

/**
 * 프로필 관련 API 인터페이스
 */
export interface ProfileApi {
  fetchProfile: () => Promise<UserProfile>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  fetchGroupHistory: () => Promise<GroupHistoryItem[]>;
  fetchLikedGroups: () => Promise<LikedGroupItem[]>;
}

/**
 * 개발용 모의 데이터 / 네트워크 지연 시뮬
 */
const MOCK_PROFILE: UserProfile = {
  id: '1',
  email: 'user@example.com',
  nickname: '강개발',
  bio: '리액트 네이티브와 FSD 패턴으로 앱을 개발하고 있습니다.',
  language: '한국어',
  avatarUrl: 'https://placehold.co/100x100.png',
};

const MOCK_HISTORY: GroupHistoryItem[] = [
  { id: 'g1', title: '영어 스터디', place: '도서관', participants: 5, isHost: true },
  { id: 'g2', title: '운동 모임', place: '체육관', participants: 8, isHost: false },
];

const MOCK_LIKED: LikedGroupItem[] = [
  { id: 'g3', title: '카페 토론', place: '카페거리', participants: 3 },
];

/**
 * mock 구현체
 */
export const mockProfileApi: ProfileApi = {
  fetchProfile: async () => {
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_PROFILE;
  },
  updateProfile: async (data) => {
    await new Promise((r) => setTimeout(r, 500));
    return { ...MOCK_PROFILE, ...data };
  },
  fetchGroupHistory: async () => {
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_HISTORY;
  },
  fetchLikedGroups: async () => {
    await new Promise((r) => setTimeout(r, 500));
    return MOCK_LIKED;
  },
};