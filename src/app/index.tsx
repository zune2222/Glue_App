import React from 'react';
import {AppProvider} from './providers';
import {AppNavigator} from './providers/navigation';
import {AppModal} from '@/shared/ui/Modal';
import {AppToast} from '@/shared/ui/Toast';

export const App = () => {
  return (
    <AppProvider>
      <AppNavigator />
      <AppModal />
      <AppToast />
    </AppProvider>
  );
};

export default App;
