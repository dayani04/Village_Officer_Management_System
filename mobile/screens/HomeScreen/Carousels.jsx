import React, { useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";  // Ensure proper import
import home1 from "./home1.jpg"; // Make sure image paths are correct
import home2 from "./home2.jpg";
import home3 from "./home3.jpg";

// Get screen width
const { width } = Dimensions.get("window");

export default function CarouselComponent() {
  const carouselRef = useRef(null);  // Define the reference

  // Carousel data with correct image paths
  const carouselData = [
    { img: home1, title: "Slide 1", subtitle: "Welcome to the first slide" },
    { img: home2, title: "Slide 2", subtitle: "Discover more in slide two" },
    { img: home3, title: "Slide 3", subtitle: "Enjoy the experience" },
  ];

  // Render each item in the carousel
  const renderItem = ({ item }) => (
    <View style={styles.carouselSlide}>
      <Image source={item.img} style={styles.image} />
      <View style={styles.carouselCaption}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        ref={carouselRef}  // Use the ref for carousel navigation
        data={carouselData}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        autoplay
        autoplayDelay={2000}
        autoplayInterval={3000}
        loop
        enableMomentum={false}
        lockScrollWhileSnapping
      />

      {/* Left Navigation */}
      <TouchableOpacity
        style={styles.carouselControlPrev}
        onPress={() => carouselRef.current.snapToPrev()}
      >
        <Text style={styles.carouselControlText}>‹</Text>
      </TouchableOpacity>

      {/* Right Navigation */}
      <TouchableOpacity
        style={styles.carouselControlNext}
        onPress={() => carouselRef.current.snapToNext()}
      >
        <Text style={styles.carouselControlText}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the carousel component
const styles = StyleSheet.create({
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: 500,
  },
  carouselSlide: {
    justifyContent: "center",
    alignItems: "center",
    width: width,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
  },
  carouselCaption: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
  },
  carouselTitle: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  carouselSubtitle: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
  },
  carouselControlPrev: {
    position: "absolute",
    top: "50%",
    left: 10,
    transform: [{ translateY: -25 }],
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  carouselControlNext: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: [{ translateY: -25 }],
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  carouselControlText: {
    fontSize: 24,
    color: "#fff",
  },
});
