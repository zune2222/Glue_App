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

// 사용자 요약 정보 타입
export interface UserSummary {
  userId: number;
  userName: string;
  profileImageUrl: string | null;
}

// 호스트 정보가 포함된 사용자 요약 타입
export interface UserSummaryWithHostInfo extends UserSummary {
  isHost: boolean;
}

// DM 메시지 응답 타입
export interface DmMessageResponse {
  dmMessageId: number;
  dmChatRoomId: number;
  sender?: UserSummary; // 임시 메시지에서는 없을 수 있음
  senderId?: number; // 임시 메시지용 senderId
  content: string;
  isRead: number | boolean; // 0: 읽지 않음, 1: 읽음, boolean for temp messages
  createdAt: string;
  isTemp?: boolean; // 임시 메시지 여부
}

// 실제 API 응답에서 사용되는 참가자 타입
export interface DmChatRoomParticipant {
  isHost: boolean;
  user: {
    userId: number;
    userNickname: string;
    profileImageUrl: string | null;
  };
}

// 실제 DM 채팅방 상세 정보 응답 타입 (실제 API 응답 구조)
export interface ActualDmChatRoomDetailResponse {
  dmChatRoomId: number;
  meetingId: number;
  participants: DmChatRoomParticipant[];
  isPushNotificationOn?: number;
  invitationStatus?: number;
  createdAt: string;
  updatedAt: string;
}

// DM 채팅방 상세 정보 응답 타입
export interface DmChatRoomDetailResponse {
  dmChatRoomId: number;
  meetingId: number;
  participants: UserSummaryWithHostInfo[];
  isPushNotificationOn?: number;
  invitationStatus?: number;
  createdAt: string;
  updatedAt: string;
}

// DM 메시지 전송 요청 타입
export interface DmMessageSendRequest {
  content: string;
}

// DM 메시지 읽음 요청 타입
export interface DmMessageReadRequest {
  receiverId: number;
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

/**
 * DM 채팅방 상세 정보를 가져오는 API 함수
 * @param dmChatRoomId 채팅방 ID
 * @returns API 응답 데이터
 */
export const getDmChatRoomDetail = async (
  dmChatRoomId: number,
): Promise<ApiResponse<ActualDmChatRoomDetailResponse>> => {
  const endpoint = `/api/dm/rooms/${dmChatRoomId}`;
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] DM 채팅방 상세 정보 조회: ${url}`);

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

    console.log('DM 채팅방 상세 정보 응답:', response.data);

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
        throw new Error('채팅방 정보를 조회할 권한이 없습니다.');
      } else if (status === 404) {
        throw new Error('존재하지 않는 채팅방입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message ||
        'DM 채팅방 상세 정보 조회에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

/**
 * DM 메시지 목록을 페이지네이션으로 가져오고 읽음 처리하는 API 함수
 * @param dmChatRoomId 채팅방 ID
 * @param cursorId 커서 ID (다음 페이지용, 첫 번째 페이지는 undefined)
 * @param pageSize 페이지 크기 (기본값 20)
 * @returns API 응답 데이터
 */
export const getDmMessages = async (
  dmChatRoomId: number,
  cursorId?: number,
  pageSize: number = 20,
): Promise<ApiResponse<DmMessageResponse[]>> => {
  const endpoint = `/api/dm/${dmChatRoomId}/all-messages`;

  // 쿼리 파라미터 구성
  const params = new URLSearchParams();
  if (cursorId !== undefined) {
    params.append('cursorId', cursorId.toString());
  }
  params.append('pageSize', pageSize.toString());

  const fullUrl = `${config.API_URL}${endpoint}?${params.toString()}`;
  console.log(`[API 요청] DM 메시지 목록 조회: ${fullUrl}`);

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기 (PUT 메서드, 쿼리 파라미터 포함)
    const response = await apiClient.put(
      `${endpoint}?${params.toString()}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('DM 메시지 목록 응답:', response.data);
    console.log('📊 메시지 순서 확인 (첫 번째와 마지막):', {
      first: response.data?.[0]?.dmMessageId,
      last: response.data?.[response.data.length - 1]?.dmMessageId,
      count: response.data?.length,
    });

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
        throw new Error('메시지를 조회할 권한이 없습니다.');
      } else if (status === 404) {
        throw new Error('존재하지 않는 채팅방입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || 'DM 메시지 조회에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

/**
 * DM 메시지를 전송하는 API 함수
 * @param dmChatRoomId 채팅방 ID
 * @param content 메시지 내용
 * @returns API 응답 데이터
 */
export const sendDmMessage = async (
  dmChatRoomId: number,
  content: string,
): Promise<ApiResponse<DmMessageResponse>> => {
  const endpoint = `/api/dm/${dmChatRoomId}/send-message`;
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] DM 메시지 전송: ${url}`, {content});

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기
    const response = await apiClient.post(
      endpoint,
      {content},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('DM 메시지 전송 응답:', response.data);

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
      if (status === 400) {
        throw new Error('잘못된 요청입니다. 메시지 내용을 확인해주세요.');
      } else if (status === 401) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (status === 403) {
        throw new Error('메시지를 전송할 권한이 없습니다.');
      } else if (status === 404) {
        throw new Error('존재하지 않는 채팅방입니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || 'DM 메시지 전송에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};

/**
 * DM 채팅방 알림 설정을 토글하는 API 함수
 * @param dmChatRoomId 채팅방 ID
 * @returns API 응답 데이터
 */
export const toggleDmChatRoomNotification = async (
  dmChatRoomId: number,
): Promise<ApiResponse<any>> => {
  const endpoint = `/api/dm/${dmChatRoomId}/toggle-push-notification`;
  const url = `${config.API_URL}${endpoint}`;
  console.log(`[API 요청] DM 채팅방 알림 설정 토글: ${url}`);

  try {
    // JWT 토큰 가져오기
    const token = await secureStorage.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    // API 요청 보내기 (body 없이 단순 PUT 요청)
    console.log('📤 요청 헤더:', `Bearer ${token}`);
    console.log('📤 요청 URL:', `${config.API_URL}${endpoint}`);

    const response = await apiClient.put(endpoint, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📱 DM 채팅방 알림 설정 토글 전체 응답:', response);
    console.log('📱 응답 데이터:', response.data);
    console.log('📱 응답 상태 코드:', response.status);

    // 서버 응답 처리
    return {
      data: response.data,
      success: true,
      message: '알림 설정이 변경되었습니다.',
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
        throw new Error('알림 설정을 변경할 권한이 없습니다.');
      } else if (status === 404) {
        throw new Error('채팅방을 찾을 수 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      // 기본 에러 메시지
      const errorMessage =
        error.response.data?.message || '알림 설정 변경에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 기타 에러
    throw error;
  }
};
