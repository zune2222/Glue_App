/**
 * @format
 */

import 'text-encoding-polyfill';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

// Background FCM 메시지 핸들러 등록 (앱이 백그라운드에 있을 때)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background FCM 메시지 수신:', remoteMessage);
  // 필요에 따라 로컬 알림 표시나 데이터 처리 수행
});

AppRegistry.registerComponent(appName, () => App);
