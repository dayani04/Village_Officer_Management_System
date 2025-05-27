// src/components/UserDashboard/UserDashboard.js
import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const OptionCard = ({ imgSrc, altText, buttonText, linkTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(linkTo);
  };

  return (
    
    <div className="option-card">
      <img src={imgSrc} alt={altText} className="card-image" />
      <button className="option-button" onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  );
};

const UserDashboard = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);

  return (
    <section>
      <NavBar/>
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>{t('welcomeMessage')}</h1>
        <div className="language-switch">
          <button onClick={() => changeLanguage('en')}>English</button>
          <button onClick={() => changeLanguage('si')}>සිංහල</button>
        </div>
      </div>
      <br /> <br />

      {/* Personal Information Section */}
      <h2>{t('personalInformation')}</h2>
      <div className="dashboard-options">
        <OptionCard
          imgSrc="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
          altText={t('editProfile')}
          buttonText={t('editProfile')}
          linkTo="/UserProfile" // Navigate to UserProfile page
        />
        <div className="vertical-line"></div>
        <OptionCard
          imgSrc="https://img.freepik.com/premium-photo/happy-young-sri-lankan-family-family-portrait_1106493-124766.jpg"
          altText={t('familyDetails')}
          buttonText={t('familyDetails')}
          linkTo="/FamilyDetails" // Navigate to FamilyDetails page
        />
        <div className="vertical-line"></div>
        <OptionCard
          imgSrc="https://www.shutterstock.com/image-photo/woman-holding-megaphone-speaker-on-600nw-2502342615.jpg"
          altText={t('announcement')}
          buttonText={t('announcement')} 
          linkTo="/Notification" 
        />
        <div className="vertical-line"></div>
        <OptionCard
          imgSrc="https://cdn-icons-png.freepik.com/512/7132/7132557.png"
          altText={t('officeSupport')}
          buttonText={t('officeSupport')} 
          linkTo="/OfficeSupport" 
        />
        <div className="vertical-line"></div>
        <OptionCard
          imgSrc="https://www.cookieyes.com/wp-content/uploads/2022/05/Privacy-policy-01-1.png"
          altText={t('privacyPolicy')}
          buttonText={t('privacyPolicy')} 
          linkTo="/PrivacyPolicy" 
        />
      </div>
      <br /><br /><br /><br /><br />

      {/* Application Processes Section */}
      <h2>{t('applicationProcesses')}</h2>
      <div className="dashboard-options">
        <OptionCard
          imgSrc="https://dwtyzx6upklss.cloudfront.net/Pictures/2000xAny/3/5/7/21357_pri_boardelections_hero_777797.png"
          altText={t('applyElection')}
          buttonText={t('applyElection')}
          linkTo="/UserElection"
        />
        <div className="vertical-line"></div>
        <OptionCard
          imgSrc="https://hermoney.com/wp-content/uploads/2021/10/cute-little-girl-holding-coin-of-money-and-put-in-pink-piggy-bank-with-blur-background-subject-is_t20_B8QV8K-840x487.jpg"
          altText={t('applyAllowance')}
          buttonText={t('applyAllowance')}
          linkTo="/UserAllowances"
        />
        <div className="vertical-line"></div>
        <OptionCard
          imgSrc="https://www.cal-pacs.org/wp-content/uploads/2015/04/workpermit-scaled.jpeg"
          altText={t('applyPermit')}
          buttonText={t('applyPermit')}
          linkTo="/UserPermits"
        />
        <div className="vertical-line"></div>
        <OptionCard
          imgSrc="https://memberclicks.com/wp-content/uploads/2021/12/membership-certificate-1-scaled.jpg"
          altText={t('applyCertificate')}
          buttonText={t('applyCertificate')}
          linkTo="/UserCertificates"
        />
        <div className="vertical-line"></div>
        <OptionCard
          imgSrc="https://colombotimes.lk/data/202308/1693292532_6126010NIC.jpg"
          altText={t('applyIDCard')}
          buttonText={t('applyIDCard')}
          linkTo="/UserIDCard"
        />
      </div>
    </div>
    <Footer/>
    </section>
  );
};

export default UserDashboard;