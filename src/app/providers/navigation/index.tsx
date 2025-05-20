import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
// 홈/게시판 화면 컴포넌트 임포트
import {HomeScreen} from '@features/Home';

// 모임글 화면 컴포넌트 임포트
import {GroupList, GroupDetail, GroupSearch} from '@features/Group';

// 채팅 화면 컴포넌트 임포트
import {ChatListScreen, ChatRoomScreen} from '@features/Chat';

// 프로필 화면 컴포넌트 임포트
import {ProfileMainScreen, ProfileEditScreen} from '@features/Profile';

// 인증 화면 임포트
import {
  WelcomeScreen,
  AuthProfileNavigator,
  SignUpScreen,
} from '@features/auth';

// 헤더 컴포넌트 임포트
import {Header} from '@widgets/header';

// 알림 패널 임포트
import {NotificationsScreen} from '@features/notifications';

// SVG 아이콘 컴포넌트 임포트
import {
  HomeIcon,
  GroupIcon,
  ChatIcon,
  ProfileIcon,
} from '@widgets/bottomTab/icons';

// 네비게이션 스택 생성
const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const BoardStack = createNativeStackNavigator();
const GroupStack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();

// 네비게이션 헤더 스타일 정의
const navTheme = {
  colors: {
    primary: '#1CBFDC',
    secondary: '#44FF54',
    background: '#FFFFFF',
    card: '#F8F9FA',
    text: '#212529',
    border: '#E9ECEF',
    notification: '#FF3B30',
  },
};

// 공통 헤더 스타일 옵션
const commonHeaderOptions = {
  headerStyle: {
    backgroundColor: navTheme.colors.primary,
    elevation: 0, // Android 그림자 제거
    shadowOpacity: 0, // iOS 그림자 제거
    borderBottomWidth: 0,
    height: 60,
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '600' as const,
    fontSize: 18,
  },
  headerShadowVisible: false,
};

// 홈/게시판 스택 네비게이터
const BoardNavigator = () => (
  <BoardStack.Navigator screenOptions={commonHeaderOptions}>
    <BoardStack.Screen
      name="BoardList"
      component={HomeScreen}
      options={{headerShown: false}}
    />
  </BoardStack.Navigator>
);

// 메시지 스택 네비게이터
const MessagesNavigator = () => (
  <MessagesStack.Navigator screenOptions={commonHeaderOptions}>
    <MessagesStack.Screen
      name="MessagesList"
      component={ChatListScreen}
      options={{headerShown: false}}
    />
  </MessagesStack.Navigator>
);

// 프로필 스택 네비게이터
const ProfileNavigator = () => {
  const {t} = useTranslation();

  return (
    <ProfileStack.Navigator screenOptions={commonHeaderOptions}>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileMainScreen}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{
          title: t('profile.edit'),
          headerBackTitle: t('common.cancel'),
        }}
      />
    </ProfileStack.Navigator>
  );
};

// 인증 스택 네비게이터
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      ...commonHeaderOptions,
      headerShown: false,
    }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="Profile" component={AuthProfileNavigator} />
  </AuthStack.Navigator>
);

// 모임글 스택 네비게이터
const GroupNavigator = () => {
  const {t} = useTranslation();

  return (
    <GroupStack.Navigator screenOptions={commonHeaderOptions}>
      <GroupStack.Screen
        name="GroupList"
        component={GroupList}
        options={{headerShown: false}}
      />
      <GroupStack.Screen
        name="GroupDetail"
        component={GroupDetail}
        options={{headerShown: false}}
      />
      <GroupStack.Screen
        name="CreateGroup"
        component={GroupList} // 임시로 동일한 컴포넌트 사용, 추후 변경 필요
        options={{
          title: t('group.create'),
          headerBackTitle: t('common.cancel'),
        }}
      />
      <GroupStack.Screen
        name="GroupSearch"
        component={GroupSearch}
        options={{headerShown: false}}
      />
    </GroupStack.Navigator>
  );
};

// 탭 아이콘 컴포넌트 (렌더링 함수 밖에서 정의)
const renderHomeIcon = ({color}: {color: string}) => (
  <HomeIcon color={color} size={28} />
);
const renderGroupIcon = ({color}: {color: string}) => (
  <GroupIcon color={color} size={28} />
);
const renderChatIcon = ({color}: {color: string}) => (
  <ChatIcon color={color} size={28} />
);
const renderProfileIcon = ({color}: {color: string}) => (
  <ProfileIcon color={color} size={28} />
);

// 커스텀 헤더 랜더러
const renderHeader = (props: any) => <Header {...props} theme={navTheme} />;

// 메인 탭 네비게이터
const MainTabNavigator = () => {
  // SafeArea 하단 여백 가져오기
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  return (
    <MainTab.Navigator
      screenOptions={{
        // 커스텀 헤더를 사용하여 모든 탭에 동일한 헤더 적용
        header: renderHeader,
        tabBarActiveTintColor: navTheme.colors.primary,
        tabBarInactiveTintColor: '#9DA2AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0F0F0',
          borderTopWidth: 1,
          paddingBottom: insets.bottom, // 하단 SafeArea 적용
          height: 60 + insets.bottom, // 기본 높이 + 안전 영역
        },
      }}>
      <MainTab.Screen
        name="Board"
        component={BoardNavigator}
        options={{
          tabBarLabel: t('home.title'),
          tabBarIcon: renderHomeIcon,
        }}
      />
      <MainTab.Screen
        name="Group"
        component={GroupNavigator}
        options={{
          tabBarLabel: t('group.title'),
          tabBarIcon: renderGroupIcon,
        }}
      />
      <MainTab.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{
          tabBarLabel: t('messages.title'),
          tabBarIcon: renderChatIcon,
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: t('profile.title'),
          tabBarIcon: renderProfileIcon,
        }}
      />
    </MainTab.Navigator>
  );
};

// 메인 네비게이터 (인증 후 진입)
const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="MainTabs">
    <MainStack.Screen name="MainTabs" component={MainTabNavigator} />
    <MainStack.Screen
      name="NotificationsScreen"
      component={NotificationsScreen}
    />
  </MainStack.Navigator>
);

// 앱 메인 네비게이터
export const AppNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainNavigator} />
      <RootStack.Screen name="Chat" component={ChatRoomScreen} />
    </RootStack.Navigator>
  );
};
