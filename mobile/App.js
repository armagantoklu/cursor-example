import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import * as Device from 'expo-device';

// Platform bilgilerini logla
console.log('Device Info:', {
  brand: Device.brand,
  modelName: Device.modelName,
  osName: Device.osName,
  osVersion: Device.osVersion
});

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
} 