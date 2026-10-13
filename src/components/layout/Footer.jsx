import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <FontAwesomeIcon icon="bolt" />
        <span>FinVault</span>
      </div>
      <p className="footer-copy">
        © 2026 FinVault Technologies Pvt. Ltd. · IRDAI Reg. No. CA0551 · RBI Licensed
      </p>
      <div className="footer-links">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#grievance">Grievance</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
