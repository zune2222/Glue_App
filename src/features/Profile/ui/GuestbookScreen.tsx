import React, {useState} from 'react';
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

interface GuestbookScreenProps {
  route: {
    params: {
      userId: number;
      userNickname: string;
    };
  };
  navigation: any;
}

interface GuestbookComment {
  id: number;
  authorId: number;
  authorNickname: string;
  authorProfileImage: string | null;
  content: string;
  isSecret: boolean;
  createdAt: string;
  updatedAt?: string;
}

// 임시 데이터 (현재 로그인한 사용자 ID)
const CURRENT_USER_ID = 2;

// 임시 방명록 데이터
const mockGuestbookData: GuestbookComment[] = [
  {
    id: 1,
    authorId: 2,
    authorNickname: '신희수',
    authorProfileImage: null,
    content: '안녕하세요! 언어교환 열심히 해봐요~',
    isSecret: false,
    createdAt: '2024.04.15 14:30',
  },
  {
    id: 2,
    authorId: 3,
    authorNickname: '김민수',
    authorProfileImage: null,
    content: '비밀 댓글입니다.',
    isSecret: true,
    createdAt: '2024.04.16 09:15',
  },
  {
    id: 3,
    authorId: 1,
    authorNickname: '김글루',
    authorProfileImage: null,
    content: '감사합니다! 잘 부탁드려요 😊',
    isSecret: false,
    createdAt: '2024.04.16 10:20',
  },
];

const GuestbookScreen: React.FC<GuestbookScreenProps> = ({
  route,
  navigation,
}) => {
  const {userId, userNickname} = route.params;
  const [comments, setComments] =
    useState<GuestbookComment[]>(mockGuestbookData);
  const [newComment, setNewComment] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [editingComment, setEditingComment] = useState<GuestbookComment | null>(
    null,
  );
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedComment, setSelectedComment] =
    useState<GuestbookComment | null>(null);

  const isMyGuestbook = userId === CURRENT_USER_ID;

  const canViewComment = (comment: GuestbookComment) => {
    if (!comment.isSecret) return true;
    return comment.authorId === CURRENT_USER_ID || userId === CURRENT_USER_ID;
  };

  const canEditComment = (comment: GuestbookComment) => {
    return comment.authorId === CURRENT_USER_ID;
  };

  const canDeleteComment = (comment: GuestbookComment) => {
    return comment.authorId === CURRENT_USER_ID || isMyGuestbook;
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: GuestbookComment = {
      id: Date.now(),
      authorId: CURRENT_USER_ID,
      authorNickname: '신희수', // 현재 사용자 닉네임
      authorProfileImage: null,
      content: newComment.trim(),
      isSecret,
      createdAt:
        new Date()
          .toLocaleDateString('ko-KR')
          .replace(/\./g, '.')
          .slice(0, -1) +
        ' ' +
        new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
    };

    if (editingComment) {
      setComments(prev =>
        prev.map(c =>
          c.id === editingComment.id
            ? {...comment, id: editingComment.id, updatedAt: comment.createdAt}
            : c,
        ),
      );
      setEditingComment(null);
    } else {
      setComments(prev => [comment, ...prev]);
    }

    setNewComment('');
    setIsSecret(false);
  };

  const handleEditComment = (comment: GuestbookComment) => {
    setEditingComment(comment);
    setNewComment(comment.content);
    setIsSecret(comment.isSecret);
    setShowMenuModal(false);
  };

  const handleDeleteComment = (commentId: number) => {
    Alert.alert('삭제 확인', '정말로 이 방명록을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          setComments(prev => prev.filter(c => c.id !== commentId));
          setShowMenuModal(false);
        },
      },
    ]);
  };

  const handleReportComment = (_comment: GuestbookComment) => {
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

  const handleReplyComment = (comment: GuestbookComment) => {
    // 답글 작성 기능 - 일단 입력창에 @닉네임을 추가
    setNewComment(`@${comment.authorNickname} `);
  };

  const openCommentMenu = (comment: GuestbookComment) => {
    setSelectedComment(comment);
    setShowMenuModal(true);
  };

  const renderComment = (comment: GuestbookComment) => {
    if (!canViewComment(comment)) {
      return (
        <View key={comment.id} style={guestbookStyles.commentItem}>
          <Text style={guestbookStyles.secretCommentTitle}>
            비밀 방명록입니다.
          </Text>
          <Text style={guestbookStyles.secretCommentDate}>
            {comment.createdAt}
          </Text>
        </View>
      );
    }

    const isMyComment = comment.authorId === CURRENT_USER_ID;
    const showReplyButton =
      isMyGuestbook && comment.authorId !== CURRENT_USER_ID;

    return (
      <View
        key={comment.id}
        style={
          isMyComment
            ? guestbookStyles.myCommentItem
            : guestbookStyles.commentItem
        }>
        <View style={guestbookStyles.commentHeader}>
          <Image source={dummyProfile} style={guestbookStyles.profileImage} />
          <View style={guestbookStyles.commentInfo}>
            <View style={guestbookStyles.authorRow}>
              <Text style={guestbookStyles.authorName}>
                {comment.authorNickname}
              </Text>
              {comment.isSecret && (
                <LockIcon
                  width={12}
                  height={12}
                  color="#666666"
                  style={{marginLeft: 4}}
                />
              )}
            </View>
            <Text style={guestbookStyles.commentDate}>{comment.createdAt}</Text>
            {comment.updatedAt && (
              <Text style={guestbookStyles.editedText}>수정됨</Text>
            )}
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
    );
  };

  const renderMenuModal = () => {
    if (!selectedComment) return null;

    const showEdit = canEditComment(selectedComment);
    const showDelete = canDeleteComment(selectedComment);
    const showReport =
      isMyGuestbook && selectedComment.authorId !== CURRENT_USER_ID;

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

        {editingComment && (
          <TouchableOpacity
            onPress={() => {
              setEditingComment(null);
              setNewComment('');
              setIsSecret(false);
            }}
            style={guestbookStyles.cancelEditButton}>
            <Text style={guestbookStyles.cancelEditText}>수정 취소</Text>
          </TouchableOpacity>
        )}
      </View>

      {renderMenuModal()}
    </SafeAreaView>
  );
};

export default GuestbookScreen;
