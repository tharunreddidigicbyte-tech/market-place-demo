/**
 * authService.js — Mock authentication service
 *
 * SECURITY NOTES:
 * - A real app would store the session in an httpOnly, Secure, SameSite cookie,
 *   NOT in localStorage or React state alone.
 * - OTPs must be generated, hashed, expired (~5 min) and rate-limited on the
 *   server, with lockout after repeated failures. Resend cooldown must also be
 *   enforced server-side.
 * - Real login responses should be generic ("If this number is registered, an
 *   OTP has been sent") to avoid revealing which numbers have accounts.
 *   The demo shows explicit messages only for clarity.
 */

// ─── In-memory user store (replaces DB in production) ───────────────────────
const registeredUsers = new Map();

// Seed a demo user so login works immediately
registeredUsers.set('9876543210', {
  name: 'Ravi Kumar',
  email: 'ravi@example.com',
  mobile: '9876543210',
  createdAt: new Date().toISOString(),
});

// ─── Demo OTP ───────────────────────────────────────────────────────────────
const DEMO_OTP = '123456';
const SIMULATED_LATENCY_MS = 800;

/**
 * Simulate network delay
 */
const delay = (ms = SIMULATED_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Send OTP to a mobile number.
 *
 * @param {string}  mobile   – 10-digit Indian mobile number
 * @param {Object}  options
 * @param {'login'|'signup'} options.purpose
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const sendOtp = async (mobile, { purpose = 'login' } = {}) => {
  await delay();

  // ── Replace this block with a real API call ──────────────────────────
  // e.g. const res = await fetch('/api/auth/send-otp', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ mobile, purpose }),
  // });
  // return res.json();
  // ─────────────────────────────────────────────────────────────────────

  const isRegistered = registeredUsers.has(mobile);

  if (purpose === 'login' && !isRegistered) {
    return {
      success: false,
      message: 'This number is not registered. Please sign up first.',
      code: 'NOT_REGISTERED',
    };
  }

  if (purpose === 'signup' && isRegistered) {
    return {
      success: false,
      message: 'This number is already registered. Please log in instead.',
      code: 'ALREADY_REGISTERED',
    };
  }

  // In a real app the OTP is generated + hashed server-side, never returned.
  console.info(`[Demo] OTP for +91 ${mobile}: ${DEMO_OTP}`);

  return { success: true, message: 'OTP sent successfully.' };
};

/**
 * Verify OTP and create / authenticate the session.
 *
 * @param {string}  mobile
 * @param {string}  otp
 * @param {Object}  options
 * @param {'login'|'signup'} options.purpose
 * @param {Object}  [options.profile]  – required for signup
 * @returns {Promise<{ success: boolean, message: string, user?: Object }>}
 */
export const verifyOtp = async (mobile, otp, { purpose = 'login', profile } = {}) => {
  await delay();

  // ── Replace this block with a real API call ──────────────────────────
  // e.g. const res = await fetch('/api/auth/verify-otp', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ mobile, otp, purpose, profile }),
  // });
  // return res.json();
  // ─────────────────────────────────────────────────────────────────────

  if (otp !== DEMO_OTP) {
    return {
      success: false,
      message: 'Invalid OTP. Please try again.',
      code: 'INVALID_OTP',
    };
  }

  let user;

  if (purpose === 'signup') {
    // Create new user
    user = {
      name: profile?.name || 'New User',
      email: profile?.email || '',
      mobile,
      createdAt: new Date().toISOString(),
    };
    registeredUsers.set(mobile, user);
  } else {
    user = registeredUsers.get(mobile);
  }

  return {
    success: true,
    message: purpose === 'signup' ? 'Account created successfully!' : 'Logged in successfully!',
    user,
    // In production the server sets an httpOnly cookie with a JWT/session token.
    // The token below is for demo purposes only.
    token: `demo_token_${mobile}_${Date.now()}`,
  };
};
