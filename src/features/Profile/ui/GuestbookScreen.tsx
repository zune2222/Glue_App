import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  Pressable,
} from 'react-native';
import {Text} from '@shared/ui/typography';
import {guestbookStyles} from './styles/guestbookStyles';
import {
  ChevronLeft,
  dummyProfile,
  DotsVertical,
  LockIcon,
  UnlockIcon,
} from '@shared/assets/images';
import {secureStorage} from '@shared/lib/security';
import {
  GuestBookThreadResponse,
  CreateGuestBookRequest,
  UpdateGuestBookRequest,
} from '../model/guestbookTypes';
import {
  createGuestBook,
  getGuestBooks,
  updateGuestBook,
  deleteGuestBook,
  getGuestBookCount,
} from '../api/guestbookApi';

interface GuestbookScreenProps {
  route: {
    params: {
      userId: number;
      userNickname: string;
    };
  };
  navigation: any;
}

const GuestbookScreen: React.FC<GuestbookScreenProps> = ({
  route,
  navigation,
}) => {
  const {userId, userNickname} = route.params;
  const [comments, setComments] = useState<GuestBookThreadResponse[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [editingComment, setEditingComment] =
    useState<GuestBookThreadResponse | null>(null);
  const [replyingToComment, setReplyingToComment] =
    useState<GuestBookThreadResponse | null>(null);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedComment, setSelectedComment] =
    useState<GuestBookThreadResponse | null>(null);
  const [_isLoading, setIsLoading] = useState(true);
  const [_guestBookCount, setGuestBookCount] = useState(0);
  const [_cursorId, setCursorId] = useState<number | undefined>();
  const [_hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const isMyGuestbook = currentUserId !== null && userId === currentUserId;

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userId = await secureStorage.getUserId();
        setCurrentUserId(userId);
      } catch (error) {
        console.error('사용자 ID 가져오기 오류:', error);
      }
    };
    getCurrentUser();
  }, []);

  // 방명록 목록 로드
  const loadGuestBooks = useCallback(
    async (cursor?: number, isRefresh = false) => {
      try {
        setIsLoading(true);
        const response = await getGuestBooks({
          hostId: userId,
          cursorId: cursor,
          pageSize: 10,
        });

        if (isRefresh) {
          setComments(response);
        } else {
          setComments(prev => [...prev, ...response]);
        }

        // 다음 커서 설정
        if (response.length > 0) {
          setCursorId(response[response.length - 1].id);
          setHasMore(response.length === 10);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('방명록 로드 오류:', error);
        Alert.alert('오류', '방명록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  // 방명록 개수 로드
  const loadGuestBookCount = useCallback(async () => {
    try {
      const count = await getGuestBookCount(userId);
      setGuestBookCount(count);
    } catch (error) {
      console.error('방명록 개수 로드 오류:', error);
    }
  }, [userId]);

  useEffect(() => {
    const loadData = async () => {
      await loadGuestBooks(undefined, true);
      await loadGuestBookCount();
    };
    loadData();
  }, [loadGuestBooks, loadGuestBookCount]);

  const canViewComment = (comment: GuestBookThreadResponse) => {
    if (!comment.secret) return true;
    return comment.writer.userId === currentUserId || userId === currentUserId;
  };

  const canEditComment = (comment: GuestBookThreadResponse) => {
    return comment.writer.userId === currentUserId;
  };

  const canDeleteComment = (comment: GuestBookThreadResponse) => {
    return comment.writer.userId === currentUserId || isMyGuestbook;
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const request: CreateGuestBookRequest = {
        content: newComment.trim(),
        hostId: userId,
        parentId: replyingToComment?.id,
        secret: isSecret,
      };

      if (editingComment) {
        // 수정
        const updateRequest: UpdateGuestBookRequest = {
          content: newComment.trim(),
          secret: isSecret,
        };
        await updateGuestBook(editingComment.id, updateRequest);
        setEditingComment(null);
      } else {
        // 새 작성
        await createGuestBook(request);
        setReplyingToComment(null);
      }

      // 목록 새로고침
      await loadGuestBooks(undefined, true);
      await loadGuestBookCount();

      setNewComment('');
      setIsSecret(false);
    } catch (error) {
      console.error('방명록 작성/수정 오류:', error);
      Alert.alert('오류', '방명록 처리에 실패했습니다.');
    }
  };

  const handleEditComment = (comment: GuestBookThreadResponse) => {
    setEditingComment(comment);
    setNewComment(comment.content);
    setIsSecret(comment.secret);
    setShowMenuModal(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    Alert.alert('삭제 확인', '정말로 이 방명록을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGuestBook(commentId);
            await loadGuestBooks(undefined, true);
            await loadGuestBookCount();
            setShowMenuModal(false);
          } catch (error) {
            console.error('방명록 삭제 오류:', error);
            Alert.alert('오류', '방명록 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleReportComment = (_comment: GuestBookThreadResponse) => {
    Alert.alert('신고하기', '이 방명록을 신고하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '신고',
        style: 'destructive',
        onPress: () => {
          // TODO: 신고 API 호출
          Alert.alert('신고 완료', '신고가 접수되었습니다.');
          setShowMenuModal(false);
        },
      },
    ]);
  };

  const handleReplyComment = (comment: GuestBookThreadResponse) => {
    setReplyingToComment(comment);
    setNewComment(`@${comment.writer.userNickname} `);
  };

  const openCommentMenu = (comment: GuestBookThreadResponse) => {
    setSelectedComment(comment);
    setShowMenuModal(true);
  };

  const renderComment = (comment: GuestBookThreadResponse) => {
    if (!canViewComment(comment)) {
      return (
        <View key={comment.id} style={guestbookStyles.commentItem}>
          <Text style={guestbookStyles.secretCommentTitle}>
            비밀 방명록입니다.
          </Text>
          <Text style={guestbookStyles.secretCommentDate}>
            {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
          </Text>
        </View>
      );
    }

    const isMyComment = comment.writer.userId === currentUserId;
    const showReplyButton =
      isMyGuestbook && comment.writer.userId !== currentUserId;

    return (
      <View key={comment.id}>
        <View
          style={
            isMyComment
              ? guestbookStyles.myCommentItem
              : guestbookStyles.commentItem
          }>
          <View style={guestbookStyles.commentHeader}>
            <Image
              source={
                comment.writer.profileImageUrl
                  ? {uri: comment.writer.profileImageUrl}
                  : dummyProfile
              }
              style={guestbookStyles.profileImage}
            />
            <View style={guestbookStyles.commentInfo}>
              <View style={guestbookStyles.authorRow}>
                <Text style={guestbookStyles.authorName}>
                  {comment.writer.userNickname}
                </Text>
                {comment.secret && (
                  <LockIcon
                    width={12}
                    height={12}
                    color="#666666"
                    style={{marginLeft: 4}}
                  />
                )}
              </View>
              <Text style={guestbookStyles.commentDate}>
                {new Date(comment.createdAt).toLocaleString('ko-KR')}
              </Text>
            </View>
            {(canEditComment(comment) ||
              canDeleteComment(comment) ||
              isMyGuestbook) && (
              <TouchableOpacity
                onPress={() => openCommentMenu(comment)}
                style={guestbookStyles.menuButton}>
                <DotsVertical width={20} height={36} color="#666666" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={guestbookStyles.commentContent}>{comment.content}</Text>

          {showReplyButton && (
            <TouchableOpacity
              style={guestbookStyles.replyButton}
              onPress={() => handleReplyComment(comment)}>
              <Text style={guestbookStyles.replyButtonText}>답글</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 답글 렌더링 */}
        {comment.child && (
          <View style={{marginLeft: 20, marginTop: 8}}>
            {renderComment(comment.child)}
          </View>
        )}
      </View>
    );
  };

  const renderMenuModal = () => {
    if (!selectedComment) return null;

    const showEdit = canEditComment(selectedComment);
    const showDelete = canDeleteComment(selectedComment);
    const showReport =
      isMyGuestbook && selectedComment.writer.userId !== currentUserId;

    return (
      <Modal
        visible={showMenuModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenuModal(false)}>
        <Pressable
          style={guestbookStyles.modalOverlay}
          onPress={() => setShowMenuModal(false)}>
          <View style={guestbookStyles.menuModal}>
            {showEdit && (
              <TouchableOpacity
                style={guestbookStyles.menuItem}
                onPress={() => handleEditComment(selectedComment)}>
                <Text style={guestbookStyles.menuItemText}>수정하기</Text>
              </TouchableOpacity>
            )}
            {showDelete && (
              <TouchableOpacity
                style={guestbookStyles.menuItem}
                onPress={() => handleDeleteComment(selectedComment.id)}>
                <Text
                  style={[
                    guestbookStyles.menuItemText,
                    guestbookStyles.deleteText,
                  ]}>
                  삭제하기
                </Text>
              </TouchableOpacity>
            )}
            {showReport && (
              <TouchableOpacity
                style={guestbookStyles.menuItem}
                onPress={() => handleReportComment(selectedComment)}>
                <Text
                  style={[
                    guestbookStyles.menuItemText,
                    guestbookStyles.reportText,
                  ]}>
                  신고하기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={guestbookStyles.container}>
      {/* 헤더 */}
      <View style={guestbookStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={guestbookStyles.backButton}>
          <ChevronLeft width={24} height={24} color="#333333" />
        </TouchableOpacity>
        <Text style={guestbookStyles.headerTitle}>
          {userNickname}님의 방명록
        </Text>
        <View style={guestbookStyles.headerRight} />
      </View>

      {/* 댓글 목록 */}
      <ScrollView style={guestbookStyles.commentsContainer}>
        {comments.map(renderComment)}
      </ScrollView>

      {/* 댓글 작성 영역 */}
      <View style={guestbookStyles.inputContainer}>
        <View style={guestbookStyles.inputRow}>
          <TextInput
            style={guestbookStyles.textInput}
            placeholder="안녕하세요 ㅎㅎ!"
            placeholderTextColor="#999999"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={200}
          />

          <TouchableOpacity
            onPress={() => setIsSecret(!isSecret)}
            style={guestbookStyles.secretButtonInInput}>
            {isSecret ? (
              <LockIcon width={20} height={20} color="#007AFF" />
            ) : (
              <UnlockIcon width={20} height={20} color="#666666" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmitComment}
            style={guestbookStyles.submitButton}
            disabled={!newComment.trim()}>
            <Text style={guestbookStyles.submitButtonText}>
              {editingComment ? '수정' : '등록'}
            </Text>
          </TouchableOpacity>
        </View>

        {(editingComment || replyingToComment) && (
          <TouchableOpacity
            onPress={() => {
              setEditingComment(null);
              setReplyingToComment(null);
              setNewComment('');
              setIsSecret(false);
            }}
            style={guestbookStyles.cancelEditButton}>
            <Text style={guestbookStyles.cancelEditText}>
              {editingComment ? '수정 취소' : '답글 취소'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {renderMenuModal()}
    </SafeAreaView>
  );
};

export default GuestbookScreen;
