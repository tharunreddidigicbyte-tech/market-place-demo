import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthShell from '../components/auth/AuthShell';
import PhoneInput from '../components/auth/PhoneInput';
import OtpInput from '../components/auth/OtpInput';
import { sendOtp, verifyOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN = 30;

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ─── State ────────────────────────────────────────────────────────────
  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const submitGuard = useRef(false);

  // ─── Resend countdown ────────────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  // ─── Field change ────────────────────────────────────────────────────
  const setField = (key, value) => {
    if (key === 'mobile') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // ─── Validate details ────────────────────────────────────────────────
  const validateDetails = useCallback(() => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    else if (form.name.trim().length < 3) errs.name = 'Enter your full name (as per PAN).';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.mobile) errs.mobile = 'Mobile number is required.';
    else if (!PHONE_REGEX.test(form.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number starting with 6-9.';
    if (!consent) errs.consent = 'You must agree to the Terms and Privacy Policy.';
    return errs;
  }, [form, consent]);

  // ─── Send OTP ────────────────────────────────────────────────────────
  const handleSendOtp = useCallback(async () => {
    const errs = validateDetails();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (submitGuard.current) return;

    setLoading(true);
    submitGuard.current = true;

    try {
      const result = await sendOtp(form.mobile, { purpose: 'signup' });
      if (!result.success) {
        setErrors({ mobile: result.message });
        return;
      }
      setStep('otp');
      setOtp('');
      setOtpError('');
      setResendTimer(RESEND_COOLDOWN);
    } catch {
      setErrors({ mobile: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
      submitGuard.current = false;
    }
  }, [form, validateDetails]);

  // ─── Verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6) { setOtpError('Enter the complete 6-digit OTP.'); return; }
    if (submitGuard.current) return;

    setOtpError('');
    setLoading(true);
    submitGuard.current = true;

    try {
      const result = await verifyOtp(form.mobile, otp, {
        purpose: 'signup',
        profile: { name: form.name.trim(), email: form.email.trim() },
      });
      if (!result.success) {
        setOtpError(result.message);
        return;
      }
      login(result.user, result.token);
      navigate('/', { replace: true });
    } catch {
      setOtpError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
      submitGuard.current = false;
    }
  }, [form, otp, login, navigate]);

  // ─── Resend OTP ──────────────────────────────────────────────────────
  const handleResend = useCallback(async () => {
    if (resendTimer > 0 || submitGuard.current) return;
    setLoading(true);
    submitGuard.current = true;
    setOtpError('');
    try {
      await sendOtp(form.mobile, { purpose: 'signup' });
      setResendTimer(RESEND_COOLDOWN);
      setOtp('');
    } catch {
      setOtpError('Could not resend OTP. Try again.');
    } finally {
      setLoading(false);
      submitGuard.current = false;
    }
  }, [form.mobile, resendTimer]);

  // ─── Enter-to-submit ─────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 'details') {
        handleSendOtp();
      } else {
        handleVerifyOtp();
      }
    }
  };

  return (
    <AuthShell>
      <div className="auth-card" onKeyDown={handleKeyDown}>
        <div className="auth-card-header">
          <h2 className="auth-title">Create your <span className="gradient-text">FinVault</span> account</h2>
          <p className="auth-subtitle">Get started with India's premium financial marketplace</p>
        </div>

        {/* ── Demo banner ── */}
        <div className="auth-demo-banner">
          <FontAwesomeIcon icon="info-circle" />
          <span>
            <strong>Demo mode:</strong> Use OTP <code>123456</code>. The pre-registered number
            <code>9876543210</code> will be rejected (already exists).
          </span>
        </div>

        {step === 'details' && (
          <>
            {/* Full Name */}
            <div className="auth-field">
              <label htmlFor="signup-name" className="auth-label">Full Name (as per PAN)</label>
              <div className={`auth-input-wrap ${errors.name ? 'auth-input-wrap--error' : ''}`}>
                <FontAwesomeIcon icon="user" className="auth-input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Ravi Kumar"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  disabled={loading}
                  className="auth-input"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'signup-name-error' : undefined}
                />
              </div>
              {errors.name && (
                <p id="signup-name-error" className="auth-error" role="alert">
                  <FontAwesomeIcon icon="exclamation-circle" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="signup-email" className="auth-label">Email Address</label>
              <div className={`auth-input-wrap ${errors.email ? 'auth-input-wrap--error' : ''}`}>
                <FontAwesomeIcon icon="envelope" className="auth-input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="ravi@example.com"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  disabled={loading}
                  className="auth-input"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'signup-email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="signup-email-error" className="auth-error" role="alert">
                  <FontAwesomeIcon icon="exclamation-circle" /> {errors.email}
                </p>
              )}
            </div>

            {/* Mobile */}
            <PhoneInput
              id="signup-phone"
              value={form.mobile}
              onChange={(v) => setField('mobile', v)}
              error={errors.mobile}
              disabled={loading}
            />

            {/* Link to login if already registered */}
            {errors.mobile && errors.mobile.includes('already registered') && (
              <Link to="/login" className="auth-inline-link">
                <FontAwesomeIcon icon="arrow-right" /> Log in instead
              </Link>
            )}

            {/* Consent */}
            <div className="auth-field">
              <label className={`auth-consent ${errors.consent ? 'auth-consent--error' : ''}`}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => { setConsent(e.target.checked); setErrors((p) => ({ ...p, consent: '' })); }}
                  disabled={loading}
                  id="signup-consent"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'signup-consent-error' : undefined}
                />
                <span>
                  I agree to the <a href="#terms" className="auth-policy-link">Terms of Service</a>,{' '}
                  <a href="#privacy" className="auth-policy-link">Privacy Policy</a>, and consent to be
                  contacted for verification purposes.
                </span>
              </label>
              {errors.consent && (
                <p id="signup-consent-error" className="auth-error" role="alert">
                  <FontAwesomeIcon icon="exclamation-circle" /> {errors.consent}
                </p>
              )}
            </div>

            <button
              className="btn btn-primary auth-submit-btn"
              onClick={handleSendOtp}
              disabled={loading}
              id="signup-get-otp-btn"
            >
              {loading ? (
                <><FontAwesomeIcon icon="spinner" spin /> Sending…</>
              ) : (
                <>Get OTP <FontAwesomeIcon icon="arrow-right" /></>
              )}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="auth-phone-display">
              <span>OTP sent to <strong>+91 {form.mobile}</strong></span>
              <button className="auth-change-link" onClick={() => { setStep('details'); setOtpError(''); }}>
                Edit details
              </button>
            </div>

            <OtpInput
              value={otp}
              onChange={(v) => { setOtp(v); setOtpError(''); }}
              error={otpError}
              disabled={loading}
            />

            <button
              className="btn btn-primary auth-submit-btn"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              id="signup-verify-btn"
            >
              {loading ? (
                <><FontAwesomeIcon icon="spinner" spin /> Creating account…</>
              ) : (
                <>Verify &amp; Create Account <FontAwesomeIcon icon="check-circle" /></>
              )}
            </button>

            <div className="auth-resend-row">
              {resendTimer > 0 ? (
                <span className="auth-resend-timer">
                  Resend OTP in <strong>{resendTimer}s</strong>
                </span>
              ) : (
                <button
                  className="auth-resend-btn"
                  onClick={handleResend}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon="sync-alt" /> Resend OTP
                </button>
              )}
            </div>
          </>
        )}

        <div className="auth-footer-link">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">
            Log in <FontAwesomeIcon icon="arrow-right" />
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};

export default Signup;
