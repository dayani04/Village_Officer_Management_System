import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.section}>
        <View style={styles.column}>
          <Text style={styles.heading}>ශ්‍රී ලංකා ග්‍රාම සේවක</Text>
          <Text style={styles.heading}>கிராம அதிகாரி</Text>
          <Text style={styles.heading}>Village officers of Sri Lanka</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.heading}>Useful Links</Text>
          <TouchableOpacity onPress={() => Linking.openURL('AboutUs')}>
            <Text style={styles.link}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('#')}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('ContactUs')}>
            <Text style={styles.link}>Contact Details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('VillageOfficerDashBoard')}>
            <Text style={styles.link}>Help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.column}>
          <Text style={styles.heading}>Contact</Text>
          <Text style={styles.text}>New York, NY 10012, US</Text>
          <Text style={styles.text}>info@gmail.com</Text>
          <Text style={styles.text}>+ 01 234 567 88</Text>
          <Text style={styles.text}>+ 01 234 567 89</Text>
        </View>
      </View>

      <View style={styles.footerBottom}>
        <Text style={styles.footerText}>© 2024 Copyright</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 20,
    backgroundColor: "#9C284F",
    paddingBottom: 10,
  },
  section: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  column: {
    flex: 1,
    margin: 10,
  },
  heading: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  link: {
    color: "white",
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  text: {
    color: "white",
    marginBottom: 5,
  },
  footerBottom: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: "white",
    fontSize: 12,
  },
});

export default Footer;
