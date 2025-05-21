import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OfficeSupport.css';
import supportImage from './support.jpg'; // Placeholder image

const OfficeSupport = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/UserDashboard');
  };

  return (
    <div className="containerA">
      <div className="left-column">
        <div className="card-english">
          <h3>Contact Information (English)</h3>
          <p><strong>Phone:</strong> +94 11 123 4567</p>
          <p><strong>Mobile:</strong> +94 76 789 0123</p>
          <p><strong>Email:</strong> support@village.lk</p>
          <p><strong>Address:</strong> Village Office, 123 Main Road, Colombo 07, Sri Lanka</p>
          <p><strong>Office Hours:</strong> Monday to Friday, 8:30 AM - 4:30 PM</p>
          <p><strong>Note:</strong> Please avoid visiting the office without prior appointment.</p>
        </div>
        <div className="card-sinhala">
          <h3>සම්බන්ධතා තොරතුරු (සිංහල)</h3>
          <p><strong>දුරකථන:</strong> +94 11 123 4567</p>
          <p><strong>ජංගම:</strong> +94 76 789 0123</p>
          <p><strong>විද්‍යුත් තැපෑල:</strong> support@village.lk</p>
          <p><strong>ලිපිනය:</strong> ග්‍රාම නිලධාරී කාර්යාලය, 123 ප්‍රධාන මාර්ගය, කොළඹ 07, ශ්‍රී ලංකාව</p>
          <p><strong>කාර්යාල වේලාවන්:</strong> සඳුදා සිට සිකුරාදා, පෙ.ව. 8:30 සිට ප.ව. 4:30 දක්වා</p>
          <p><strong>සටහන:</strong> කරුණාකර පූර්ව අවසරයකින් තොරව කාර්යාලයට පැමිණීමෙන් වළකින්න.</p>
        </div>
        <div className="card-tamil">
          <h3>தொடர்பு விவரங்கள் (தமிழ்)</h3>
          <p><strong>தொலைபேசி:</strong> +94 11 123 4567</p>
          <p><strong>கைபேசி:</strong> +94 76 789 0123</p>
          <p><strong>மின்னஞ்சல்:</strong> support@village.lk</p>
          <p><strong>முகவரி:</strong> கிராம அதிகாரி அலுவலகம், 123 பிரதான வீதி, கொழும்பு 07, இலங்கை</p>
          <p><strong>அலுவலக நேரம்:</strong> திங்கள் முதல் வெள்ளி வரை, காலை 8:30 முதல் மாலை 4:30 வரை</p>
          <p><strong>குறிப்பு:</strong> முன் அனுமதி இல்லாமல் அலுவலகத்திற்கு வருவதைத் தவிர்க்கவும்.</p>
        </div>
      </div>
      <div className="right-column">
        <img src={supportImage} alt="Office Support" className="support-image" />
      </div>
      <div className="support-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard / ආපසු උපකරණ පුවරුවට / மீண்டும் டாஷ்போர்டுக்கு
        </button>
      </div>
    </div>
  );
};

export default OfficeSupport;