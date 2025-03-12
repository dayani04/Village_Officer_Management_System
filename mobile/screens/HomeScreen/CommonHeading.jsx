import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CommonHeading({ heading, title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{heading}</Text>
      <Text style={styles.mainTitle}>
        {subtitle}{" "}
        <Text style={styles.title}>{title}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 30,
  },
  sectionTitle: {
    textAlign: "center",
    textTransform: "uppercase",
    color: "#921940",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mainTitle: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  title: {
    color: "#921940",
    textTransform: "uppercase",
  },
});
