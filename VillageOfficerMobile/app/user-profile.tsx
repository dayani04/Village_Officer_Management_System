import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserProfileScreen from '../src/screens/user/UserProfileScreen';

export default function UserProfilePage() {
  return (
    <View style={styles.container}>
      <UserProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
