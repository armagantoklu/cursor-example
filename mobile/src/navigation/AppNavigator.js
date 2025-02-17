import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Device from 'expo-device';
import LoginScreen from '../screens/LoginScreen';
import ExamListScreen from '../screens/ExamListScreen';
import ExamTakerScreen from '../screens/ExamTakerScreen';
import FormBuilder from '../components/FormBuilder';

const Stack = createStackNavigator();

const isTablet = async () => {
  return await Device.getDeviceTypeAsync() === Device.DeviceType.TABLET;
};

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: '#007AFF',
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ExamList" 
        component={ExamListScreen}
        options={({ route }) => ({
          title: route.params?.user?.role === 'teacher' ? 'Öğretmen Paneli' : 'Öğrenci Paneli',
          headerLeft: null
        })}
      />
      <Stack.Screen 
        name="ExamTaker" 
        component={ExamTakerScreen}
        options={{
          title: 'Sınav',
          headerBackTitle: 'Geri'
        }}
      />
      <Stack.Screen 
        name="FormBuilder" 
        component={FormBuilder}
        options={{
          title: 'Yeni Sınav',
          headerBackTitle: 'Geri'
        }}
      />
    </Stack.Navigator>
  );
} 