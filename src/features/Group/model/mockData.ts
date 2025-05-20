import {GroupItem} from './types';

// 가상 데이터 - 모임 목록
const dummyProfile =
  'https://mblogthumb-phinf.pstatic.net/MjAyNDA2MTJfMTYy/MDAxNzE4MTQ0NTg3NDg4.SG1k_pRTayyUW6hqG78tGZJFRZlRJz8uLIp4Lk4CVnAg.d8hxl6ErJlLY3bJeL4laCTBEaRx3mVKJBAvocA1FTl0g.JPEG/31db0e1e70d1b273f0146516a784723a.jpg?type=w800';
export const MOCK_GROUPS: GroupItem[] = [
  {
    id: '1',
    category: '친목',
    categoryColor: '#E2FBE8',
    categoryTextColor: '#306339',
    title: '영어 공부할 모임 모집합니다',
    description: '제발 같이 하실 분... 제발 저요',
    comments: 20,
    participants: '8/10',
    time: '1분 전',
    likes: 48,
    image: dummyProfile,
  },
  {
    id: '2',
    category: '공부',
    categoryColor: '#DEE9FC',
    categoryTextColor: '#263FA9',
    title: '영어 공부할 모임 모집합니다',
    description:
      '같이 영어 공부할 사람 모집해요! 솔직히 저도 잘하는 편 아니라 그냥 편하게 열심히 하실...',
    comments: 20,
    participants: '8/10',
    time: '1시간 전',
    likes: 48,
    image: dummyProfile,
  },
  {
    id: '3',
    category: '친목',
    categoryColor: '#E2FBE8',
    categoryTextColor: '#306339',
    title: '영어 공부할 모임 모집합니다',
    description: '제발 같이 하실 분... 제발 저요',
    comments: 20,
    participants: '8/10',
    time: '1시간 전',
    likes: 48,
    image: dummyProfile,
  },
  {
    id: '4',
    category: '친목',
    categoryColor: '#E2FBE8',
    categoryTextColor: '#306339',
    title: '영어 공부할 모임 모집합니다',
    description: '제발 같이 하실 분... 제발 저요',
    comments: 20,
    participants: '8/10',
    time: '1시간 전',
    likes: 48,
    image: dummyProfile,
  },
];
