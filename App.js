import React from 'react';
import Weather from './Weather';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Weather">
      <Stack.Screen name="Weather" component={Weather}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}
