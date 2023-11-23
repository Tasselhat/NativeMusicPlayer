import React from 'react';
import { StatusBar } from 'react-native';

import { Provider } from 'src/provider';
import { Screens } from 'src/screens';

export const App = () => {
  return (
    <Provider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Screens />
    </Provider>
  );
};