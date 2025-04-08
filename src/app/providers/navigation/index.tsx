import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import {
  HomeIcon,
  ChatIcon,
  ProfileIcon,
  SettingsIcon,
} from '../../../widgets/bottomTab/icons';

// 홈/게시판 화면 컴포넌트 임포트
import {
  HomeScreen,
  PostDetailScreen,
  PostCreateScreen,
} from '../../../features/Home';

// 채팅 화면 컴포넌트 임포트
import {ChatListScreen, ChatRoomScreen} from '../../../features/Chat';

// 프로필 화면 컴포넌트 임포트
import {ProfileMainScreen, ProfileEditScreen} from '../../../features/Profile';

// 설정 화면 컴포넌트 임포트
import {SettingsScreen} from '../../../features/Settings';

// 인증 화면 임포트
import {WelcomeScreen, AuthProfileNavigator} from '../../../features/Auth';

// 헤더 컴포넌트 임포트
import {Header} from '../../../widgets/header';

// 알림 패널 임포트
import {NotificationsPanel} from '../../../widgets/notifications';

// 네비게이션 스택 생성
const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const BoardStack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
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
    <BoardStack.Screen
      name="BoardDetail"
      component={PostDetailScreen}
      options={{
        title: '게시글',
        headerBackTitle: '뒤로',
      }}
    />
    <BoardStack.Screen
      name="BoardCreate"
      component={PostCreateScreen}
      options={{
        title: '글 작성하기',
        headerBackTitle: '취소',
      }}
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
    <MessagesStack.Screen
      name="Chat"
      component={ChatRoomScreen}
      options={({route}: any) => ({
        title: route.params?.chatName || '채팅방',
        headerBackTitle: '목록',
      })}
    />
  </MessagesStack.Navigator>
);

// 프로필 스택 네비게이터
const ProfileNavigator = () => (
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
        title: '프로필 수정',
        headerBackTitle: '취소',
      }}
    />
  </ProfileStack.Navigator>
);

// 설정 스택 네비게이터
const SettingsNavigator = () => (
  <SettingsStack.Navigator
    screenOptions={{
      ...commonHeaderOptions,
      headerShown: false,
    }}>
    <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
  </SettingsStack.Navigator>
);

// 인증 스택 네비게이터
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      ...commonHeaderOptions,
      headerShown: false,
    }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Profile" component={AuthProfileNavigator} />
  </AuthStack.Navigator>
);

// 탭 아이콘 컴포넌트 (렌더링 함수 밖에서 정의)
const renderHomeIcon = ({color}: {color: string}) => (
  <HomeIcon color={color} size={28} />
);
const renderChatIcon = ({color}: {color: string}) => (
  <ChatIcon color={color} size={28} />
);
const renderProfileIcon = ({color}: {color: string}) => (
  <ProfileIcon color={color} size={28} />
);
const renderSettingsIcon = ({color}: {color: string}) => (
  <SettingsIcon color={color} size={28} />
);

// 커스텀 헤더 랜더러
const renderHeader = (props: any) => <Header {...props} theme={navTheme} />;

// 메인 탭 네비게이터
const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={{
      // 커스텀 헤더를 사용하여 모든 탭에 동일한 헤더 적용
      header: renderHeader,
      tabBarActiveTintColor: navTheme.colors.primary,
      tabBarInactiveTintColor: '#757575',
      tabBarStyle: tabStyles.tabBar,
    }}>
    <MainTab.Screen
      name="Board"
      component={BoardNavigator}
      options={{
        tabBarLabel: '홈',
        tabBarIcon: renderHomeIcon,
      }}
    />
    <MainTab.Screen
      name="Messages"
      component={MessagesNavigator}
      options={{
        tabBarLabel: '채팅',
        tabBarIcon: renderChatIcon,
      }}
    />
    <MainTab.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{
        tabBarLabel: '프로필',
        tabBarIcon: renderProfileIcon,
      }}
    />
    <MainTab.Screen
      name="Settings"
      component={SettingsNavigator}
      options={{
        tabBarLabel: '설정',
        tabBarIcon: renderSettingsIcon,
      }}
    />
  </MainTab.Navigator>
);

// 탭 스타일
const tabStyles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F0F0F0',
    borderTopWidth: 1,
  },
});

// 메인 네비게이터 (인증 후 진입, 모달 포함)
const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="MainTabs">
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

// 앱 메인 네비게이터
export const AppNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  );
};
