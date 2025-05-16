export interface ChatRoom {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface ChatState {
  rooms: ChatRoom[];
  loading: boolean;
  error: string | null;
}
