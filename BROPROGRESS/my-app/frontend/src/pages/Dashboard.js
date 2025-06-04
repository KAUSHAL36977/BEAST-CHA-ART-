import React, { useState, useEffect } from 'react';
import { workspaces } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await workspaces.getAll();
        setUserWorkspaces(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load workspaces');
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>
      
      <section className="workspaces-section">
        <h2>Your Workspaces</h2>
        <div className="workspaces-grid">
          {userWorkspaces.map(workspace => (
            <div key={workspace.id} className="workspace-card">
              <h3>{workspace.name}</h3>
              <p>{workspace.description}</p>
              <div className="workspace-stats">
                <span>Pages: {workspace.pageCount}</span>
                <span>Members: {workspace.memberCount}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {/* Activity items will be added here */}
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 