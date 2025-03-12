// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import DetailsScreen from './screens/User/UserDetailsScreen';
import UserDashboardScreen from './screens/User/UserDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="UserDashboardScreen" component={UserDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
