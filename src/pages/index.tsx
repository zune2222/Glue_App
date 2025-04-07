import React from 'react';
import AuthNavigator from './auth';

const RootNavigator = () => {
  // 실제 앱에서는 여기서 인증 상태를 확인하고 홈 또는 인증 화면으로 분기
  const isLoggedIn = false;

  return isLoggedIn ? <HomeNavigator /> : <AuthNavigator />;
};

// 실제 홈 네비게이터는 별도로 구현해야 함
const HomeNavigator = () => {
  return <AuthNavigator />;
};

export default RootNavigator;
