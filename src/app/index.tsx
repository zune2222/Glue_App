import React from 'react';
import {AppProvider} from './providers';
import RootNavigator from '../pages';

const App = () => {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
};

export default App;
