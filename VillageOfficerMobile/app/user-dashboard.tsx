import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserDashboardScreen from '../src/screens/user/UserDashboardScreen';

export default function UserDashboardPage() {
  return (
    <View style={styles.container}>
      <UserDashboardScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
