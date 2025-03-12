import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const services = [
  { id: 1, name: "Apply To Election", description: "Register to vote and ensure your name is included in the electoral list for upcoming elections." },
  { id: 2, name: "Apply To Allowances", description: "Submit applications for government allowances and financial assistance programs." },
  { id: 3, name: "Apply To Certificate", description: "Request official village officer certificates for various legal and personal purposes." },
  { id: 4, name: "Apply To ID Card", description: "Apply for a temporary or permanent National Identity Card easily through the system." },
  { id: 5, name: "Apply To Permits", description: "Obtain necessary permits for land, business, and more official requirements." },
  { id: 6, name: "Found Village Notification", description: "Stay updated with important announcements and notices from the village office." },
];

export default function Services() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Our Services</Text>
      <View style={styles.serviceList}>
        {services.map((item) => (
          <TouchableOpacity key={item.id} style={styles.serviceItem} activeOpacity={0.7}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#921940",
    textAlign: "center",
    marginBottom: 15,
  },
  serviceList: {
    flexDirection: "column",
    alignItems: "center",
  },
  serviceItem: {
    width: "90%",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f6d7ef",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f6d7ef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#921940",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
  },
});
