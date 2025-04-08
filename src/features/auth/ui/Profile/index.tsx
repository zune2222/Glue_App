import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NameInputScreen from './NameInput';
import NicknameInputScreen from './NicknameInput';
import GenderSelectScreen from './GenderSelect';
import ProfileCompleteScreen from './ProfileComplete';

export type ProfileStackParamList = {
  NameInput: undefined;
  NicknameInput: {name: string};
  GenderSelect: {name: string; nickname: string};
  ProfileComplete: {name: string; nickname: string; gender: string};
};

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="NameInput"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: 'white'},
      }}>
      <Stack.Screen name="NameInput" component={NameInputScreen} />
      <Stack.Screen name="NicknameInput" component={NicknameInputScreen} />
      <Stack.Screen name="GenderSelect" component={GenderSelectScreen} />
      <Stack.Screen name="ProfileComplete" component={ProfileCompleteScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
