import React from 'react';
import { View } from 'react-native';
import SecretaryDashboardScreen from '@/src/screens/secretary/SecretaryDashboardScreen';

export default function SecretaryDashboard() {
  console.log('Secretary Dashboard wrapper loaded');
  
  return (
    <View style={{ flex: 1 }}>
      <SecretaryDashboardScreen />
    </View>
  );
}
