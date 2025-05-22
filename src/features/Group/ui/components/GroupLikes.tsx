import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {groupDetailStyles} from '../styles/groupDetailStyles';
import {Text} from '../../../../shared/ui/typography/Text';
import {Heart} from '@shared/assets/images';
import {useTranslation} from 'react-i18next';
import {useToggleLike} from '../../api/hooks';

interface GroupLikesProps {
  likeCount: number;
  postId: number;
}

/**
 * 모임 좋아요 정보 컴포넌트
 */
const GroupLikes: React.FC<GroupLikesProps> = ({likeCount, postId}) => {
  const {t} = useTranslation();
  const toggleLikeMutation = useToggleLike(postId);

  const handleLikePress = () => {
    if (!toggleLikeMutation.isPending) {
      toggleLikeMutation.mutate();
    }
  };

  return (
    <Pressable
      style={groupDetailStyles.likesTotalContainer}
      onPress={handleLikePress}
      disabled={toggleLikeMutation.isPending}>
      <Heart style={[groupDetailStyles.likesTotalIcon, styles.heartIcon]} />
      <Text variant="body2" style={groupDetailStyles.likesTotalText}>
        {t('group.detail.likesCount', {count: likeCount})}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  heartIcon: {
    // 필요한 경우 여기에 추가 스타일을 적용할 수 있습니다
  },
});

export default GroupLikes;
