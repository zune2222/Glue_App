import {ChatRoom, ChatDetails, ChatUser, ChatMessage} from '../entities/types';
export const dummyChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Maratang Warriors',
    lastMessage: '다들 먹고 싶은 거 있으신가여',
    lastMessageTime: '18:41',
    unreadCount: 1,
    memberCount: 8,
    type: 'group', // 모임톡
  },
  {
    id: '2',
    name: '서울 여행',
    lastMessage: '오늘 저녁에 어디서 만날까요?',
    lastMessageTime: '15:22',
    unreadCount: 0,
    memberCount: 5,
    type: 'group', // 모임톡
  },
  {
    id: '3',
    name: '김글루',
    lastMessage: '네 알겠습니다!',
    lastMessageTime: '09:15',
    unreadCount: 0,
    type: 'direct', // 쪽지
  },
  {
    id: '4',
    name: '신왕구',
    lastMessage: '모임 날짜 변경 가능할까요?',
    lastMessageTime: '어제',
    unreadCount: 2,
    type: 'direct', // 쪽지
  },
];
const dummyProfile =
  'https://mblogthumb-phinf.pstatic.net/MjAyNDA2MTJfMTYy/MDAxNzE4MTQ0NTg3NDg4.SG1k_pRTayyUW6hqG78tGZJFRZlRJz8uLIp4Lk4CVnAg.d8hxl6ErJlLY3bJeL4laCTBEaRx3mVKJBAvocA1FTl0g.JPEG/31db0e1e70d1b273f0146516a784723a.jpg?type=w800';
export const dummyUsers: ChatUser[] = [
  {
    id: 'user1',
    name: '이글루',
    isHost: true,
    isOnline: true,
    profileImage: dummyProfile,
  },
  {
    id: 'user2',
    name: '김글루',
    isOnline: true,
    profileImage: dummyProfile,
  },
  {
    id: 'user3',
    name: '신왕구',
    profileImage: dummyProfile,
  },
  {
    id: 'user4',
    name: '한유리',
    profileImage: dummyProfile,
  },
  {
    id: 'user5',
    name: '맹구',
    profileImage: dummyProfile,
  },
  {
    id: 'user6',
    name: '김철수',
    profileImage: dummyProfile,
  },
  {
    id: 'user7',
    name: '이훈이',
    profileImage: dummyProfile,
  },
  {
    id: 'user8',
    name: '원장쌤',
    profileImage: dummyProfile,
  },
];

export const dummyMessages: ChatMessage[] = [
  {
    id: 'msg1',
    text: '앞으로 잘 부탁드려요 ㅎㅎ 제가 아직까지 영어를 잘하는 편은 아니지만... 그래도 하면서 많이 배우고 싶어요!',
    senderId: 'user1',
    timestamp: '오후 08:08',
    readCount: 1,
  },
  {
    id: 'msg2',
    text: '반갑습니다! 저도 영어 공부 시작한지 얼마 안됐어요.',
    senderId: 'user2',
    timestamp: '오후 08:12',
  },
  {
    id: 'msg3',
    text: '다들 어느 정도 수준이신가요?',
    senderId: 'user3',
    timestamp: '오후 08:15',
  },
  {
    id: 'msg4',
    text: '저는 기초부터 시작하는 수준이에요 ㅠㅠ',
    senderId: 'user1',
    timestamp: '오후 08:20',
    readCount: 1,
  },
];

export const dummyChatDetails: ChatDetails = {
  id: '1',
  name: 'Maratang Warriors',
  roomIcon: dummyProfile,
  memberCount: 8,
  users: dummyUsers,
  messages: dummyMessages,
  currentUserId: 'user1',
  type: 'group', // 모임톡(그룹)
};
