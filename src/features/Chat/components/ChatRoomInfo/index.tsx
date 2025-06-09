import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Text} from '../../../../shared/ui/typography/Text';
import {Bell, Exit, Mail, Mine, Pen, dummyProfile} from '@shared/assets/images';

interface ChatRoomInfoProps {
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
}

// 멤버 항목 인터페이스
interface MemberItemProps {
  member: {
    id: string;
    name: string;
    profileImage: string;
    isHost?: boolean;
    isOnline?: boolean;
  };
}

// 모임 참여자 컴포넌트
const MemberItem: React.FC<MemberItemProps> = ({member}) => {
  // profileImage가 dummyProfile(로컬 이미지)인지 URL(문자열)인지 확인
  // null, undefined, 빈 문자열인 경우 기본 이미지 사용
  const imageSource =
    member.profileImage === dummyProfile ||
    !member.profileImage ||
    member.profileImage.trim() === ''
      ? dummyProfile // 로컬 이미지
      : {uri: member.profileImage}; // URL 이미지

  return (
    <View style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <Image
          source={imageSource}
          resizeMode={'cover'}
          style={styles.memberAvatar}
        />
        <Text variant="body2" weight="medium" color="#303030">
          {member.name}
        </Text>
      </View>
      <View style={styles.memberBadges}>
        {member.isHost && <Mine style={styles.hostBadge} />}
      </View>
    </View>
  );
};

const ChatRoomInfo: React.FC<ChatRoomInfoProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  roomName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  roomIcon,
  memberCount,
  category = '공부', // 기본값 설정
  postTitle = '영어 공부할 모임 모집합니다', // 기본값 설정
  members,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
  onLeaveRoom,
}) => {
  const {t} = useTranslation();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const handleToggleNotification = () => {
    setIsNotificationEnabled(previousState => !previousState);
  };

  const handleLeaveRoom = () => {
    Alert.alert(
      t('messages.chatInfo.leaveChat'),
      t('messages.chatInfo.leaveConfirm'),
      [
        {
          text: t('messages.chatInfo.cancel'),
          style: 'cancel',
        },
        {
          text: t('messages.chatInfo.confirm'),
          onPress: onLeaveRoom,
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* 모든 채팅방에서 카테고리 표시 */}
        <TouchableOpacity style={styles.categoryButton} onPress={() => {}}>
          <Text variant="body1" weight="bold" color="#263FA9">
            {category}
          </Text>
        </TouchableOpacity>

        {/* 모든 채팅방에서 제목 표시 */}
        <Text
          variant="body1"
          weight="bold"
          color="#303030"
          style={styles.titleText}>
          {postTitle}
        </Text>

        {/* 모든 채팅방에서 게시글 이동 버튼 표시 */}
        <TouchableOpacity style={styles.postButton} onPress={() => {}}>
          <Text variant="body1" weight="bold" color="#9DA2AF">
            {t('messages.chatInfo.goToPost')}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}></View>

        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <Bell style={styles.menuIcon} />
            <Text variant="body2" color="#303030" style={styles.menuText}>
              {t('messages.chatInfo.notification')}
            </Text>
            <Switch
              trackColor={{false: '#D1D5DB', true: '#1CBFDC'}}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#D1D5DB"
              onValueChange={handleToggleNotification}
              value={isNotificationEnabled}
            />
          </View>

          {/* 모든 채팅방에서 초대 메뉴 표시 */}
          <View style={styles.menuItem}>
            <Mail style={styles.menuIcon} />
            <Text variant="body2" color="#303030" style={styles.menuText}>
              {t('messages.chatInfo.invite')}
            </Text>
            <TouchableOpacity style={styles.inviteButton} onPress={() => {}}>
              <Text variant="caption" weight="bold" color="#F9FAFB">
                {t('messages.chatInfo.inviteButton')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 모든 채팅방에서 수정 메뉴 표시 */}
          <View style={styles.menuItem}>
            <Pen style={styles.menuIcon} />
            <Text variant="body2" color="#303030" style={styles.menuText}>
              {t('messages.chatInfo.editPost')}
            </Text>
          </View>
        </View>

        <View style={styles.divider}></View>

        <Text
          variant="subtitle2"
          weight="bold"
          color="#303030"
          style={styles.sectionTitle}>
          {t('messages.chatInfo.participants')} {memberCount}
        </Text>

        <View style={styles.membersList}>
          {members.map(member => (
            <MemberItem key={member.id} member={member} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
          <Exit style={styles.leaveIcon} />
          <Text variant="body2" weight="medium" color="#111827">
            {t('messages.chatInfo.leave')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '75%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  categoryButton: {
    backgroundColor: '#DEE9FC',
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 11,
    marginTop: 70,
    marginBottom: 11,
    marginLeft: 25,
    alignSelf: 'flex-start',
  },
  titleText: {
    fontSize: 16,
    marginBottom: 11,
    marginLeft: 25,
  },
  postButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D2D5DB',
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 5,
    marginBottom: 18,
    marginHorizontal: 25,
  },
  divider: {
    height: 1,
    backgroundColor: '#D2D5DB',
    marginBottom: 17,
    marginHorizontal: 25,
  },
  menuContainer: {
    alignItems: 'flex-start',
    marginBottom: 18,
    marginHorizontal: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    width: '100%',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 14,
  },
  menuText: {
    fontSize: 14,
    flex: 1,
  },
  toggleContainer: {
    // 이 스타일이 더 이상 필요하지 않을 수 있습니다
  },
  toggleIcon: {
    // 이 스타일이 더 이상 필요하지 않을 수 있습니다
  },
  inviteButton: {
    backgroundColor: '#1CBFDC',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 11,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 27,
  },
  membersList: {
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 15,
  },
  memberBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostBadge: {
    width: 14,
    height: 14,
    marginLeft: 4,
  },
  onlineBadge: {
    width: 13,
    height: 13,
    marginLeft: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#D2D5DB',
    paddingVertical: 12,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  leaveIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

export default ChatRoomInfo;
