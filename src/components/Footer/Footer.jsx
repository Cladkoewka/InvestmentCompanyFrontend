import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__left">
        <h4>Contact us</h4>
        <p>Email: support@example.com</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Address: 123 Investment St, Capital City</p>
      </div>
      <div className="footer__right">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
