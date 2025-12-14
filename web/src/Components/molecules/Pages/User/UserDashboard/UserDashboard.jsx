import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getVillagerNotifications } from '../../../../../api/villager';
import './UserDashboard.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const OptionCard = ({ imgSrc, altText, buttonText, linkTo, notificationCount }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(linkTo);
  };

  return (
    <div className="option-card">
      <img src={imgSrc} alt={altText} className="card-image" />
      <button className="option-button" onClick={handleClick}>
        {buttonText}
        {notificationCount > 0 && (
          <span className="notification-badge">{notificationCount}</span>
        )}
      </button>
    </div>
  );
};

const UserDashboard = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const data = await getVillagerNotifications();
        const unreadCount = data.filter(notif => !notif.Is_Read).length;
        setNotificationCount(unreadCount);
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };

    fetchNotificationCount();
  }, []);

  return (
    <section>
      <NavBar />
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
            linkTo="/user_profile"
          />

          <OptionCard
            imgSrc="https://img.freepik.com/premium-photo/happy-young-sri-lankan-family-family-portrait_1106493-124766.jpg"
            altText={t('familyDetails')}
            buttonText={t('familyDetails')}
            linkTo="/family_details"
          />

          <OptionCard
            imgSrc="https://www.shutterstock.com/image-photo/woman-holding-megaphone-speaker-on-600nw-2502342615.jpg"
            altText={t('notification')}
            buttonText={t('notification')}
            linkTo="/notification"
            notificationCount={notificationCount}
          />

          <OptionCard
            imgSrc="https://cdn-icons-png.freepik.com/512/7132/7132557.png"
            altText={t('permitcertificates')}
            buttonText={t('permitcertificates')}
            linkTo="/user_certificates_download"
          />

          <OptionCard
            imgSrc="https://www.cookieyes.com/wp-content/uploads/2022/05/Privacy-policy-01-1.png"
            altText={t('approvedvillageofficerceritificates')}
            buttonText={t('approvedvillageofficerceritificates')}
            linkTo="/privacy_policy"
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
            linkTo="/user_election"
          />

          <OptionCard
            imgSrc="https://hermoney.com/wp-content/uploads/2021/10/cute-little-girl-holding-coin-of-money-and-put-in-pink-piggy-bank-with-blur-background-subject-is_t20_B8QV8K-840x487.jpg"
            altText={t('applyAllowance')}
            buttonText={t('applyAllowance')}
            linkTo="/user_allowances"
          />

          <OptionCard
            imgSrc="https://www.cal-pacs.org/wp-content/uploads/2015/04/workpermit-scaled.jpeg"
            altText={t('applyPermit')}
            buttonText={t('applyPermit')}
            linkTo="/user_permits"
          />

          <OptionCard
            imgSrc="https://memberclicks.com/wp-content/uploads/2021/12/membership-certificate-1-scaled.jpg"
            altText={t('applyCertificate')}
            buttonText={t('applyCertificate')}
            linkTo="/user_certificates"
          />

          <OptionCard
            imgSrc="https://colombotimes.lk/data/202308/1693292532_6126010NIC.jpg"
            altText={t('applyIDCard')}
            buttonText={t('applyIDCard')}
            linkTo="/user_id_card"
          />
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default UserDashboard;