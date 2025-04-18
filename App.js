import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import { auth } from './src/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import GradientBackground from './src/components/GradientBackground';

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <SafeAreaProvider>
        <GradientBackground />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <GradientBackground>
            <AppNavigator user={user} />
            <StatusBar style="light" />
          </GradientBackground>
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
