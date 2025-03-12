import React, { useContext } from 'react';
import { LanguageContext } from '../../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

const OptionCard = ({ imgSrc, altText, buttonText, linkTo }) => {
  const navigation = useNavigation();

  const handleClick = () => {
    navigation.navigate(linkTo);
  };

  return (
    <View style={styles.optionCard}>
      <Image source={{ uri: imgSrc }} style={styles.cardImage} />
      <TouchableOpacity style={styles.optionButton} onPress={handleClick}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const UserDashboard = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);

  return (
    <ScrollView style={styles.dashboardContainer}>
      {/* Header Section */}
      <View style={styles.dashboardHeader}>
        <Text style={styles.headerText}>{t('welcomeMessage')}</Text>
        <View style={styles.languageSwitch}>
          <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.languageButton}>
            <Text style={styles.languageButtonText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage('si')} style={styles.languageButton}>
            <Text style={styles.languageButtonText}>සිංහල</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information Section */}
      <Text style={styles.sectionTitle}>{t('personalInformation')}</Text>
      <View style={styles.dashboardOptions}>
        <OptionCard
          imgSrc="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
          altText={t('editProfile')}
          buttonText={t('editProfile')}
          linkTo="EditProfile" // Replace with the correct route name
        />
        <OptionCard
          imgSrc="https://img.freepik.com/premium-photo/happy-young-sri-lankan-family-family-portrait_1106493-124766.jpg"
          altText={t('familyDetails')}
          buttonText={t('familyDetails')}
          linkTo="FamilyDetails" // Replace with the correct route name
        />
        <OptionCard
          imgSrc="https://www.shutterstock.com/image-photo/woman-holding-megaphone-speaker-on-600nw-2502342615.jpg"
          altText={t('announcement')}
          buttonText={t('announcement')}
          linkTo="Announcements" // Replace with the correct route name
        />
        <OptionCard
          imgSrc="https://cdn-icons-png.freepik.com/512/7132/7132557.png"
          altText={t('officeSupport')}
          buttonText={t('officeSupport')}
          linkTo="OfficeSupport" // Replace with the correct route name
        />
        <OptionCard
          imgSrc="https://www.cookieyes.com/wp-content/uploads/2022/05/Privacy-policy-01-1.png"
          altText={t('privacyPolicy')}
          buttonText={t('privacyPolicy')}
          linkTo="PrivacyPolicy" // Replace with the correct route name
        />
      </View>

      {/* Application Processes Section */}
      <Text style={styles.sectionTitle}>{t('applicationProcesses')}</Text>
      <View style={styles.dashboardOptions}>
        <OptionCard
          imgSrc="https://dwtyzx6upklss.cloudfront.net/Pictures/2000xAny/3/5/7/21357_pri_boardelections_hero_777797.png"
          altText={t('applyElection')}
          buttonText={t('applyElection')}
          linkTo="ApplyElection" // Replace with the correct route name
        />
        <OptionCard
          imgSrc="https://hermoney.com/wp-content/uploads/2021/10/cute-little-girl-holding-coin-of-money-and-put-in-pink-piggy-bank-with-blur-background-subject-is_t20_B8QV8K-840x487.jpg"
          altText={t('applyAllowance')}
          buttonText={t('applyAllowance')}
          linkTo="ApplyAllowance" // Replace with the correct route name
        />
        <OptionCard
          imgSrc="https://www.cal-pacs.org/wp-content/uploads/2015/04/workpermit-scaled.jpeg"
          altText={t('applyPermit')}
          buttonText={t('applyPermit')}
          linkTo="ApplyPermit" // Replace with the correct route name
        />
        <OptionCard
          imgSrc="https://memberclicks.com/wp-content/uploads/2021/12/membership-certificate-1-scaled.jpg"
          altText={t('applyCertificate')}
          buttonText={t('applyCertificate')}
          linkTo="ApplyCertificate" // Replace with the correct route name
        />
        <OptionCard
          imgSrc="https://colombotimes.lk/data/202308/1693292532_6126010NIC.jpg"
          altText={t('applyIDCard')}
          buttonText={t('applyIDCard')}
          linkTo="ApplyIDCard" // Replace with the correct route name
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  dashboardHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  languageSwitch: {
    flexDirection: 'row',
    marginTop: 10,
  },
  languageButton: {
    padding: 10,
    backgroundColor: '#921940',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 20,
  },
  dashboardOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  optionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 150,
    height: 200,
    margin: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#921940',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UserDashboard;
