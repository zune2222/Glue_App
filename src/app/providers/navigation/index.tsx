import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text} from 'react-native';

// 홈/게시판 화면 컴포넌트 임포트
import {
  HomeScreen,
  PostDetailScreen,
  PostCreateScreen,
} from '../../../pages/home';

// 채팅 화면 컴포넌트 임포트
import {ChatListScreen, ChatRoomScreen} from '../../../pages/chat';

// 프로필 화면 컴포넌트 임포트
import {ProfileMainScreen, ProfileEditScreen} from '../../../pages/profile';

// 설정 화면 컴포넌트 임포트
import {SettingsScreen} from '../../../pages/settings';

// 인증 화면 임포트
import WelcomeScreen from '../../../pages/auth/welcome';

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

// 홈/게시판 스택 네비게이터
const BoardNavigator = () => (
  <BoardStack.Navigator>
    <BoardStack.Screen
      name="BoardList"
      component={HomeScreen}
      options={{headerShown: false}}
    />
    <BoardStack.Screen name="BoardDetail" component={PostDetailScreen} />
    <BoardStack.Screen name="BoardCreate" component={PostCreateScreen} />
  </BoardStack.Navigator>
);

// 메시지 스택 네비게이터
const MessagesNavigator = () => (
  <MessagesStack.Navigator>
    <MessagesStack.Screen
      name="MessagesList"
      component={ChatListScreen}
      options={{headerShown: false}}
    />
    <MessagesStack.Screen name="Chat" component={ChatRoomScreen} />
  </MessagesStack.Navigator>
);

// 프로필 스택 네비게이터
const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileMainScreen}
      options={{headerShown: false}}
    />
    <ProfileStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
  </ProfileStack.Navigator>
);

// 설정 스택 네비게이터
const SettingsNavigator = () => (
  <SettingsStack.Navigator screenOptions={{headerShown: false}}>
    <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
  </SettingsStack.Navigator>
);

// 인증 스택 네비게이터
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
  </AuthStack.Navigator>
);

// 메인 탭 네비게이터
const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={{
      // 커스텀 헤더를 사용하여 모든 탭에 동일한 헤더 적용
      header: props => <Header {...props} />,
      tabBarActiveTintColor: '#44FF54',
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
        tabBarLabel: '홈',
        tabBarIcon: ({color}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color, fontSize: 24}}>🏠</Text>
          </View>
        ),
      }}
    />
    <MainTab.Screen
      name="Messages"
      component={MessagesNavigator}
      options={{
        tabBarLabel: '채팅',
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
    <MainTab.Screen
      name="Settings"
      component={SettingsNavigator}
      options={{
        tabBarLabel: '설정',
        tabBarIcon: ({color}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color, fontSize: 24}}>⚙️</Text>
          </View>
        ),
      }}
    />
  </MainTab.Navigator>
);

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
