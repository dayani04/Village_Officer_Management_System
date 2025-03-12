import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const NavBar = () => {
  const navigation = useNavigation(); // Get navigation object

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./flag.png')} style={styles.flagLogo} />
        <Image source={require('./emblem.png')} style={styles.emblemLogo} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ශ්‍රී ලංකා ග්‍රාම සේවක</Text>
          <Text style={styles.subtitle}>கிராம அதிகாரி</Text>
          <Text style={styles.subtitle}>Village officers of Sri Lanka</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UserDashboardScreen')}>
          <Text style={styles.menuText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#9C284F',
  },
  flagLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  emblemLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  menu: {
    backgroundColor: '#9C284F',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  menuItem: {
    marginHorizontal: 15,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NavBar;
 