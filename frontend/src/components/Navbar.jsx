// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import nasaLogo from '../assets/nasa.svg';
import './Navbar.css';

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Tab routing logic with valid tab check
  const validTabs = ['/neo-dashboard', '/mars-gallery', '/epic'];
  const [activeTab, setActiveTab] = useState(
    validTabs.includes(pathname) ? pathname : ''
  );

  useEffect(() => {
    setActiveTab(validTabs.includes(pathname) ? pathname : '');
  }, [pathname]);

  const handleTabChange = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 px-6 py-2 flex justify-between items-center text-white z-50">
      {/* NASA Logo */}
      <Link to="/">
        <img
          src={nasaLogo}
          alt="NASA Logo"
          className="h-12 w-auto hover:opacity-80 transition-opacity"
        />
      </Link>

      {/* Desktop Tab Nav */}
      <div className="hidden md:flex tab-container font-michroma">
        <input
          type="radio"
          name="tab"
          id="tab1"
          className="tab tab--1"
          checked={activeTab === '/neo-dashboard'}
          onChange={() => handleTabChange('/neo-dashboard')}
        />
        <label className="tab_label" htmlFor="tab1">Neo Dashboard</label>

        <input
          type="radio"
          name="tab"
          id="tab2"
          className="tab tab--2"
          checked={activeTab === '/mars-gallery'}
          onChange={() => handleTabChange('/mars-gallery')}
        />
        <label className="tab_label" htmlFor="tab2">Mars Gallery</label>

        <input
          type="radio"
          name="tab"
          id="tab3"
          className="tab tab--3"
          checked={activeTab === '/epic'}
          onChange={() => handleTabChange('/epic')}
        />
        <label className="tab_label" htmlFor="tab3">EPIC Viewer</label>

        {validTabs.includes(activeTab) && <div className="indicator"></div>}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <label className="hamburger">
          <input
            type="checkbox"
            checked={menuOpen}
            onChange={() => setMenuOpen(!menuOpen)}
          />
          <svg viewBox="0 0 32 32">
            <path
              className="line line-top-bottom"
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            ></path>
            <path className="line" d="M7 16 27 16"></path>
          </svg>
        </label>

        {menuOpen && (
          <div className="absolute right-6 top-20 bg-black bg-opacity-90 rounded-lg shadow-lg p-4 space-y-2">
            {[
              { path: '/neo-dashboard', label: 'Neo Dashboard' },
              { path: '/mars-gallery', label: 'Mars Gallery' },
              { path: '/epic', label: 'Epic Viewer' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block hover:underline ${
                  pathname === path ? 'font-bold underline' : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;