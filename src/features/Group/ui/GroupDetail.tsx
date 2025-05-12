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

/**
 * 모임 상세 화면 컴포넌트
 */
const GroupDetail: React.FC<GroupDetailProps> = ({route}) => {
  const {groupId} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupDetail, setGroupDetail] = useState<GroupDetailType | null>(null);

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        setIsLoading(true);
        const response = await mockGroupApi.getGroupDetail(groupId);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetail();
  }, [groupId]);

  // 모임 참여 버튼 클릭 핸들러
  const handleJoinPress = async () => {
    if (!groupDetail) return;

    try {
      const response = await mockGroupApi.joinGroup(groupDetail.id);
      if (response.success) {
        console.log(`모임 ${groupId} 참여 신청 성공`);
        // TODO: 성공 메시지 표시
      }
    } catch (err) {
      console.error('Error joining group:', err);
      // TODO: 에러 메시지 표시
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
