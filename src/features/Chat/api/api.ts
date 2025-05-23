import axios from 'axios';
import {config} from '@/shared/config/env';
import {secureStorage} from '@/shared/lib/security';
import {ApiResponse} from '@/shared/lib/api/hooks';
import {apiClient} from '@/features/auth/api/api';

// DM 채팅방 다른 사용자 정보 타입
export interface DmChatRoomOtherUser {
  userId: number;
  userName: string;
  profileImageUrl: string | null;
}

// DM 채팅방 정보 타입
export interface DmChatRoom {
  dmChatRoomId: number;
  meetingId: number;
  otherUser: DmChatRoomOtherUser;
  lastMessage: string | null;
  lastMessageTime: string | null;
  hasUnreadMessages: boolean;
}

/**
 * 내가 호스트인 DM 채팅방 목록을 가져오는 API 함수
 * @returns API 응답 데이터
 */
export const getHostedDmRooms = async (): Promise<
  ApiResponse<DmChatRoom[]>
> => {
  const endpoint = '/api/dm/rooms/hosted';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 호스트 DM 채팅방 목록 조회: ${url}`);

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기
    const response = await apiClient.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('호스트 DM 채팅방 목록 응답:', response.data);

    // 서버 응답 처리
    return {
      data: response.data,
      success: true,
      message: '',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 네트워크 오류
      if (!error.response) {
        throw new Error('네트워크 연결에 문제가 있습니다.');
      }

      // HTTP 상태 코드별 에러 처리
      const status = error.response.status;
      if (status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (status === 403) {
        throw new Error('DM 채팅방 목록을 조회할 권한이 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || 'DM 채팅방 목록 조회에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

/**
 * 내가 참여자인 DM 채팅방 목록을 가져오는 API 함수
 * @returns API 응답 데이터
 */
export const getParticipatedDmRooms = async (): Promise<
  ApiResponse<DmChatRoom[]>
> => {
  const endpoint = '/api/dm/rooms/participated';
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] 참여자 DM 채팅방 목록 조회: ${url}`);

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기
    const response = await apiClient.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('참여자 DM 채팅방 목록 응답:', response.data);

    // 서버 응답 처리
    return {
      data: response.data,
      success: true,
      message: '',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 네트워크 오류
      if (!error.response) {
        throw new Error('네트워크 연결에 문제가 있습니다.');
      }

      // HTTP 상태 코드별 에러 처리
      const status = error.response.status;
      if (status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (status === 403) {
        throw new Error('DM 채팅방 목록을 조회할 권한이 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || 'DM 채팅방 목록 조회에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};
