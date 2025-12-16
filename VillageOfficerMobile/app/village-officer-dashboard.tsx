import React from 'react';
import { View, StyleSheet } from 'react-native';
import VillageOfficerDashboardScreen from '@/src/screens/village-officer/VillageOfficerDashboardScreen';

console.log('VillageOfficerDashboardPage wrapper loaded successfully!');

export default function VillageOfficerDashboardPage() {
  console.log('VillageOfficerDashboardPage rendering...');
  return (
    <View style={styles.container}>
      <VillageOfficerDashboardScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
