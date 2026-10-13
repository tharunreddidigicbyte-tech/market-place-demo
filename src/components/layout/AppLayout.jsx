import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/',           label: 'Dashboard',    icon: 'home' },
  { path: '/cards',      label: 'Credit Cards', icon: 'credit-card' },
  { path: '/loans',      label: 'Loans',        icon: 'hand-holding-usd' },
  { path: '/insurance',  label: 'Insurance',    icon: 'shield-alt' },
  { path: '/overview',   label: 'Overview',     icon: 'chart-pie' },
];

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentNav = navItems.find(n => n.path === location.pathname);

  // User initials for the avatar
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      {/* ── Sidebar (desktop) ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <FontAwesomeIcon icon="bolt" />
          </div>
          {sidebarOpen && <span className="brand-name">FinVault</span>}
        </div>

        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(p => !p)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <FontAwesomeIcon icon={sidebarOpen ? 'angle-left' : 'angle-right'} />
        </button>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
              {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
              {sidebarOpen && item.path === '/cards' && (
                <span className="sidebar-badge">3</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="sidebar-user">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="user-sub">
                  {user?.mobile ? `+91 ${user.mobile}` : 'Premium Member'}
                </span>
              </div>
            </div>
          )}
          <button
            className="sidebar-link sidebar-link--logout"
            title="Log out"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon="right-from-bracket" className="sidebar-icon" />
            {sidebarOpen && <span className="sidebar-label">Log out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="main-wrapper">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">{currentNav?.label || 'FinVault'}</h1>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn" aria-label="Search">
              <FontAwesomeIcon icon="search" />
            </button>
            <button className="topbar-btn topbar-btn--notif" aria-label="Notifications">
              <FontAwesomeIcon icon="bell" />
              <span className="notif-dot" />
            </button>
            <div className="topbar-avatar" title={user?.name}>{initials}</div>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>

      {/* ── Bottom tabs (mobile) ── */}
      <nav className="bottom-tabs" aria-label="Mobile navigation">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `bottom-tab ${isActive ? 'bottom-tab--active' : ''}`}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
