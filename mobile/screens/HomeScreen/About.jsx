import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import about1 from './about1.jpg';
import about2 from './about2.jpg';
import about3 from './about3.jpg';
import about4 from './about4.jpg';

export default function About() {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textSection}>
          <Text style={styles.title}>About Us</Text>
          <Text style={styles.subtitle}>
            Welcome to{" "}
            <Text style={styles.boldText}>Village Officer Management System</Text>
          </Text>
          <Text style={styles.description}>
            Our website provides a convenient and fast solution for accessing village officer services. Register and fulfill your needs easily.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Explore More</Text>
          </TouchableOpacity>
        </View>

        {/* Image Section with Flex Wrap */}
        <View style={styles.imageSection}>
          <View style={styles.imageRow}>
            <Image source={about1} style={styles.imageSmall} />
            <Image source={about2} style={styles.imageSmall} />
          </View>
          <View style={styles.imageRow}>
            <Image source={about3} style={styles.imageSmall} />
            <Image source={about4} style={styles.imageSmall} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20, // For some extra space at the bottom
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    flexWrap: 'wrap', // Allows the text and image sections to wrap
  },
  textSection: {
    flex: 1,
    justifyContent: "center",
    marginRight: 20, // Added margin to prevent text section from being too close to images
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#921940",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#921940",
  },
  boldText: {
    color: "#921940",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#921940",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center", // Centers the button text
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imageSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap", // Ensure images wrap responsively
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "center", // Centers the images in each row
    marginBottom: 15,
  },
  image: {
    width: "48%", // Adjust image size to fit two in a row
    height: 150,
    marginRight: 10, // Adds space between images
    borderRadius: 8,
  },
  imageSmall: {
    width: "48%", // Adjust image size for smaller ones
    height: 100,
    marginRight: 10, // Adds space between images
    borderRadius: 8,
  },
});
