import {GroupItem} from './types';

/**
 * 그룹 상세 정보 API 응답 타입
 */
export interface GroupDetailResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  authorName: string;
  authorDate: string;
  authorAvatarUrl: string;
  likes: number;

  // 모임 정보
  capacity: string;
  language: string;
  minForeigners: string;
  meetingDate: string;

  // 추가 정보
  content?: string;
  imageUrl?: string;
}

/**
 * 그룹 목록 API 응답 타입
 */
export interface GroupListResponse {
  groups: GroupItem[];
  hasMore: boolean;
  nextPage?: string;
}

/**
 * API 인터페이스 - 실제 구현은 나중에 추가
 */
export interface GroupApi {
  getGroupDetail: (id: string) => Promise<GroupDetailResponse>;
  getGroupList: (page?: string, limit?: number) => Promise<GroupListResponse>;
  likeGroup: (id: string) => Promise<{success: boolean}>;
  joinGroup: (id: string) => Promise<{success: boolean}>;
}

/**
 * API mock 구현 - 개발 중에 사용
 */
export const mockGroupApi: GroupApi = {
  getGroupDetail: async (id: string) => {
    // 실제 구현에서는 API 호출
    return {
      id,
      title: '영어 스터디 모임',
      description: '함께 영어 공부해요',
      category: '스터디',
      authorName: '김영어',
      authorDate: '2023.05.15',
      authorAvatarUrl:
        'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/2ztssxiw_expires_30_days.png',
      likes: 48,

      capacity: '10명',
      language: '한국어/영어',
      minForeigners: '외국인 2명 이상',
      meetingDate: '매주 수요일 7PM',

      content: '영어 공부에 관심있는 분들 모두 환영합니다!',
    };
  },

  getGroupList: async (_page, _limit = 10) => {
    // 실제 구현에서는 API 호출
    return {
      groups: [],
      hasMore: false,
    };
  },

  likeGroup: async (_id: string) => {
    // 실제 구현에서는 API 호출
    return {success: true};
  },

  joinGroup: async (_id: string) => {
    // 실제 구현에서는 API 호출
    return {success: true};
  },
};
