import {
  GuestBookThreadResponse,
  GuestBookResponse,
  CreateGuestBookRequest,
  UpdateGuestBookRequest,
  GetGuestBooksParams,
} from '../model/guestbookTypes';
import {secureStorage} from '@shared/lib/security';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// 공통 API 호출 함수
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // JWT 토큰 가져오기
  const token = await secureStorage.getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && {Authorization: `Bearer ${token}`}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
    }
    throw new Error(`API call failed: ${response.status}`);
  }

  const data = await response.json();
  return data.result; // BaseResponse<T>의 result 필드
}

// 방명록 작성
export async function createGuestBook(
  request: CreateGuestBookRequest,
): Promise<GuestBookResponse> {
  return apiCall<GuestBookResponse>('/api/guestbooks', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// 방명록 조회 (커서 기반 페이징)
export async function getGuestBooks(
  params: GetGuestBooksParams,
): Promise<GuestBookThreadResponse[]> {
  const searchParams = new URLSearchParams({
    hostId: params.hostId.toString(),
    pageSize: (params.pageSize || 10).toString(),
  });

  if (params.cursorId) {
    searchParams.append('cursorId', params.cursorId.toString());
  }

  return apiCall<GuestBookThreadResponse[]>(
    `/api/guestbooks?${searchParams.toString()}`,
  );
}

// 방명록 개수 조회
export async function getGuestBookCount(hostId: number): Promise<number> {
  const searchParams = new URLSearchParams({
    hostId: hostId.toString(),
  });

  return apiCall<number>(`/api/guestbooks/count?${searchParams.toString()}`);
}

// 방명록 수정
export async function updateGuestBook(
  guestBookId: number,
  request: UpdateGuestBookRequest,
): Promise<GuestBookResponse> {
  return apiCall<GuestBookResponse>(`/api/guestbooks/${guestBookId}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

// 방명록 삭제
export async function deleteGuestBook(guestBookId: number): Promise<void> {
  return apiCall<void>(`/api/guestbooks/${guestBookId}`, {
    method: 'DELETE',
  });
}
