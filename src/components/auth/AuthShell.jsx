import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * AuthShell — split layout for auth pages.
 * Desktop: brand panel (left) + form panel (right).
 * Mobile: single-column with a compact brand header.
 */
const AuthShell = ({ children }) => {
  return (
    <div className="auth-shell">
      {/* ── Brand panel (desktop) ── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <FontAwesomeIcon icon="bolt" />
          </div>
          <h1 className="auth-brand-name">FinVault</h1>
          <p className="auth-brand-tagline">
            India's premium financial marketplace for credit cards, loans &amp; insurance
          </p>
          <div className="auth-brand-features">
            {[
              { icon: 'credit-card', text: 'Compare 50+ credit cards' },
              { icon: 'hand-holding-usd', text: 'Pre-approved loan offers' },
              { icon: 'shield-alt', text: 'Instant insurance quotes' },
              { icon: 'lock', text: 'Bank-grade security' },
            ].map((feat, i) => (
              <div key={i} className="auth-feature">
                <FontAwesomeIcon icon={feat.icon} />
                <span>{feat.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-brand-bg-glow" />
      </div>

      {/* ── Form panel ── */}
      <div className="auth-form-panel">
        {/* Compact brand header for mobile */}
        <div className="auth-mobile-brand">
          <div className="auth-brand-logo auth-brand-logo--sm">
            <FontAwesomeIcon icon="bolt" />
          </div>
          <span className="auth-brand-name auth-brand-name--sm">FinVault</span>
        </div>
        <div className="auth-form-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
