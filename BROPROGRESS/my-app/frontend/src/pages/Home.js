import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to BrosTracker</h1>
        <p>Track your progress, achieve your goals, and grow with your community</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </section>
      
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Progress Tracking</h3>
            <p>Monitor your daily activities and track your progress over time</p>
          </div>
          <div className="feature-card">
            <h3>Community</h3>
            <p>Connect with like-minded individuals and share your journey</p>
          </div>
          <div className="feature-card">
            <h3>Workspaces</h3>
            <p>Create and manage your personal and group workspaces</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 