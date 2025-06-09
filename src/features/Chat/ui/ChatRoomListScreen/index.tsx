import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {styles} from './styles';
import {ChatRoom} from '../../entities/types';
import {ChatRoomItem, TabHeader, MessageFilter} from '../../components';
import {useTranslation} from 'react-i18next';
import {dummyProfile} from '@shared/assets/images';
import {useHostedDmRooms, useParticipatedDmRooms} from '../../api/hooks';
import {DmChatRoom} from '../../api/api';
import {toastService} from '@shared/lib/notifications/toast';

interface ChatRoomListScreenProps {
  chatRooms: ChatRoom[];
  onChatRoomPress: (roomId: string) => void;
  onDmChatRoomPress?: (dmRoomId: number) => void;
}

type FilterType = 'host' | 'guest' | 'all';

const ChatRoomListScreen: React.FC<ChatRoomListScreenProps> = ({
  chatRooms,
  onChatRoomPress,
  onDmChatRoomPress,
}) => {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'chat' | 'message'>('chat');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [directMessages, setDirectMessages] = useState<DmChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 호스트 DM 채팅방 목록 조회 훅
  const {
    data: hostedDmRooms,
    isLoading: isHostedLoading,
    isError: isHostedError,
    error: hostedError,
    refetch: refetchHostedRooms,
  } = useHostedDmRooms();

  // 참여자 DM 채팅방 목록 조회 훅
  const {
    data: participatedDmRooms,
    isLoading: isParticipatedLoading,
    isError: isParticipatedError,
    error: participatedError,
    refetch: refetchParticipatedRooms,
  } = useParticipatedDmRooms();

  // 모든 DM 채팅방 데이터 로딩 상태
  useEffect(() => {
    setIsLoading(isHostedLoading || isParticipatedLoading);
  }, [isHostedLoading, isParticipatedLoading]);

  // 새로고침 상태
  const [refreshing, setRefreshing] = useState(false);

  // 새로고침 핸들러
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchHostedRooms(), refetchParticipatedRooms()]);
    } catch (error) {
      console.error('새로고침 실패:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchHostedRooms, refetchParticipatedRooms]);

  // 화면 포커스 시 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'message') {
        // 쪽지 탭이 활성화된 상태에서 화면에 포커스될 때만 새로고침
        refetchHostedRooms();
        refetchParticipatedRooms();
      }
    }, [activeTab, refetchHostedRooms, refetchParticipatedRooms]),
  );

  // 에러 발생시 토스트 표시
  useEffect(() => {
    if (isHostedError && hostedError) {
      toastService.error('오류', hostedError.message);
    }
    if (isParticipatedError && participatedError) {
      toastService.error('오류', participatedError.message);
    }
  }, [isHostedError, hostedError, isParticipatedError, participatedError]);

  // 필터에 따라 DM 채팅방 목록 업데이트
  useEffect(() => {
    if (activeTab === 'message') {
      let filteredMessages: DmChatRoom[] = [];

      if (activeFilter === 'host' && hostedDmRooms?.data) {
        filteredMessages = hostedDmRooms.data;
      } else if (activeFilter === 'guest' && participatedDmRooms?.data) {
        filteredMessages = participatedDmRooms.data;
      } else {
        // 'all' 필터인 경우 모든 채팅방 병합
        const allMessages = [
          ...(hostedDmRooms?.data || []),
          ...(participatedDmRooms?.data || []),
        ];

        // dmChatRoomId로 중복 제거 (호스트/참여자 모두 포함된 채팅방이 있을 수 있음)
        const uniqueRooms = allMessages.reduce((acc, current) => {
          const duplicateIndex = acc.findIndex(
            item => item.dmChatRoomId === current.dmChatRoomId,
          );
          if (duplicateIndex === -1) {
            acc.push(current);
          }
          return acc;
        }, [] as DmChatRoom[]);

        filteredMessages = uniqueRooms;
      }

      // 최신 메시지 순으로 정렬
      filteredMessages.sort((a, b) => {
        // lastMessageTime이 null인 경우 가장 아래로
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;

        return (
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
        );
      });

      setDirectMessages(filteredMessages);
    }
  }, [activeTab, activeFilter, hostedDmRooms, participatedDmRooms]);

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'chat' | 'message') => {
    setActiveTab(tab);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  // DM 채팅방 클릭 핸들러
  const handleDmChatRoomPress = (dmRoomId: number) => {
    console.log('[ChatRoomList] DM 채팅방 클릭됨:', dmRoomId);
    if (onDmChatRoomPress) {
      onDmChatRoomPress(dmRoomId);
    } else {
      console.warn('[ChatRoomList] onDmChatRoomPress 콜백이 없습니다.');
    }
  };

  // 모임톡 데이터 필터링 (그룹 채팅만)
  const groupChats = chatRooms.filter(room => room.type === 'group');

  // DM 채팅방 아이템 렌더링
  const renderDmChatRoomItem = (room: DmChatRoom) => {
    // 디버깅: otherUser 구조 확인
    console.log('DM 채팅방 otherUser 구조:', room.otherUser);

    return (
      <TouchableOpacity
        key={room.dmChatRoomId}
        style={styles.directMessageItem}
        onPress={() => handleDmChatRoomPress(room.dmChatRoomId)}
        activeOpacity={0.7}>
        <Image
          source={
            room.otherUser.profileImageUrl &&
            room.otherUser.profileImageUrl.trim() !== ''
              ? {uri: room.otherUser.profileImageUrl}
              : dummyProfile
          }
          resizeMode={'cover'}
          style={styles.profileImage}
        />
        <View style={styles.messageContent}>
          <Text style={styles.senderName}>
            {room.otherUser.userName ||
              (room.otherUser as any).userNickname ||
              '알 수 없는 사용자'}
          </Text>
          <Text style={styles.messagePreview}>
            {room.lastMessage || '새로운 채팅방이 생성되었습니다.'}
          </Text>
        </View>
        <View style={styles.messageTimeContainer}>
          <Text style={styles.messageTime}>
            {room.lastMessageTime
              ? new Date(room.lastMessageTime).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : ''}
          </Text>
          {room.hasUnreadMessages && <View style={styles.unreadIndicator} />}
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

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1CBFDC"
            colors={['#1CBFDC']}
          />
        }>
        {/* 로딩 표시 */}
        {isLoading && activeTab === 'message' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1CBFDC" />
            <Text style={styles.loadingText}>쪽지 목록을 불러오는 중...</Text>
          </View>
        )}

        {/* 쪽지 화면일 때 */}
        {activeTab === 'message' && !isLoading ? (
          // API로부터 가져온 DM 채팅방 목록
          <View style={styles.directMessagesContainer}>
            {directMessages.length > 0 ? (
              directMessages.map(room => renderDmChatRoomItem(room))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {t('messages.noDirectMessages')}
                </Text>
              </View>
            )}
          </View>
        ) : (
          // 기존 모임톡 목록 (API에서 온 데이터가 아님)
          !isLoading && (
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
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatRoomListScreen;
