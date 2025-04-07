import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// 실제 구현 시에는 각 페이지 컴포넌트를 불러와야 함
// 예제를 위한 임시 컴포넌트들
const LoginScreen = () => <></>;
const RegisterScreen = () => <></>;
const BoardScreen = () => <></>;
const BoardDetailScreen = () => <></>;
const BoardCreateScreen = () => <></>;
const MessagesScreen = () => <></>;
const ChatScreen = () => <></>;
const ProfileScreen = () => <></>;
const ProfileEditScreen = () => <></>;
const NotificationsPanel = () => <></>;

// 헤더 컴포넌트 (실제 구현 시 import)
const Header = (props: any) => <></>;

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
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// 메인 탭 네비게이터
const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={{
      // 커스텀 헤더를 사용하여 모든 탭에 동일한 헤더 적용
      header: props => <Header {...props} />,
    }}>
    <MainTab.Screen name="Board" component={BoardNavigator} />
    <MainTab.Screen name="Messages" component={MessagesNavigator} />
    <MainTab.Screen name="Profile" component={ProfileNavigator} />
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

// 앱 메인 네비게이터
export const AppNavigator = () => {
  // 인증 상태 확인 (실제로는 훅이나 컨텍스트에서 가져옴)
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <RootStack.Screen name="Main" component={MainNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
