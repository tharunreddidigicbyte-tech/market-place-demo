import React, { useRef, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OTP_LENGTH = 6;

/**
 * OtpInput — 6-box OTP input with:
 * - Auto-advance on digit entry
 * - Backspace navigation
 * - Arrow-key movement
 * - Full-code paste & auto-fill support (e.g. "123456")
 * - Typing replacement support
 * - autocomplete="one-time-code"
 */
const OtpInput = ({ value = '', onChange, error, disabled = false, id = 'otp-input' }) => {
  const inputRefs = useRef([]);
  const errorId = `${id}-error`;
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => (value || '')[i] || '');

  const focusBox = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, OTP_LENGTH - 1));
    const el = inputRefs.current[clamped];
    if (el) {
      el.focus();
      try { el.select(); } catch {}
    }
  }, []);

  const updateValue = useCallback((newDigits) => {
    onChange(newDigits.join(''));
  }, [onChange]);

  const handleInput = (index, e) => {
    const rawVal = e.target.value;
    const cleanDigits = rawVal.replace(/\D/g, '');

    if (!cleanDigits) {
      const next = [...digits];
      next[index] = '';
      updateValue(next);
      return;
    }

    // If multiple digits (full code pasted / typed / autofilled)
    if (cleanDigits.length > 1) {
      // If user typed one character while box already had one character:
      if (cleanDigits.length === 2 && digits[index]) {
        const newChar = rawVal.endsWith(digits[index]) ? cleanDigits[0] : cleanDigits[cleanDigits.length - 1];
        const next = [...digits];
        next[index] = newChar;
        updateValue(next);
        if (index < OTP_LENGTH - 1) {
          focusBox(index + 1);
        }
        return;
      }

      // Multi-digit paste or automation tool entering full string
      const next = [...digits];
      const chars = cleanDigits.split('');
      const startIdx = cleanDigits.length >= OTP_LENGTH ? 0 : index;
      chars.slice(0, OTP_LENGTH).forEach((c, idx) => {
        if (startIdx + idx < OTP_LENGTH) {
          next[startIdx + idx] = c;
        }
      });
      updateValue(next);
      focusBox(Math.min(startIdx + chars.length, OTP_LENGTH - 1));
      return;
    }

    // Single digit entered
    const next = [...digits];
    next[index] = cleanDigits;
    updateValue(next);
    if (index < OTP_LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (digits[index]) {
          const next = [...digits];
          next[index] = '';
          updateValue(next);
        } else if (index > 0) {
          const next = [...digits];
          next[index - 1] = '';
          updateValue(next);
          focusBox(index - 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusBox(index - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusBox(index + 1);
        break;
      case 'Delete':
        e.preventDefault();
        const next = [...digits];
        next[index] = '';
        updateValue(next);
        break;
      default:
        break;
    }
  };

  const handleFocus = (index, e) => {
    const firstEmptyIndex = digits.findIndex((d) => !d);
    if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
      focusBox(firstEmptyIndex);
      return;
    }
    try {
      e.target.select();
    } catch {}
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;
    const next = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    updateValue(next);
    focusBox(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  // Auto-focus first box on mount
  useEffect(() => {
    if (!disabled) {
      const timer = setTimeout(() => focusBox(0), 100);
      return () => clearTimeout(timer);
    }
  }, [disabled, focusBox]);

  return (
    <div className="otp-input-group">
      <label className="auth-label" id={`${id}-label`}>Enter OTP</label>
      <div
        className={`otp-boxes ${error ? 'otp-boxes--error' : ''}`}
        role="group"
        aria-labelledby={`${id}-label`}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            id={`${id}-${i}`}
            data-testid={`otp-box-${i}`}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={6}
            value={digit}
            onChange={(e) => handleInput(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => handleFocus(i, e)}
            disabled={disabled}
            className={`otp-box ${digit ? 'otp-box--filled' : ''} ${error ? 'otp-box--error' : ''}`}
            aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
        ))}
      </div>
      {error && (
        <p id={errorId} className="auth-error" role="alert">
          <FontAwesomeIcon icon="exclamation-circle" /> {error}
        </p>
      )}
    </div>
  );
};

export default OtpInput;
