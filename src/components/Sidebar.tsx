import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', icon: '◻', label: 'Dashboard', exact: true },
  { to: '/detect', icon: '⊘', label: 'Detect' },
  { to: '/batch', icon: '☰', label: 'Batch Scan' },
  { to: '/history', icon: '↻', label: 'History' },
  { to: '/tips', icon: '◈', label: 'Safety Tips' },
  { to: '/about', icon: '○', label: 'About' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-mobile-toggle"
        id="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="17" y2="15" />
        </svg>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        id="sidebar"
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-logo" onClick={() => setMobileOpen(false)}>
            <span className="logo-mark">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="6" stroke="var(--accent)" strokeWidth="2" />
                <path d="M14 8v6l4 2" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="14" r="3" fill="var(--accent)" opacity="0.3" />
              </svg>
            </span>
            {!collapsed && <span className="logo-text">FakeGuard</span>}
          </Link>
          <button
            className="sidebar-collapse-btn btn-icon desktop-only"
            id="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              {collapsed ? (
                <polyline points="6,4 10,8 6,12" />
              ) : (
                <polyline points="10,4 6,8 10,12" />
              )}
            </svg>
          </button>
          <button
            className="sidebar-close-btn btn-icon mobile-only"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>

        {/* New Scan CTA */}
        <Link
          to="/detect"
          className="sidebar-cta"
          id="sidebar-new-scan"
          onClick={() => setMobileOpen(false)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="3" x2="8" y2="13" />
            <line x1="3" y1="8" x2="13" y2="8" />
          </svg>
          {!collapsed && <span>New Scan</span>}
        </Link>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={`sidebar-link ${isActive(item.to, item.exact) ? 'active' : ''}`}
              id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="sidebar-link-indicator" />
              <span className="sidebar-link-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          {!collapsed && (
            <div className="sidebar-footer-info">
              <span className="sidebar-version">v2.0</span>
              <span className="sidebar-dot">·</span>
              <span className="sidebar-status">
                <span className="status-dot" />
                All systems online
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
