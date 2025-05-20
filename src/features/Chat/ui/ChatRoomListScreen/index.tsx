import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {styles} from './styles';
import {ChatRoom} from '../../entities/types';
import {ChatRoomItem, TabHeader, MessageFilter} from '../../components';
import {useTranslation} from 'react-i18next';
import {dummyProfile} from '@shared/assets/images';
interface ChatRoomListScreenProps {
  chatRooms: ChatRoom[];
  onChatRoomPress: (roomId: string) => void;
}

type FilterType = 'host' | 'guest' | 'all';

const ChatRoomListScreen: React.FC<ChatRoomListScreenProps> = ({
  chatRooms,
  onChatRoomPress,
}) => {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'chat' | 'message'>('chat');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'chat' | 'message') => {
    setActiveTab(tab);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  // 모임톡 데이터 필터링 (그룹 채팅만)
  const groupChats = chatRooms.filter(room => room.type === 'group');

  // 쪽지 데이터 필터링 (개인 채팅만)
  let directMessages = chatRooms.filter(room => room.type === 'direct');

  // 필터 적용 (실제로는 여기서 호스트/게스트 구분 로직이 추가되어야 함)
  if (activeFilter !== 'all' && activeTab === 'message') {
    // 예시: 실제 앱에서는 호스트/게스트 정보를 기반으로 필터링
    directMessages = directMessages.filter(room => {
      if (activeFilter === 'host') {
        // 호스트인 경우 필터링 로직
        return room.id === '3'; // 예시로 id가 3인 채팅방을 호스트로 가정
      } else if (activeFilter === 'guest') {
        // 게스트인 경우 필터링 로직
        return room.id === '4'; // 예시로 id가 4인 채팅방을 게스트로 가정
      }
      return true;
    });
  }

  // 현재 탭에 맞는 데이터 선택
  // const currentChats = activeTab === 'chat' ? groupChats : directMessages;

  // 직접 메시지 아이템 렌더링 (디자인 참고 구현)
  const renderDirectMessageItem = (room: ChatRoom) => {
    return (
      <TouchableOpacity
        key={room.id}
        style={styles.directMessageItem}
        onPress={() => onChatRoomPress(room.id)}
        activeOpacity={0.7}>
        <Image
          source={dummyProfile}
          resizeMode={'stretch'}
          style={styles.profileImage}
        />
        <View style={styles.messageContent}>
          <Text style={styles.senderName}>{room.name}</Text>
          <Text style={styles.messagePreview}>{room.lastMessage}</Text>
        </View>
        <View style={styles.messageTimeContainer}>
          <Text style={styles.messageTime}>{room.lastMessageTime}</Text>
          {room?.unreadCount > 0 && <View style={styles.unreadIndicator} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 탭 전환 버튼 */}
      <TabHeader activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 쪽지 화면일 때만 필터 표시 */}
      {activeTab === 'message' && (
        <MessageFilter onFilterChange={handleFilterChange} />
      )}

      <ScrollView style={styles.scrollView}>
        {/* 쪽지 화면일 때 */}
        {activeTab === 'message' ? (
          // 디자인 참고한 쪽지 목록
          <View style={styles.directMessagesContainer}>
            {directMessages.length > 0 ? (
              directMessages.map(room => renderDirectMessageItem(room))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {t('messages.noDirectMessages')}
                </Text>
              </View>
            )}
          </View>
        ) : (
          // 기존 모임톡 목록
          <View>
            {groupChats.length > 0 ? (
              groupChats.map(room => (
                <ChatRoomItem
                  key={room.id}
                  room={room}
                  onPress={onChatRoomPress}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {t('messages.noGroupChats')}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatRoomListScreen;
