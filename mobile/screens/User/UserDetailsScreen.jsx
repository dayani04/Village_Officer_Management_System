import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import family from './family.png';

// OptionCard Component
const OptionCard = ({ imgSrc, altText, buttonText, linkTo }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate(linkTo)}>
      <Image source={imgSrc} style={styles.cardImage} />
      <Text style={styles.optionButton}>{buttonText}</Text>
       <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
    </TouchableOpacity>
  );
};

const UserDashboardScreen = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('welcomeMessage')}</Text>
        <View style={styles.languageSwitch}>
          <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.langButton}>
            <Text style={styles.langText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage('si')} style={styles.langButton}>
            <Text style={styles.langText}>සිංහල</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information Section */}
      <Text style={styles.sectionTitle}>{t('personalInformation')}</Text>
      <View style={styles.optionsContainer}>
        <OptionCard Image source={family} buttonText={t('editProfile')} linkTo="EditProfile" />
        <OptionCard Image source={family} buttonText={t('familyDetails')} linkTo="FamilyDetails" />
        <OptionCard Image source={family} buttonText={t('announcement')} linkTo="Announcement" />
        <OptionCard Image source={family} buttonText={t('officeSupport')} linkTo="OfficeSupport" />
        <OptionCard Image source={family} buttonText={t('privacyPolicy')} linkTo="PrivacyPolicy" /> 
      </View>

      {/* Application Processes Section */}
      <Text style={styles.sectionTitle}>{t('applicationProcesses')}</Text>
      <View style={styles.optionsContainer}>
        <OptionCard Image source={family} buttonText={t('applyElection')} linkTo="UserElection" />
        <OptionCard Image source={family} buttonText={t('applyAllowance')} linkTo="UserAllowances" />
        <OptionCard Image source={family} buttonText={t('applyPermit')} linkTo="UserPermits" />
        <OptionCard Image source={family} buttonText={t('applyCertificate')} linkTo="UserCertificates" />
        <OptionCard Image source={family} buttonText={t('applyIDCard')} linkTo="UserIDCard" />
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  languageSwitch: {
    flexDirection: 'row',
    marginTop: 10,
  },
  langButton: {
    backgroundColor: '#921940',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  langText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '45%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#921940',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
});

export default UserDashboardScreen;
