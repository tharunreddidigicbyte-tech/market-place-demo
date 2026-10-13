import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * SECURITY NOTE:
 * A production app would persist the session via an httpOnly, Secure, SameSite
 * cookie set by the server — not localStorage. We use state here for the demo.
 */

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null); // { token, user }

  const login = useCallback((user, token) => {
    setSession({ user, token });
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    login,
    logout,
  }), [session, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth — convenience hook.
 * Throws a helpful error if used outside <AuthProvider>.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error(
      'useAuth() must be used inside <AuthProvider>. ' +
      'Wrap your app (or at least the component tree that calls useAuth) in <AuthProvider>.'
    );
  }
  return ctx;
};
