import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import About from './About';
import Services from './Services';
import tamilLady from './tamilLady.avif';
import sinhalaLady from './sinhalaLady.jpg';
import welcomee from './welcomee.jpg';
import home1 from './home1.jpg';
import NavBar from '../../components/Navbar';


const Home = () => {
  return (
    <ScrollView style={styles.container}>
     <NavBar/>
      
      {/* Home Image */}
      <Image source={home1} style={styles.homeImage} />
      
      <About />

      <View style={styles.wrapper}>
        <View style={styles.containerFostrap}>
          <View style={styles.row}>
            {/* Card 1 */}
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.imgCard}
                onPress={() => { /* Open Link */ }}
              >
                <Image source={tamilLady} style={styles.cardImage} />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>வணக்கம்</Text>
                <Text style={styles.cardDescription}>
                  உங்கள் அனைவரையும் வருக வருக கிராமப் பணியாளர்களைச் சந்திக்க வேண்டிய பெரும்பாலான சேவைகளை இணையதளத்தில் பதிவு செய்தவுடன்.
                </Text>
              </View>
            </View>

            {/* Card 2 */}
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.imgCard}
                onPress={() => { /* Open Link */ }}
              >
                <Image source={sinhalaLady} style={styles.cardImage} />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>ආයුබෝවන්</Text>
                <Text style={styles.cardDescription}>
                  ඔබ සැම සාදරයෙන් පිලිගනිමු. ග්‍රාම සේවක හමුවී කර ගැනීමට අවශ්‍ය බොහොමයක් සේවා මෙම වෙබ් අඩවිය මගින් ඔබට පහසුවෙන් කරගත හැක.
                </Text>
              </View>
            </View>

            {/* Card 3 */}
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.imgCard}
                onPress={() => { /* Open Link */ }}
              >
                <Image source={welcomee} style={styles.cardImage} />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Welcome</Text>
                <Text style={styles.cardDescription}>
                  Welcome to all of you. Most of the services you need to meet village workers can be done easily through this website.
                </Text>
              </View>
            </View>
          </View>

          <Services />
        </View>
      </View>
  
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4D9D0',
  },
  homeImage: {
    width: '100%', // Full width of the screen
    height: 200, // Adjust height as needed
    resizeMode: 'cover', // Ensures the image covers the area without stretching
  },
  wrapper: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  containerFostrap: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#D9ABAB',
    borderRadius: 8,
    width: '28%', // Reduced width for smaller cards
    marginBottom: 15, // Reduced margin
    height: 500, // Reduced card height
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.16)',
    marginRight: 10,
  },
  imgCard: {
    width: '100%',
    height: 250, // Reduced image height
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 10, // Reduced padding
    textAlign: 'left',
  },
  cardTitle: {
    fontSize: 16, // Smaller font size for title
    fontWeight: '700',
    marginTop: 0,
    color: '#333',
  },
  cardDescription: {
    fontSize: 12, // Smaller font size for description
    fontWeight: '400',
    marginTop: 8, // Reduced margin
    color: '#555',
  },
});

export default Home;
