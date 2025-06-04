import React, { useState, useEffect } from 'react';

const AchieversSection = ({ onClose }) => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Physical',
    timeframe: '1 week',
    targetDate: '',
    status: 'In Progress',
    difficulty: 'Medium'
  });

  const categories = ['Physical', 'Mental', 'Intellect', 'Ambition', 'Discipline', 'Relationship'];
  const timeframes = ['1 day', '1 week', '1 month', '3 months', '6 months', '1 year', 'Life'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    const savedGoals = localStorage.getItem('achieverGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedGoals = [...goals, { ...newGoal, id: Date.now() }];
    setGoals(updatedGoals);
    localStorage.setItem('achieverGoals', JSON.stringify(updatedGoals));
    setNewGoal({
      title: '',
      description: '',
      category: 'Physical',
      timeframe: '1 week',
      targetDate: '',
      status: 'In Progress',
      difficulty: 'Medium'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateGoalStatus = (goalId, newStatus) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, status: newStatus } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('achieverGoals', JSON.stringify(updatedGoals));
  };

  const deleteGoal = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('achieverGoals', JSON.stringify(updatedGoals));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'var(--success)';
      case 'medium':
        return 'var(--secondary)';
      case 'hard':
        return 'var(--primary)';
      default:
        return 'var(--text)';
    }
  };

  return (
    <div className="achievers-section">
      <div className="section-header">
        <h2>Achievers Section</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="achievers-content">
        <form onSubmit={handleSubmit} className="goal-form">
          <div className="form-group">
            <label htmlFor="title">Goal Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newGoal.title}
              onChange={handleChange}
              placeholder="Enter your goal title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newGoal.description}
              onChange={handleChange}
              placeholder="Describe your goal in detail"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={newGoal.category}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timeframe">Timeframe</label>
              <select
                id="timeframe"
                name="timeframe"
                value={newGoal.timeframe}
                onChange={handleChange}
                required
              >
                {timeframes.map(timeframe => (
                  <option key={timeframe} value={timeframe}>{timeframe}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targetDate">Target Date</label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={newGoal.targetDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level</label>
              <select
                id="difficulty"
                name="difficulty"
                value={newGoal.difficulty}
                onChange={handleChange}
                required
                style={{ color: getDifficultyColor(newGoal.difficulty) }}
              >
                {difficulties.map(difficulty => (
                  <option 
                    key={difficulty} 
                    value={difficulty}
                    style={{ color: getDifficultyColor(difficulty) }}
                  >
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="button">Add Goal</button>
        </form>

        <div className="goals-list">
          <h3>Your Goals</h3>
          {goals.length === 0 ? (
            <p className="no-goals">No goals set yet. Start by adding your first goal!</p>
          ) : (
            goals.map(goal => (
              <div key={goal.id} className={`goal-card ${goal.status.toLowerCase().replace(' ', '-')}`}>
                <div className="goal-header">
                  <h4>{goal.title}</h4>
                  <div className="goal-actions">
                    <select
                      value={goal.status}
                      onChange={(e) => updateGoalStatus(goal.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                    <button 
                      className="delete-button"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <p className="goal-description">{goal.description}</p>
                <div className="goal-meta">
                  <span className="category-badge">{goal.category}</span>
                  <span className="timeframe-badge">{goal.timeframe}</span>
                  <span 
                    className="difficulty-badge"
                    style={{ 
                      backgroundColor: `${getDifficultyColor(goal.difficulty)}20`,
                      color: getDifficultyColor(goal.difficulty)
                    }}
                  >
                    {goal.difficulty}
                  </span>
                  <span className="date-badge">Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AchieversSection; 