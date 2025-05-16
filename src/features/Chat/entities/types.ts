export interface ChatRoom {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  memberCount?: number;
}

export interface ChatState {
  rooms: ChatRoom[];
  loading: boolean;
  error: string | null;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  readCount?: number;
}

export interface ChatUser {
  id: string;
  name: string;
  isHost?: boolean;
  profileImage: string;
  isOnline?: boolean;
  hostIconImage?: string;
}

export interface ChatDetails {
  id: string;
  name: string;
  roomIcon?: string;
  memberCount: number;
  users: ChatUser[];
  messages: ChatMessage[];
  currentUserId: string;
}
