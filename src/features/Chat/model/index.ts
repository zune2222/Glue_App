import {ChatRoom} from '../entities/types';
import {dummyChatRooms} from './dummyData';

// 실제 API 호출을 통해 채팅방 목록을 가져오는 함수
export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    // 실제 API 호출 로직이 들어갈 자리
    // const response = await api.get('/chatrooms');
    // return response.data;

    // 임시로 더미 데이터 반환
    return dummyChatRooms;
  } catch (error) {
    console.error('채팅방 목록을 불러오는데 실패했습니다.', error);
    return [];
  }
};
