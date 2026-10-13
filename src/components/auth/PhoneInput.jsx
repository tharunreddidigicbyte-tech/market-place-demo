import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * PhoneInput — 10-digit Indian mobile number input with +91 prefix.
 * Validation: ^[6-9]\d{9}$
 */
const PhoneInput = ({ value, onChange, error, disabled = false, id = 'phone-input' }) => {
  const inputRef = useRef(null);
  const errorId = `${id}-error`;

  const handleChange = (e) => {
    // Allow digits only, max 10
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(raw);
  };

  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, arrows
    const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    // Allow Ctrl+A / Ctrl+C / Ctrl+V / Ctrl+X
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;
    // Block non-digit
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="phone-input-group">
      <label htmlFor={id} className="auth-label">Mobile Number</label>
      <div className={`phone-input-wrap ${error ? 'phone-input-wrap--error' : ''} ${disabled ? 'phone-input-wrap--disabled' : ''}`}>
        <span className="phone-prefix">
          <FontAwesomeIcon icon="phone" className="phone-prefix-icon" />
          <span>+91</span>
        </span>
        <input
          ref={inputRef}
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="Enter 10-digit mobile number"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="phone-input"
          maxLength={10}
        />
      </div>
      {error && (
        <p id={errorId} className="auth-error" role="alert">
          <FontAwesomeIcon icon="exclamation-circle" /> {error}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
