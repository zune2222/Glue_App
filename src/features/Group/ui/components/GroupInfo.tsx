import React, {useState} from 'react';
import {
  View,
  Pressable,
  Modal,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import {groupDetailStyles} from '../styles/groupDetailStyles';
import {Text} from '../../../../shared/ui/typography/Text';
import {
  Calendar,
  Exchange,
  Global,
  InfoIcon,
  Users,
} from '@shared/assets/images';
import {useTranslation} from 'react-i18next';

interface Participant {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

interface GroupInfoProps {
  capacity: string | number;
  language: string | number;
  minForeigners: string | number;
  meetingDate: string;
  participants?: Participant[];
  onParticipantPress?: (userId: number) => void;
}

/**
 * ISO 형식 날짜 문자열을 "yyyy년 m월 d일 오전/오후 h시 m분" 형식으로 변환
 * @param isoDateString ISO 형식 날짜 문자열 (예: "2025-05-22T13:53:52")
 * @param t i18n 번역 함수
 * @returns 포맷팅된 날짜 문자열 (예: "2025년 5월 22일 오후 1시 53분")
 */
const formatMeetingDate = (isoDateString: string, t: any): string => {
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      return isoDateString; // 유효하지 않은 날짜는 원본 반환
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();

    const isPM = hours >= 12;
    const period = isPM ? t('time.pm') : t('time.am');

    // 12시간제로 변환
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return t('time.dateTimeFormat', {
      year,
      month,
      day,
      period,
      hours,
      minutes: minutes.toString().padStart(2, '0'),
    });
  } catch (error) {
    console.error('날짜 변환 오류:', error);
    return isoDateString; // 오류 발생 시 원본 반환
  }
};

/**
 * 모임 정보 컴포넌트
 */
const GroupInfo: React.FC<GroupInfoProps> = ({
  capacity,
  language,
  minForeigners,
  meetingDate,
  participants = [],
  onParticipantPress,
}) => {
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  // 숫자를 문자열로 변환
  const capacityText =
    typeof capacity === 'number' ? `${capacity}명` : capacity;

  // 언어 ID를 문자열로 변환 (추후 언어 이름으로 매핑 가능)
  const languageText =
    typeof language === 'number' ? `언어 ${language}` : language;

  // 최소 외국인 수를 문자열로 변환
  const minForeignersText =
    typeof minForeigners === 'number'
      ? `최소 ${minForeigners}명`
      : minForeigners;

  // 날짜 형식 변환
  const formattedMeetingDate = formatMeetingDate(meetingDate, t);

  // 참가자 프로필 클릭 핸들러
  const handleParticipantPress = (userId: number) => {
    if (onParticipantPress) {
      onParticipantPress(userId);
    }
    setModalVisible(false);
  };

  return (
    <View style={groupDetailStyles.infoContainer}>
      <View style={styles.titleContainer}>
        <Text
          variant="subtitle1"
          weight="medium"
          style={groupDetailStyles.infoTitle}>
          {t('group.detail.meeting_info')}
        </Text>
        <Pressable
          onPress={() => setPopoverVisible(!popoverVisible)}
          style={({pressed}) => [styles.iconButton, pressed && {opacity: 0.7}]}>
          <InfoIcon width={14} height={14} />
          {popoverVisible && (
            <View style={styles.popover}>
              <View style={styles.popoverArrow} />
              <View style={styles.popoverContent}>
                <Text style={styles.popoverText}>
                  • {t('group.detail.language')}:{' '}
                  {t('group.detail.language_desc')}
                </Text>
                <Text style={styles.popoverText}>
                  • {t('group.detail.capacity')}:{' '}
                  {t('group.detail.capacity_desc')}
                </Text>
                <Text style={styles.popoverText}>
                  • {t('group.detail.minForeigners')}:{' '}
                  {t('group.detail.minForeigners_desc')}
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </View>

      <Pressable onPress={() => setModalVisible(true)}>
        <View style={groupDetailStyles.infoItemsContainer}>
          <View style={groupDetailStyles.infoItem}>
            <Users style={groupDetailStyles.infoIcon} />
            <Text variant="body2" style={groupDetailStyles.infoText}>
              {capacityText}
            </Text>
          </View>
          <View style={groupDetailStyles.infoItem}>
            <Global style={groupDetailStyles.infoIconWide} />
            <Text variant="body2" style={groupDetailStyles.infoText}>
              {languageText}
            </Text>
          </View>
          <View style={groupDetailStyles.infoItem}>
            <Exchange style={groupDetailStyles.infoIconWide} />
            <Text variant="body2" style={groupDetailStyles.infoText}>
              {minForeignersText}
            </Text>
          </View>
          <View style={groupDetailStyles.infoItemLast}>
            <Calendar style={groupDetailStyles.infoIconWide} />
            <Text variant="body2" style={groupDetailStyles.infoText}>
              {formattedMeetingDate}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* 참가자 팝오버 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="subtitle1" weight="bold" style={styles.modalTitle}>
                {t('messages.chatInfo.participants')}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text variant="body2" color="#6C7180">
                  {t('common.close')}
                </Text>
              </Pressable>
            </View>

            <ScrollView style={styles.participantsList}>
              {participants.length > 0 ? (
                participants.map(participant => (
                  <Pressable
                    key={participant.userId}
                    style={styles.participantItem}
                    onPress={() => handleParticipantPress(participant.userId)}>
                    <Image
                      source={{
                        uri:
                          participant.profileImageUrl ||
                          'https://via.placeholder.com/40',
                      }}
                      style={styles.participantAvatar}
                    />
                    <Text variant="body2" style={styles.participantName}>
                      {participant.nickname}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text variant="body2" style={styles.emptyText}>
                  {t('messages.empty')}
                </Text>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  iconButton: {
    marginLeft: 12,
    marginTop: 2,
    position: 'relative',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
  },
  participantsList: {
    maxHeight: 300,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  participantName: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#9DA2AF',
  },
  popover: {
    position: 'absolute',
    top: 20,
    left: -230,
    width: 250,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  popoverArrow: {
    position: 'absolute',
    top: -8,
    right: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  popoverContent: {
    padding: 5,
  },
  popoverText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
});

export default GroupInfo;
