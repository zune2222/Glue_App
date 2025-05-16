import {ChatRoom, ChatDetails, ChatUser, ChatMessage} from '../entities/types';

export const dummyChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Maratang Warriors',
    lastMessage: '다들 먹고 싶은 거 있으신가여',
    lastMessageTime: '18:41',
    unreadCount: 1,
    memberCount: 8,
  },
  {
    id: '2',
    name: '서울 여행',
    lastMessage: '오늘 저녁에 어디서 만날까요?',
    lastMessageTime: '15:22',
    unreadCount: 0,
    memberCount: 5,
  },
];

export const dummyUsers: ChatUser[] = [
  {
    id: 'user1',
    name: '이글루',
    isHost: true,
    isOnline: true,
    profileImage:
      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/lsk3xr36_expires_30_days.png',
  },
  {
    id: 'user2',
    name: '김글루',
    isOnline: true,
    profileImage:
      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/zfvhxvph_expires_30_days.png',
  },
  {
    id: 'user3',
    name: '신왕구',
    profileImage:
      'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/cm1k26wd_expires_30_days.png',
  },
  {
    id: 'user4',
    name: '한유리',
    profileImage: 'https://ui-avatars.com/api/?name=한유리&background=random',
  },
  {
    id: 'user5',
    name: '맹구',
    profileImage: 'https://ui-avatars.com/api/?name=맹구&background=random',
  },
  {
    id: 'user6',
    name: '김철수',
    profileImage: 'https://ui-avatars.com/api/?name=김철수&background=random',
  },
  {
    id: 'user7',
    name: '이훈이',
    profileImage: 'https://ui-avatars.com/api/?name=이훈이&background=random',
  },
  {
    id: 'user8',
    name: '원장쌤',
    profileImage: 'https://ui-avatars.com/api/?name=원장쌤&background=random',
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
  roomIcon:
    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/lsk3xr36_expires_30_days.png',
  memberCount: 8,
  users: dummyUsers,
  messages: dummyMessages,
  currentUserId: 'user1',
};
