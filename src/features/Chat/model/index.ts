import {ChatRoom, ChatDetails, ChatMessage} from '../entities/types';
import {dummyChatRooms, dummyChatDetails} from './dummyData';

// 채팅방 목록을 가져오는 함수
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

// 채팅방 상세 정보를 가져오는 함수
export const fetchChatDetails = async (
  _roomId: string,
): Promise<ChatDetails | null> => {
  try {
    // 실제 API 호출 로직이 들어갈 자리
    // const response = await api.get(`/chatrooms/${_roomId}`);
    // return response.data;

    // 임시로 더미 데이터 반환
    return dummyChatDetails;
  } catch (error) {
    console.error('채팅방 상세 정보를 불러오는데 실패했습니다.', error);
    return null;
  }
};

// 메시지 전송 함수
export const sendMessage = async (
  _roomId: string,
  message: string,
): Promise<ChatMessage | null> => {
  try {
    // 실제 API 호출 로직이 들어갈 자리
    // const response = await api.post(`/chatrooms/${_roomId}/messages`, { text: message });
    // return response.data;

    // 임시로 더미 메시지 생성
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: message,
      senderId: dummyChatDetails.currentUserId,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      readCount: 0,
    };

    return newMessage;
  } catch (error) {
    console.error('메시지 전송에 실패했습니다.', error);
    return null;
  }
};
