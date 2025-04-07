import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// 공통 컴포넌트
import {View, Text, Image} from 'react-native';

// 인증 화면들 - 실제 구현 컴포넌트 import
import WelcomeScreen from '../../../pages/auth/welcome';
import LoginScreen from '../../../pages/auth/login';
import RegisterScreen from '../../../pages/auth/register';

// 실제 구현 시에는 각 페이지 컴포넌트를 불러와야 함
// 예제를 위한 임시 컴포넌트들
const BoardScreen = () => {
  // 예시 게시글 데이터
  const boardItems = [
    {
      id: 1,
      title: '오늘의 공지사항입니다.',
      author: '관리자',
      date: '2023-07-15',
      views: 128,
    },
    {
      id: 2,
      title: '리액트 네이티브 스터디 모집',
      author: '개발자',
      date: '2023-07-14',
      views: 85,
    },
    {
      id: 3,
      title: '앱 업데이트 관련 안내',
      author: '관리자',
      date: '2023-07-13',
      views: 224,
    },
    {
      id: 4,
      title: 'FSD 패턴 적용 방법',
      author: '아키텍트',
      date: '2023-07-10',
      views: 156,
    },
    {
      id: 5,
      title: '사용자 경험 개선 제안',
      author: '디자이너',
      date: '2023-07-09',
      views: 92,
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      {boardItems.map(item => (
        <View
          key={item.id}
          style={{
            backgroundColor: 'white',
            margin: 8,
            padding: 16,
            borderRadius: 8,
            elevation: 2,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
            {item.title}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: '#757575', fontSize: 12}}>{item.author}</Text>
            <Text style={{color: '#757575', fontSize: 12}}>
              {item.date} • 조회 {item.views}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const BoardDetailScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text>게시글 상세 화면</Text>
  </View>
);

const BoardCreateScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text>게시글 작성 화면</Text>
  </View>
);

const MessagesScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text>메시지 목록 화면</Text>
  </View>
);

const ChatScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text>채팅 화면</Text>
  </View>
);

const ProfileScreen = () => {
  // 사용자 데이터 (실제 구현 시에는 API나 컨텍스트에서 데이터를 가져옴)
  const user = {
    id: 1,
    username: '강개발',
    email: 'user@example.com',
    profileImage: '👤', // 실제로는 이미지 URL이 들어감
    joinDate: '2023-05-10',
    posts: 15,
    comments: 42,
    followers: 128,
    following: 99,
    bio: '리액트 네이티브와 FSD 패턴으로 앱을 개발하고 있습니다. 디자인과 개발에 관심이 많습니다.',
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      {/* 상단 프로필 섹션 */}
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#EEEEEE',
        }}>
        <Text style={{fontSize: 48, marginBottom: 10}}>
          {user.profileImage}
        </Text>
        <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 5}}>
          {user.username}
        </Text>
        <Text style={{color: '#757575', marginBottom: 15}}>{user.email}</Text>

        <Text style={{textAlign: 'center', marginBottom: 15}}>{user.bio}</Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>{user.posts}</Text>
            <Text style={{color: '#757575'}}>게시글</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>{user.followers}</Text>
            <Text style={{color: '#757575'}}>팔로워</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>{user.following}</Text>
            <Text style={{color: '#757575'}}>팔로잉</Text>
          </View>
        </View>
      </View>

      {/* 설정 옵션 */}
      <View
        style={{
          backgroundColor: 'white',
          marginTop: 15,
          borderRadius: 8,
          margin: 10,
        }}>
        <View
          style={{
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#EEEEEE',
          }}>
          <Text>계정 설정</Text>
        </View>
        <View
          style={{
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#EEEEEE',
          }}>
          <Text>알림 설정</Text>
        </View>
        <View
          style={{
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#EEEEEE',
          }}>
          <Text>개인정보 보호</Text>
        </View>
        <View style={{padding: 15}}>
          <Text>로그아웃</Text>
        </View>
      </View>
    </View>
  );
};

const ProfileEditScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text>프로필 수정 화면</Text>
  </View>
);

const NotificationsPanel = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text>알림 패널</Text>
  </View>
);

// 헤더 컴포넌트 (실제 구현 시 import)
const Header = (props: any) => (
  <View
    style={{
      height: 60,
      backgroundColor: '#FF5722', // 더 눈에 띄는 주황색으로 변경
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>
      {props.route.name === 'Board'
        ? '게시판'
        : props.route.name === 'Messages'
        ? '메시지'
        : props.route.name === 'Profile'
        ? '프로필'
        : props.route.name}
    </Text>
  </View>
);

const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const BoardStack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();

// 게시판 스택 네비게이터
const BoardNavigator = () => (
  <BoardStack.Navigator>
    <BoardStack.Screen name="BoardList" component={BoardScreen} />
    <BoardStack.Screen name="BoardDetail" component={BoardDetailScreen} />
    <BoardStack.Screen name="BoardCreate" component={BoardCreateScreen} />
  </BoardStack.Navigator>
);

// 메시지 스택 네비게이터
const MessagesNavigator = () => (
  <MessagesStack.Navigator>
    <MessagesStack.Screen name="MessagesList" component={MessagesScreen} />
    <MessagesStack.Screen name="Chat" component={ChatScreen} />
  </MessagesStack.Navigator>
);

// 프로필 스택 네비게이터
const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
  </ProfileStack.Navigator>
);

// 인증 스택 네비게이터
const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{headerShown: false}}
    />
  </AuthStack.Navigator>
);

// 메인 탭 네비게이터
const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={{
      // 커스텀 헤더를 사용하여 모든 탭에 동일한 헤더 적용
      header: props => <Header {...props} />,
      tabBarActiveTintColor: '#FF5722',
      tabBarInactiveTintColor: '#757575',
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
      },
    }}>
    <MainTab.Screen
      name="Board"
      component={BoardNavigator}
      options={{
        tabBarLabel: '게시판',
        tabBarIcon: ({color}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color, fontSize: 24}}>📋</Text>
          </View>
        ),
      }}
    />
    <MainTab.Screen
      name="Messages"
      component={MessagesNavigator}
      options={{
        tabBarLabel: '메시지',
        tabBarIcon: ({color}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color, fontSize: 24}}>💬</Text>
          </View>
        ),
      }}
    />
    <MainTab.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{
        tabBarLabel: '프로필',
        tabBarIcon: ({color}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color, fontSize: 24}}>👤</Text>
          </View>
        ),
      }}
    />
  </MainTab.Navigator>
);

// 메인 네비게이터 (인증 후 진입, 모달 포함)
const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{headerShown: false}}>
    <MainStack.Screen name="MainTabs" component={MainTabNavigator} />
    {/* 알림 패널을 모달로 표시 */}
    <MainStack.Group screenOptions={{presentation: 'modal'}}>
      <MainStack.Screen
        name="NotificationsPanel"
        component={NotificationsPanel}
      />
    </MainStack.Group>
  </MainStack.Navigator>
);

// 앱 메인 네비게이터 - NavigationContainer 제거
export const AppNavigator = () => {
  // 인증 상태 확인 (실제로는 훅이나 컨텍스트에서 가져옴)
  const isAuthenticated = false; // 테스트를 위해 false로 설정

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <RootStack.Screen name="Main" component={MainNavigator} />
      )}
    </RootStack.Navigator>
  );
};
