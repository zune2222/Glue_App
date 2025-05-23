import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Text} from '@shared/ui/typography';
import {userProfileDetailStyles} from '@features/Profile/ui/styles/userProfileDetailStyles';
import {
  ChevronLeft,
  dummyProfile,
  UserIcon,
  SchoolIcon,
} from '@shared/assets/images';

interface UserProfileDetailProps {
  route: {
    params: {
      userId: number;
    };
  };
  navigation: any;
}

interface UserProfileData {
  userId: number;
  userNickname: string;
  profileImageUrl: string | null;
  description: string;
  gender: number; // 1: 남성, 2: 여성
  age: number;
  school: string;
  major: string;
  systemLanguage: string;
  languageMain: string;
  languageMainLevel: string;
  languageLearn: string;
  languageLearnLevel: string;
}

// 임시 데이터 (추후 API 호출로 대체)
const mockUserData: UserProfileData = {
  userId: 1,
  userNickname: '김글루',
  profileImageUrl: null,
  description: '안녕하세요~ 잘 부탁드립니다😊',
  gender: 2,
  age: 23,
  school: '부산대학교',
  major: '국어국문학과',
  systemLanguage: '한국어',
  languageMain: '한국어',
  languageMainLevel: '초급',
  languageLearn: '영어',
  languageLearnLevel: '초보',
};

const UserProfileDetail: React.FC<UserProfileDetailProps> = ({
  route,
  navigation,
}) => {
  const {userId} = route.params;
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        // 임시로 1초 후 데이터 로드
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUserProfile(mockUserData);
      } catch (error) {
        console.error('사용자 프로필 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const renderProfileImage = () => {
    if (userProfile?.profileImageUrl) {
      return (
        <Image
          source={{uri: userProfile.profileImageUrl}}
          style={userProfileDetailStyles.profileImage}
        />
      );
    } else {
      // 기본 아바타 이미지 (dummyProfile 사용)
      return (
        <Image
          source={dummyProfile}
          style={userProfileDetailStyles.profileImage}
        />
      );
    }
  };

  const getGenderText = (gender: number) => {
    return gender === 1 ? '남성' : '여성';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={userProfileDetailStyles.container}>
        <View style={userProfileDetailStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={userProfileDetailStyles.backButton}>
            <ChevronLeft width={24} height={24} color="#333333" />
          </TouchableOpacity>
        </View>
        <View style={userProfileDetailStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#384050" />
        </View>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={userProfileDetailStyles.container}>
        <View style={userProfileDetailStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={userProfileDetailStyles.backButton}>
            <ChevronLeft width={24} height={24} color="#333333" />
          </TouchableOpacity>
        </View>
        <View style={userProfileDetailStyles.errorContainer}>
          <Text style={userProfileDetailStyles.errorText}>
            사용자 정보를 불러올 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={userProfileDetailStyles.container}>
      {/* 헤더 */}
      <View style={userProfileDetailStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={userProfileDetailStyles.backButton}>
          <ChevronLeft width={24} height={24} color="#333333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={userProfileDetailStyles.scrollContainer}>
        {/* 프로필 이미지 */}
        <View style={userProfileDetailStyles.profileSection}>
          {renderProfileImage()}
        </View>

        {/* 사용자 기본 정보 */}
        <View style={userProfileDetailStyles.basicInfoSection}>
          <Text style={userProfileDetailStyles.userName}>
            {userProfile.userNickname}
          </Text>
          <Text style={userProfileDetailStyles.description}>
            {userProfile.description}
          </Text>

          {/* 성별, 나이 */}
          <View style={userProfileDetailStyles.infoRow}>
            <View style={userProfileDetailStyles.infoItem}>
              <UserIcon width={20} height={20} color="#666666" />
              <Text style={userProfileDetailStyles.infoText}>
                {getGenderText(userProfile.gender)}, {userProfile.age}세
              </Text>
            </View>
          </View>

          {/* 학교, 전공 */}
          <View style={userProfileDetailStyles.infoRow}>
            <View style={userProfileDetailStyles.infoItem}>
              <SchoolIcon width={20} height={20} color="#666666" />
              <Text style={userProfileDetailStyles.infoText}>
                {userProfile.school} {userProfile.major}
              </Text>
            </View>
          </View>
        </View>

        {/* 언어 정보 */}
        <View style={userProfileDetailStyles.languageSection}>
          <Text style={userProfileDetailStyles.sectionTitle}>언어</Text>

          <View style={userProfileDetailStyles.languageContainer}>
            <View style={userProfileDetailStyles.languageColumn}>
              <View style={userProfileDetailStyles.languageItem}>
                <Text style={userProfileDetailStyles.languageLabel}>
                  사용 언어
                </Text>
                <Text style={userProfileDetailStyles.languageValue}>
                  {userProfile.languageMain}
                </Text>
              </View>

              <View style={userProfileDetailStyles.languageItem}>
                <Text style={userProfileDetailStyles.languageLabel}>
                  언어 수준
                </Text>
                <Text style={userProfileDetailStyles.languageValue}>
                  {userProfile.languageMainLevel}
                </Text>
              </View>
            </View>

            <View style={userProfileDetailStyles.languageColumn}>
              <View style={userProfileDetailStyles.languageItem}>
                <Text style={userProfileDetailStyles.languageLabel}>
                  교환 언어
                </Text>
                <Text style={userProfileDetailStyles.languageValue}>
                  {userProfile.languageLearn}
                </Text>
              </View>

              <View style={userProfileDetailStyles.languageItem}>
                <Text style={userProfileDetailStyles.languageLabel}>
                  언어 수준
                </Text>
                <Text style={userProfileDetailStyles.languageValue}>
                  {userProfile.languageLearnLevel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 사용자 정보 섹션 */}
        <View style={userProfileDetailStyles.userInfoSection}>
          <Text style={userProfileDetailStyles.sectionTitle}>
            {userProfile.userNickname} 님의 정보
          </Text>

          <TouchableOpacity style={userProfileDetailStyles.menuItem}>
            <Text style={userProfileDetailStyles.menuText}>모임 히스토리</Text>
          </TouchableOpacity>

          <TouchableOpacity style={userProfileDetailStyles.menuItem}>
            <Text style={userProfileDetailStyles.menuText}>참여 중인 모임</Text>
          </TouchableOpacity>

          <TouchableOpacity style={userProfileDetailStyles.menuItem}>
            <Text style={userProfileDetailStyles.menuText}>좋아요 목록</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={userProfileDetailStyles.menuItem}
            onPress={() =>
              navigation.navigate('Guestbook', {
                userId: userProfile.userId,
                userNickname: userProfile.userNickname,
              })
            }>
            <Text style={userProfileDetailStyles.menuText}>방명록</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileDetail;
