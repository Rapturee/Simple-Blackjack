import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BlackjackScreen from './screens/BlackjackScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Blackjack">
        <Stack.Screen name="Blackjack" component={BlackjackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
