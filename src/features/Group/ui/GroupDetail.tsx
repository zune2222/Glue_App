import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {GroupDetailProps} from '../model/types';
import {commonStyles, navigationStyles} from './styles/groupStyles';
import {groupDetailStyles} from './styles/groupDetailStyles';
import GroupHeader from './components/GroupHeader';
import GroupAuthorInfo from './components/GroupAuthorInfo';
import GroupInfo from './components/GroupInfo';
import GroupLikes from './components/GroupLikes';
import {Button} from '@shared/ui';
import {Text} from '@shared/ui/typography';
import {toastService} from '../../../shared/lib/notifications/toast';
import {useGroupDetail, useJoinGroup} from '../api/hooks';
import {useTranslation} from 'react-i18next';

/**
 * 모임 상세 화면 컴포넌트
 */
const GroupDetail: React.FC<GroupDetailProps> = ({route, navigation}) => {
  const {t} = useTranslation();
  const {postId} = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모임 상세 정보 조회 훅 사용
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGroupDetail(Number(postId));

  // 모임 참여 훅 사용
  const {mutate: joinGroupMutate} = useJoinGroup();

  // 작성자 프로필로 이동하는 핸들러
  const handleAuthorPress = (userId: number) => {
    console.log('사용자 프로필로 이동:', userId);
    navigation.navigate('UserProfile', {userId});
  };

  // 카테고리 ID에서 텍스트로 변환
  const getCategoryTextFromId = (categoryId: number): string => {
    switch (categoryId) {
      case 1:
        return t('group.categories.study');
      case 2:
        return t('group.categories.social');
      case 3:
        return t('group.categories.help');
      default:
        return '';
    }
  };

  // 카테고리 ID에서 배경색으로 변환
  const getCategoryColorFromId = (categoryId: number): string => {
    switch (categoryId) {
      case 1: // 공부
        return '#DEE9FC';
      case 2: // 친목
        return '#E1FBE8';
      case 3: // 도움
        return '#FFF1BB';
      default:
        return '#DEE9FC'; // 기본 배경색
    }
  };

  // 카테고리 ID에서 텍스트 색상으로 변환
  const getCategoryTextColorFromId = (categoryId: number): string => {
    switch (categoryId) {
      case 1:
        return '#263FA9';
      case 2:
        return '#306339';
      case 3:
        return '#A47C5E';
      default:
        return '#263FA9'; // 기본 텍스트 색상
    }
  };

  // 모임 참여 버튼 클릭 핸들러
  const handleJoinPress = async () => {
    if (!response?.data?.meeting) return;

    try {
      setIsSubmitting(true);
      joinGroupMutate(response.data.meeting.meetingId, {
        onSuccess: () => {
          console.log(`모임 ${response.data.meeting.meetingId} 참여 신청 성공`);
          toastService.success(
            t('common.success'),
            t('group.detail.joinSuccess'),
          );
        },
        onError: (err: any) => {
          console.error('모임 참여 실패:', err.message);
          toastService.error(
            t('common.error'),
            err.message || t('group.detail.joinError'),
          );
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Error joining group:', err);
      toastService.error(t('common.error'), t('group.detail.joinError'));
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <GroupHeader />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#384050" />
        </View>
      </SafeAreaView>
    );
  }

  // 에러 표시
  if (isError || !response?.data) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <GroupHeader />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Text variant="body1" color="#e74c3c" align="center">
            {error?.message || t('group.detail.loadError')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // 데이터에서 필요한 정보 추출
  const {meeting, post} = response.data;
  const creator = meeting.creator;
  const mainImageUrl =
    post.postImageUrl.length > 0 ? post.postImageUrl[0].imageUrl : null;

  // 카테고리 ID가 있으면 번역된 텍스트로 변환
  const categoryText = meeting.categoryId
    ? getCategoryTextFromId(meeting.categoryId)
    : '';

  // 카테고리 ID가 있으면 배경색과 텍스트 색상 계산
  const categoryBgColor = meeting.categoryId
    ? getCategoryColorFromId(meeting.categoryId)
    : '#DEE9FC';

  const categoryTextColor = meeting.categoryId
    ? getCategoryTextColorFromId(meeting.categoryId)
    : '#263FA9';

  return (
    <SafeAreaView style={commonStyles.container}>
      <GroupHeader />
      <ScrollView style={commonStyles.container}>
        {/* 작성자 정보 */}
        <GroupAuthorInfo
          category={categoryText}
          authorName={creator.userNickname}
          date={meeting.createdAt}
          likeCount={post.likeCount}
          avatarUrl={creator.profileImageUrl || null}
          userId={creator.userId}
          onAuthorPress={handleAuthorPress}
          categoryBgColor={categoryBgColor}
          categoryTextColor={categoryTextColor}
        />

        {/* 제목 및 내용 */}
        <Text variant="h4" weight="bold" style={groupDetailStyles.title}>
          {post.title}
        </Text>
        <Text variant="body1" style={groupDetailStyles.content}>
          {post.content}
        </Text>

        {/* 이미지 */}
        {mainImageUrl && (
          <Image
            source={{uri: mainImageUrl}}
            resizeMode={'stretch'}
            style={groupDetailStyles.contentImage}
          />
        )}

        {/* 모임 정보 */}
        <GroupInfo
          capacity={meeting.maxParticipants}
          language={meeting.languageId}
          minForeigners={0} // TODO: 백엔드 API에 추가 필요
          meetingDate={meeting.meetingTime}
          participants={meeting.participants}
          onParticipantPress={handleAuthorPress}
        />

        {/* 좋아요 정보 */}
        <GroupLikes likeCount={post.likeCount} />

        {/* 하단 버튼 */}
        <Button
          label={t('group.detail.joinGroup')}
          onPress={handleJoinPress}
          style={navigationStyles.joinButton}
          textStyle={navigationStyles.joinButtonText}
          disabled={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupDetail;
