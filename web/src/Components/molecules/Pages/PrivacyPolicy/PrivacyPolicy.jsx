import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivacyPolicy.css';
import privacyImage from './privacy.jpg'; // Placeholder image

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/UserDashboard');
  };

  return (
    <div className="containerA">
      <div className="left-column">
        <div className="card-english">
          <h3>Privacy Policy (English)</h3>
          <p><strong>Data Protection:</strong> We are committed to protecting your personal information. All data collected is stored securely and used only for authorized purposes.</p>
          <p><strong>Data Usage:</strong> Your data is used to provide services, improve user experience, and comply with legal requirements. We do not share your information with third parties without consent.</p>
        </div>
        <div className="card-sinhala">
          <h3>රහස්‍යතා ප්‍රතිපත්තිය (සිංහල)</h3>
          <p><strong>දත්ත ආරක්ෂණය:</strong> අපි ඔබේ පුද්ගලික තොරතුරු ආරක්ෂා කිරීමට කැපවී සිටිමු. එකතු කරන ලද සියලුම දත්ත ආරක්ෂිතව ගබඩා කර ඇති අතර බලයලත් අරමුණු සඳහා පමණක් භාවිතා කරනු ලැබේ.</p>
          <p><strong>දත්ත භාවිතය:</strong> ඔබේ දත්ත සේවා සැපයීමට, පරිශීලක අත්දැකීම වැඩිදියුණු කිරීමට සහ නීතිමය අවශ්‍යතාවලට අනුකූල වීමට භාවිතා කරනු ලැබේ. ඔබේ තොරතුරු තුන්වන පාර්ශවයන් සමඟ බෙදා නොගනී.</p>
        </div>
        <div className="card-tamil">
          <h3>தனியுரிமைக் கொள்கை (தமிழ்)</h3>
          <p><strong>தரவு பாதுகாப்பு:</strong> உங்கள் தனிப்பட்ட தகவல்களைப் பாதுகாப்பதற்கு நாங்கள் உறுதிபூண்டுள்ளோம். சேகரிக்கப்பட்ட அனைத்து தரவுகளும் பாதுகாப்பாக சேமிக்கப்பட்டு, அங்கீகரிக்கப்பட்ட நோக்கங்களுக்கு மட்டுமே பயன்படுத்தப்படும்.</p>
          <p><strong>தரவு பயன்பாடு:</strong> உங்கள் தரவு சேவைகளை வழங்கவும், பயனர் அனுபவத்தை மேம்படுத்தவும் மற்றும் சட்டரீதியான தேவைகளுக்கு இணங்கவும் பயன்படுத்தப்படுகிறது. உங்கள் அனுமதியின்றி உங்கள் தகவல்களை மூன்றாம் தரப்பினருடன் பகிர்ந்து கொள்ள மாட்டோம்.</p>
        </div>
      </div>
      <div className="right-column">
        <img src={privacyImage} alt="Privacy Policy" className="privacy-image" />
      </div>
      <div className="privacy-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard / ආපසු උපකරණ පුවරුවට / மீண்டும் டாஷ்போர்டுக்கு
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;