import React from "react";
import './AboutUs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import about2 from './about2.jpg';
import about from './about.webp';

const AboutUs = () => {
     
    return (
        <div className="containerA">
          <div className="left-column">
            <div className="cardA">
              <h3>Our Vision</h3>
              <p>ශ්‍රී ලංකාවේ ග්‍රාම නිලධාරීන්ට සේවාවන් ගෙන යාම, තීරණ ගත කිරීම, සහ ග්‍රාමීය ප්‍රජාවන්ගේ ජීවන තත්ත්වය වැඩි දියුණු කිරීම සඳහා කාර්යක්ෂම, පාරදර්ශී හා තාක්ෂණයෙන් පෝෂිත කළමනාකරණ පද්ධතියක් සකස් කිරීම.</p>
              <p>To empower Village Officers with an efficient, transparent, and technology-driven management system that enhances service delivery, decision-making, and the quality of life for rural communities in Sri Lanka.</p>
              <p>இலங்கையில் கிராம அதிகாரிகளுக்கு சேவை வழங்கல், முடிவெடுக்கும் செயல்முறை மற்றும் கிராமிய சமூகங்களின் வாழ்வாதாரத்தை மேம்படுத்த ஒரு திறம்பட, வெளிப்படையான மற்றும் தொழில்நுட்பமான மேலாண்மை முறைமையை உருவாக்குதல்.</p>
            </div>
            <div className="cardB">
              <h3>Our Mission</h3>
              <p>පරිපාලන ක්‍රියාවලීන් සරල කිරීම, දත්ත ප්‍රතිලාභ අවම කිරීම, නිවැරදි බව සහතික කිරීම, හා කාලෝචිත තීරණ ගැනීම පහසු කිරීම සඳහා ශක්තිමත් ග්‍රාම නිලධාරී කළමනාකරණ පද්ධතියක් සංවර්ධනය කිරීම සහ ක්‍රියාත්මක කිරීම, ප්‍රාථමික මට්ටමේ කාර්යක්ෂම පරිපාලනය හා තිරසාර සංවර්ධනය උත්සන්න කිරීම.</p>
              <p>To develop and implement a robust Village Officer Management System that streamlines administrative processes, reduces data redundancy, ensures accuracy, and facilitates timely decision-making, thereby fostering effective governance and sustainable development at the grassroots level.</p>
              <p>பிரச்சனைகள் மற்றும் தரவுகளை குறைக்க, துல்லியத்தை உறுதிப்படுத்த மற்றும் நேர்மையான முடிவுகளை எடுக்கும் செயல்முறைகளை எளிமைப்படுத்துவதற்காக ஒரு வலுவான கிராம அதிகாரி மேலாண்மை முறைமையை உருவாக்கவும், செயல்படுத்தவும், அதனால் அடிப்படை நிலைகளில் திறமையான நிர்வாகம் மற்றும் நிலைத்துடனான முன்னேற்றத்தை மேம்படுத்துதல்.</p>
            </div>
          </div>
    
          <div className="right-column">
            <img src={about} alt="About Us" className="about-image" />
          </div>
        </div>
      );
    };
    
    export default AboutUs;
     