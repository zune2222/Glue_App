import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {GroupDetailProps, GroupDetail as GroupDetailType} from '../model/types';
import {commonStyles, navigationStyles} from './styles/groupStyles';
import {groupDetailStyles} from './styles/groupDetailStyles';
import GroupHeader from './components/GroupHeader';
import GroupAuthorInfo from './components/GroupAuthorInfo';
import GroupInfo from './components/GroupInfo';
import GroupLikes from './components/GroupLikes';
import {Button} from '@shared/ui';
import {Text} from '@shared/ui/typography';
import {mockGroupApi} from '../model/api';
import {toastService} from '../../../shared/lib/notifications/toast';

/**
 * 모임 상세 화면 컴포넌트
 */
const GroupDetail: React.FC<GroupDetailProps> = ({route}) => {
  const {postId} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupDetail, setGroupDetail] = useState<GroupDetailType | null>(null);

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        setIsLoading(true);
        console.log(`모임 상세 정보 조회: postId=${postId}`);

        // TODO: 실제 API가 구현되면 아래 코드로 대체
        // const response = await getGroupDetail(postId);

        // 임시로 Mock API 사용
        const response = await mockGroupApi.getGroupDetail(String(postId));

        // API 응답을 GroupDetailType으로 변환
        setGroupDetail({
          id: response.id,
          title: response.title,
          description: response.description,
          content: response.content || '',
          category: response.category,
          authorName: response.authorName,
          authorDate: response.authorDate,
          authorAvatarUrl: response.authorAvatarUrl,
          likes: response.likes,
          capacity: response.capacity,
          language: response.language,
          minForeigners: response.minForeigners,
          meetingDate: response.meetingDate,
          imageUrl: response.imageUrl,
        });
        setError(null);
      } catch (err) {
        setError('모임 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching group detail:', err);
        toastService.error(
          '오류',
          '모임 정보를 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetail();
  }, [postId]);

  // 모임 참여 버튼 클릭 핸들러
  const handleJoinPress = async () => {
    if (!groupDetail) return;

    try {
      // TODO: 실제 API가 구현되면 아래 코드로 대체
      // const response = await joinGroup(groupDetail.id);

      // 임시로 Mock API 사용
      const response = await mockGroupApi.joinGroup(groupDetail.id);

      if (response.success) {
        console.log(`모임 ${postId} 참여 신청 성공`);
        toastService.success('성공', '모임 참여 신청이 완료되었습니다.');
      }
    } catch (err) {
      console.error('Error joining group:', err);
      toastService.error('오류', '모임 참여 신청 중 오류가 발생했습니다.');
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
  if (error || !groupDetail) {
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
            {error || '모임 정보를 불러올 수 없습니다.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <GroupHeader />
      <ScrollView style={commonStyles.container}>
        {/* 작성자 정보 */}
        <GroupAuthorInfo
          category={groupDetail.category}
          authorName={groupDetail.authorName}
          date={groupDetail.authorDate}
          likeCount={groupDetail.likes}
          avatarUrl={groupDetail.authorAvatarUrl}
        />

        {/* 제목 및 내용 */}
        <Text variant="h4" weight="bold" style={groupDetailStyles.title}>
          {groupDetail.title}
        </Text>
        <Text variant="body1" style={groupDetailStyles.content}>
          {groupDetail.content}
        </Text>

        {/* 이미지 */}
        {groupDetail.imageUrl && (
          <Image
            source={{uri: groupDetail.imageUrl}}
            resizeMode={'stretch'}
            style={groupDetailStyles.contentImage}
          />
        )}

        {/* 모임 정보 */}
        <GroupInfo
          capacity={groupDetail.capacity}
          language={groupDetail.language}
          minForeigners={groupDetail.minForeigners}
          meetingDate={groupDetail.meetingDate}
        />

        {/* 좋아요 정보 */}
        <GroupLikes likeCount={groupDetail.likes} />

        {/* 하단 버튼 */}
        <Button
          label="모임 참여하기"
          onPress={handleJoinPress}
          style={navigationStyles.joinButton}
          textStyle={navigationStyles.joinButtonText}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupDetail;
