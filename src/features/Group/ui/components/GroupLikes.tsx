import React from 'react';
import {View, Image} from 'react-native';
import {groupDetailStyles} from '../styles/groupDetailStyles';
import {Text} from '../../../../shared/ui/typography/Text';

interface GroupLikesProps {
  likeCount: number;
}

/**
 * 모임 좋아요 정보 컴포넌트
 */
const GroupLikes: React.FC<GroupLikesProps> = ({likeCount}) => {
  return (
    <View style={groupDetailStyles.likesTotalContainer}>
      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/x4sm2znu_expires_30_days.png',
        }}
        resizeMode={'stretch'}
        style={groupDetailStyles.likesTotalIcon}
      />
      <Text variant="body2" style={groupDetailStyles.likesTotalText}>
        {`${likeCount}명이 좋아합니다`}
      </Text>
    </View>
  );
};

export default GroupLikes;
