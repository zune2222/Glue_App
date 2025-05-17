import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {Text} from '../../../../shared/ui/typography/Text';

interface ChatRoomInfoProps {
  roomName: string;
  roomIcon?: string;
  memberCount: number;
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
const MemberItem: React.FC<MemberItemProps> = ({member}) => (
  <View style={styles.memberItem}>
    <View style={styles.memberInfo}>
      <Image
        source={{uri: member.profileImage}}
        resizeMode={'cover'}
        style={styles.memberAvatar}
      />
      <Text variant="body2" weight="medium" color="#303030">
        {member.name}
      </Text>
    </View>
    <View style={styles.memberBadges}>
      {member.isHost && (
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/errvmxs9_expires_30_days.png',
          }}
          resizeMode={'contain'}
          style={styles.hostBadge}
        />
      )}
      {member.isOnline && (
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/hmd54r24_expires_30_days.png',
          }}
          resizeMode={'contain'}
          style={styles.onlineBadge}
        />
      )}
    </View>
  </View>
);

const ChatRoomInfo: React.FC<ChatRoomInfoProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  roomName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  roomIcon,
  memberCount,
  members,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
  onLeaveRoom,
}) => {
  const handleLeaveRoom = () => {
    Alert.alert(
      '모임톡 나가기',
      '정말로 이 모임톡방을 나가시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '나가기',
          onPress: onLeaveRoom,
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.categoryButton} onPress={() => {}}>
          <Text variant="body1" weight="bold" color="#263FA9">
            공부
          </Text>
        </TouchableOpacity>

        <Text
          variant="body1"
          weight="bold"
          color="#303030"
          style={styles.titleText}>
          영어 공부할 모임 모집합니다
        </Text>

        <TouchableOpacity style={styles.postButton} onPress={() => {}}>
          <Text variant="body1" weight="bold" color="#9DA2AF">
            게시글 바로가기
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}></View>

        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/e5rf1ad3_expires_30_days.png',
              }}
              resizeMode={'stretch'}
              style={styles.menuIcon}
            />
            <Text variant="body2" color="#303030" style={styles.menuText}>
              쪽지 알림
            </Text>
            <View style={styles.toggleContainer}>
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/viiajgiz_expires_30_days.png',
                }}
                resizeMode={'stretch'}
                style={styles.toggleIcon}
              />
            </View>
          </View>

          <View style={styles.menuItem}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/cw29e2bo_expires_30_days.png',
              }}
              resizeMode={'stretch'}
              style={styles.menuIcon}
            />
            <Text variant="body2" color="#303030" style={styles.menuText}>
              모임 초대하기
            </Text>
            <TouchableOpacity style={styles.inviteButton} onPress={() => {}}>
              <Text variant="caption" weight="bold" color="#F9FAFB">
                초대
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuItem}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/c49ivanr_expires_30_days.png',
              }}
              resizeMode={'stretch'}
              style={styles.menuIcon}
            />
            <Text variant="body2" color="#303030" style={styles.menuText}>
              게시글 수정하기
            </Text>
          </View>
        </View>

        <View style={styles.divider}></View>

        <Text
          variant="subtitle2"
          weight="bold"
          color="#303030"
          style={styles.sectionTitle}>
          쪽지 참여자 {memberCount}
        </Text>

        <View style={styles.membersList}>
          {members.map(member => (
            <MemberItem key={member.id} member={member} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/5km9sg0f_expires_30_days.png',
            }}
            style={styles.leaveIcon}
            resizeMode="contain"
          />
          <Text variant="body2" weight="medium" color="#111827">
            쪽지 나가기
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
    backgroundColor: '#1CBFDC',
    borderRadius: 999,
    paddingVertical: 2,
    paddingLeft: 21,
    paddingRight: 3,
  },
  toggleIcon: {
    width: 20,
    height: 20,
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
