import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './welcome';
import ProfileNavigator from './profile';

export type AuthStackParamList = {
  Welcome: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Profile" component={ProfileNavigator} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
