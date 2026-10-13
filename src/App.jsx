import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './lib/icons';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import CreditCards from './pages/CreditCards';
import Loans from './pages/Loans';
import Insurance from './pages/Insurance';
import Overview from './pages/Overview';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes (no layout, no auth) ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Protected routes (sidebar layout + auth required) ── */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cards" element={<CreditCards />} />
                  <Route path="/loans" element={<Loans />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/overview" element={<Overview />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
