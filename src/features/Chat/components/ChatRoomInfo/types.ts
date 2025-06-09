export interface ChatRoomInfoProps {
  roomName: string;
  roomIcon?: string;
  memberCount: number;
  category?: string; // 예: "공부"
  postTitle?: string; // 예: "영어 공부할 모임 모집합니다"
  isDirectMessage?: boolean; // 개인 채팅인지 여부
  members: Array<{
    id: string;
    name: string;
    profileImage: string;
    isHost?: boolean;
    isOnline?: boolean;
  }>;
  onClose?: () => void;
  onLeaveRoom: () => void;
  // 알림 설정 관련 추가
  isNotificationEnabled?: boolean;
  onNotificationToggle?: () => void;
}

export interface Member {
  id: string;
  name: string;
  profileImage: string;
  isHost?: boolean;
  isOnline?: boolean;
}

export interface MemberItemProps {
  member: Member;
}
