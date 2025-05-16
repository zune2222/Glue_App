// import React from 'react';
// import {View, Text, Image, TouchableOpacity} from 'react-native';
// import {navigationStyles} from '../styles/groupStyles';

// interface TabBarProps {
//   activeTab: 'board' | 'group' | 'chat' | 'profile';
//   onTabPress: (tabName: 'board' | 'group' | 'chat' | 'profile') => void;
// }

// /**
//  * 하단 탭바 컴포넌트
//  */
// export const BottomTabBar: React.FC<TabBarProps> = ({
//   activeTab,
//   onTabPress,
// }) => {
//   return (
//     <View style={navigationStyles.bottomTabContainer}>
//       <View style={navigationStyles.tabBarRow}>
//         <TouchableOpacity onPress={() => onTabPress('board')}>
//           <Image
//             source={{
//               uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/r1gjjw6u_expires_30_days.png',
//             }}
//             resizeMode={'stretch'}
//             style={navigationStyles.tabHomeIcon}
//           />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={navigationStyles.tabItem}
//           onPress={() => onTabPress('group')}>
//           <Image
//             source={{
//               uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/bf470ttl_expires_30_days.png',
//             }}
//             resizeMode={'stretch'}
//             style={navigationStyles.tabIcon}
//           />
//           <Text
//             style={
//               activeTab === 'group'
//                 ? navigationStyles.tabLabelActive
//                 : navigationStyles.tabLabelInactive
//             }>
//             {'모임글'}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={navigationStyles.tabItem}
//           onPress={() => onTabPress('chat')}>
//           <Image
//             source={{
//               uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/opgy0bkx_expires_30_days.png',
//             }}
//             resizeMode={'stretch'}
//             style={navigationStyles.tabIcon}
//           />
//           <Text
//             style={
//               activeTab === 'chat'
//                 ? navigationStyles.tabLabelActive
//                 : navigationStyles.tabLabelInactive
//             }>
//             {'채팅'}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={navigationStyles.tabItem}
//           onPress={() => onTabPress('profile')}>
//           <Image
//             source={{
//               uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/r6r2ldq6_expires_30_days.png',
//             }}
//             resizeMode={'stretch'}
//             style={navigationStyles.tabIcon}
//           />
//           <Text
//             style={
//               activeTab === 'profile'
//                 ? navigationStyles.tabLabelActive
//                 : navigationStyles.tabLabelInactive
//             }>
//             {'마이'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <View style={navigationStyles.bottomIndicator} />
//     </View>
//   );
// };
