import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import flag from './flag.png';
import emblem from './emblem.png';
import './NavBar.css';

function NavBar() {
  return (
    <div>
      <header className="navbar-header">
        <img
          src={flag}
          alt="Sri Lanka Flag"
          className="flag-logo"
        />
        <img
          src={emblem}
          alt="Sri Lanka Emblem"
          className="emblem-logo"
        />
        <div className="navbar-title">
          <h3>ශ්‍රී ලංකා ග්‍රාම සේවක</h3>
          <h4>கிராம அதிகாரி</h4>
          <h5>Village officers of sri lanka</h5>
        </div>
      </header>
      <nav className="navbar-menu">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#login">Login</a></li>
          <li><a href="#about">About Us</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
