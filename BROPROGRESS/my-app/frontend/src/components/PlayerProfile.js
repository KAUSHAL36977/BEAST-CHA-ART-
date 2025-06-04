import React, { useState, useEffect } from 'react';

const PlayerProfile = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [playerData, setPlayerData] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    goals: ''
  });

  useEffect(() => {
    // Load saved player data from localStorage
    const savedData = localStorage.getItem('playerData');
    if (savedData) {
      setPlayerData(JSON.parse(savedData));
      setIsEditing(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('playerData', JSON.stringify(playerData));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isEditing) {
    return (
      <div className="player-profile">
        <div className="profile-header">
          <h2>Player Background</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={playerData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={playerData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={playerData.height}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={playerData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={playerData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="goals">Your Goals</label>
            <textarea
              id="goals"
              name="goals"
              value={playerData.goals}
              onChange={handleChange}
              placeholder="What are your main goals?"
              required
            />
          </div>

          <button type="submit" className="button">Save Profile</button>
        </form>
      </div>
    );
  }

  return (
    <div className="player-profile">
      <div className="profile-header">
        <h2>Player Profile</h2>
        <div className="profile-actions">
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{playerData.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{playerData.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Age:</span>
              <span className="value">{playerData.age} years</span>
            </div>
            <div className="info-item">
              <span className="label">Height:</span>
              <span className="value">{playerData.height} cm</span>
            </div>
            <div className="info-item">
              <span className="label">Weight:</span>
              <span className="value">{playerData.weight} kg</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Goals</h3>
          <p className="goals-text">{playerData.goals}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile; 