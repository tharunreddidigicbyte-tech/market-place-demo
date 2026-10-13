import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthShell from '../components/auth/AuthShell';
import PhoneInput from '../components/auth/PhoneInput';
import OtpInput from '../components/auth/OtpInput';
import { sendOtp, verifyOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const PHONE_REGEX = /^[6-9]\d{9}$/;
const RESEND_COOLDOWN = 30;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Where the user was trying to go before hitting the login wall
  const from = location.state?.from?.pathname || '/';

  // ─── State ────────────────────────────────────────────────────────────
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const submitGuard = useRef(false);

  // ─── Resend countdown ────────────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  // ─── Phone validation ────────────────────────────────────────────────
  const validatePhone = useCallback((val) => {
    if (!val) return 'Mobile number is required.';
    if (val.length !== 10) return 'Enter a valid 10-digit mobile number.';
    if (!PHONE_REGEX.test(val)) return 'Number must start with 6, 7, 8, or 9.';
    return '';
  }, []);

  // ─── Send OTP ────────────────────────────────────────────────────────
  const handleSendOtp = useCallback(async () => {
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    if (submitGuard.current) return;

    setPhoneError('');
    setLoading(true);
    submitGuard.current = true;

    try {
      const result = await sendOtp(phone, { purpose: 'login' });
      if (!result.success) {
        setPhoneError(result.message);
        return;
      }
      setStep('otp');
      setOtp('');
      setOtpError('');
      setResendTimer(RESEND_COOLDOWN);
    } catch {
      setPhoneError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      submitGuard.current = false;
    }
  }, [phone, validatePhone]);

  // ─── Verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6) { setOtpError('Enter the complete 6-digit OTP.'); return; }
    if (submitGuard.current) return;

    setOtpError('');
    setLoading(true);
    submitGuard.current = true;

    try {
      const result = await verifyOtp(phone, otp, { purpose: 'login' });
      if (!result.success) {
        setOtpError(result.message);
        return;
      }
      login(result.user, result.token);
      navigate(from, { replace: true });
    } catch {
      setOtpError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
      submitGuard.current = false;
    }
  }, [phone, otp, login, navigate, from]);

  // ─── Resend OTP ──────────────────────────────────────────────────────
  const handleResend = useCallback(async () => {
    if (resendTimer > 0 || submitGuard.current) return;
    setLoading(true);
    submitGuard.current = true;
    setOtpError('');
    try {
      await sendOtp(phone, { purpose: 'login' });
      setResendTimer(RESEND_COOLDOWN);
      setOtp('');
    } catch {
      setOtpError('Could not resend OTP. Try again.');
    } finally {
      setLoading(false);
      submitGuard.current = false;
    }
  }, [phone, resendTimer]);

  // ─── Form submit (Enter key) ─────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 'phone') {
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
          <h2 className="auth-title">Log in to <span className="gradient-text">FinVault</span></h2>
          <p className="auth-subtitle">Enter your registered mobile number to receive an OTP</p>
        </div>

        {/* ── Demo banner ── */}
        <div className="auth-demo-banner">
          <FontAwesomeIcon icon="info-circle" />
          <span>
            <strong>Demo mode:</strong> Use OTP <code>123456</code> for any registered number.
            Pre-registered: <code>9876543210</code>
          </span>
        </div>

        {step === 'phone' && (
          <>
            <PhoneInput
              value={phone}
              onChange={(v) => { setPhone(v); setPhoneError(''); }}
              error={phoneError}
              disabled={loading}
            />

            {/* Show signup link when user is not registered */}
            {phoneError && phoneError.includes('not registered') && (
              <Link to="/signup" className="auth-inline-link">
                <FontAwesomeIcon icon="arrow-right" /> Sign up now
              </Link>
            )}

            <button
              className="btn btn-primary auth-submit-btn"
              onClick={handleSendOtp}
              disabled={loading || phone.length < 10}
              id="login-get-otp-btn"
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
              <span>OTP sent to <strong>+91 {phone}</strong></span>
              <button className="auth-change-link" onClick={() => { setStep('phone'); setOtpError(''); }}>
                Change number
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
              id="login-verify-btn"
            >
              {loading ? (
                <><FontAwesomeIcon icon="spinner" spin /> Verifying…</>
              ) : (
                <>Verify &amp; Log in <FontAwesomeIcon icon="lock" /></>
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
          <span>New to FinVault?</span>
          <Link to="/signup" className="auth-link">
            Create an account <FontAwesomeIcon icon="arrow-right" />
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};

export default Login;
