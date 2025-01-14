import React from 'react';
import './Home.css'; // Optional for custom styling
import 'bootstrap/dist/css/bootstrap.min.css';
import sinhalaLady from './sinhalaLady.jpg';
import tamilLady from './tamilLady.avif';
import welcomee from './welcomee.jpg';

const Home = () => {
  return (
    <section className="wrapper">
      <div className="container-fostrap">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-4">
                <div className="card">
                  <a
                    className="img-card"
                    href="http://www.fostrap.com/2016/03/bootstrap-3-carousel-fade-effect.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={tamilLady}
                      alt="Carousel FadeIn Out Effect"
                    />
                  </a>
                  <div className="card-content">
                    <h4 className="card-title">
                      <a
                        href="http://www.fostrap.com/2016/03/bootstrap-3-carousel-fade-effect.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        வணக்கம்
                      </a>
                    </h4>
                    <p>
                    உங்கள் அனைவரையும் வருக வருக கிராமப் பணியாளர்களைச் சந்திக்க வேண்டிய பெரும்பாலான சேவைகளை இணையதளத்தில் பதிவு செய்தவுடன், உள்நுழைவு பொத்தானை அழுத்தி, உங்களுக்குத் தேவையான விவரங்களை மிக எளிதாகச் செய்து கொள்ளலாம்.
                    </p>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="col-xs-12 col-sm-4">
                <div className="card">
                  <a
                    className="img-card"
                    href="http://www.fostrap.com/2016/03/5-button-hover-animation-effects-css3.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={sinhalaLady}
                      alt="Material Design Responsive Menu"
                    />
                  </a>
                  <div className="card-content">
                    <h4 className="card-title">
                      <a
                        href="http://www.fostrap.com/2016/02/awesome-material-design-responsive-menu.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ආයුබෝවන්
                      </a>
                    </h4>
                    <p>
                    ඔබ සැම සාදරයෙන් පිලිගනිමු.ග්‍රාම සේවක හමුවී කර ගැනීමට අවශ්‍ය බොහොමයක් සේවා මෙම වෙබ් අඩවිය මගින් ඔබට පහසුවෙන් කරගත හැක.වෙබ් අඩවියට ලියා පදිංචි වූ ඔබට ලොගින් බටනය ඔබා එහි ඔබේ ඉල්ලන විස්තර ඇතුලත් කර ඔබේ කාර්යන් ඉතා පහසුවෙන් කරගන්න.
                    </p>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="col-xs-12 col-sm-4">
                <div className="card">
                  <a
                    className="img-card"
                    href="http://www.fostrap.com/2016/03/5-button-hover-animation-effects-css3.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={welcomee}
                      alt="Button Hover Animation Effects"
                    />
                  </a>
                  <div className="card-content">
                    <h4 className="card-title">
                      <a
                        href="http://www.fostrap.com/2016/03/5-button-hover-animation-effects-css3.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Welcome
                      </a>
                    </h4>
                    <p>
                      Welcome to all of you. Most of the services you need to meet village workers can be done easily through this website. Once you have registered on the website, you can press the login button and enter your required details and do your work very easily.
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
