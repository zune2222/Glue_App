import React from 'react';
import {View} from 'react-native';
import {groupDetailStyles} from '../styles/groupDetailStyles';
import {Text} from '../../../../shared/ui/typography/Text';
import {Heart} from '@shared/assets/images';

interface GroupLikesProps {
  likeCount: number;
}

/**
 * 모임 좋아요 정보 컴포넌트
 */
const GroupLikes: React.FC<GroupLikesProps> = ({likeCount}) => {
  return (
    <View style={groupDetailStyles.likesTotalContainer}>
      <Heart style={groupDetailStyles.likesTotalIcon} />
      <Text variant="body2" style={groupDetailStyles.likesTotalText}>
        {`${likeCount}명이 좋아합니다`}
      </Text>
    </View>
  );
};

export default GroupLikes;
