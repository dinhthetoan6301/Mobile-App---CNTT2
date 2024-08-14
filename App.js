import React from 'react';
import { AppProvider } from './src/context/AppContext';
import RootStack from './navigators/RootStack';
import AuthCheck from './src/components/AuthCheck';

export default function App() {
  return (
    <AppProvider>
      <AuthCheck />
      <RootStack />
    </AppProvider>
  );
}