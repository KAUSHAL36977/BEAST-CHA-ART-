import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">BrosTracker</Link>
      </div>
      <nav className="nav">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/workspaces">Workspaces</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  );
};

export default Header; 