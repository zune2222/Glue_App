import React from 'react';
import {View, Text, Image} from 'react-native';
import {groupDetailStyles} from '../styles/groupDetailStyles';

interface GroupAuthorInfoProps {
  category: string;
  authorName: string;
  date: string;
  likeCount: number;
  avatarUrl: string;
}

/**
 * 모임 작성자 정보 컴포넌트
 */
const GroupAuthorInfo: React.FC<GroupAuthorInfoProps> = ({
  category,
  authorName,
  date,
  likeCount,
  avatarUrl,
}) => {
  return (
    <View style={groupDetailStyles.authorContainer}>
      <View style={groupDetailStyles.categoryBadge}>
        <Text style={groupDetailStyles.categoryText}>{category}</Text>
      </View>
      <View style={groupDetailStyles.authorInfoContainer}>
        <Image
          source={{uri: avatarUrl}}
          resizeMode={'stretch'}
          style={groupDetailStyles.authorAvatar}
        />
        <View style={groupDetailStyles.authorTextContainer}>
          <Text style={groupDetailStyles.authorName}>{authorName}</Text>
          <Text style={groupDetailStyles.authorDate}>{date}</Text>
        </View>
        <View style={groupDetailStyles.likeContainer}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/iy1a5bp3_expires_30_days.png',
            }}
            resizeMode={'stretch'}
            style={groupDetailStyles.likeIcon}
          />
          <Text style={groupDetailStyles.likeCount}>{likeCount}</Text>
        </View>
      </View>
    </View>
  );
};

export default GroupAuthorInfo;
