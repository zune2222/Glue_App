import React from 'react';
import {View, Text, Image} from 'react-native';
import {groupDetailStyles} from '../styles/groupDetailStyles';

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
      <Text style={groupDetailStyles.likesTotalText}>
        {`${likeCount}명이 좋아합니다`}
      </Text>
    </View>
  );
};

export default GroupLikes;
