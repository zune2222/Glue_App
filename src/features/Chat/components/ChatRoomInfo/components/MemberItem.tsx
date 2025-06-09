import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Text} from '../../../../../shared/ui/typography/Text';
import {Mine, dummyProfile} from '@shared/assets/images';
import {MemberItemProps} from '../types';

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

const styles = StyleSheet.create({
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
});

export default MemberItem;
