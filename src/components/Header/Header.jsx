import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">Company Questions Practice</h1>
        <p className="header__subtitle">
          Master coding interviews with company-specific questions
        </p>
      </div>
    </header>
  );
};

export default Header;
