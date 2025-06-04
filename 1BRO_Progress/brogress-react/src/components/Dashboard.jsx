import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ isDark }) => {
  const [showChart, setShowChart] = useState(false);
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    age: '',
    occupation: '',
    goals: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Sample chart data with theme-aware colors
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Progress',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: isDark ? '#bb86fc' : 'rgb(75, 192, 192)',
        backgroundColor: isDark ? 'rgba(187, 134, 252, 0.1)' : 'rgba(75, 192, 192, 0.1)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#e0e0e0' : '#2c2c2c'
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: isDark ? '#e0e0e0' : '#2c2c2c'
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: isDark ? '#e0e0e0' : '#2c2c2c'
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const handlePersonalDetailsSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log('Personal details saved:', personalDetails);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`dashboard-container dashboard-modern ${isDark ? 'dark-theme' : ''}`}>
      <div className="button-container">
        <button 
          onClick={() => setShowChart(!showChart)}
          className={`dashboard-button ${showChart ? 'active' : ''}`}
        >
          {showChart ? 'Hide Chart' : 'Show Chart'}
        </button>
        
        <button 
          onClick={() => setShowPersonalForm(!showPersonalForm)}
          className={`dashboard-button ${showPersonalForm ? 'active' : ''}`}
        >
          Personal Background
        </button>
        
        <button 
          onClick={() => setShowAchievements(!showAchievements)}
          className={`dashboard-button ${showAchievements ? 'active' : ''}`}
        >
          Achievements
        </button>
      </div>

      {showChart && (
        <div className="chart-container dashboard-modern-card">
          <h3 className="dashboard-heading">Progress Chart</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {showPersonalForm && (
        <div className="personal-form-container dashboard-modern-card">
          {!isEditing ? (
            <div className="personal-details-display">
              <h3 className="dashboard-heading">Personal Details</h3>
              <p className="dashboard-subtext">Name: {personalDetails.name || 'Not set'}</p>
              <p className="dashboard-subtext">Age: {personalDetails.age || 'Not set'}</p>
              <p className="dashboard-subtext">Occupation: {personalDetails.occupation || 'Not set'}</p>
              <p className="dashboard-subtext">Goals: {personalDetails.goals || 'Not set'}</p>
              <button onClick={() => setIsEditing(true)}>Modify Details</button>
            </div>
          ) : (
            <form onSubmit={handlePersonalDetailsSubmit} className="personal-form">
              <h3 className="dashboard-heading">Personal Details Form</h3>
              <div className="form-group">
                <label htmlFor="personal-name">Name:</label>
                <input
                  id="personal-name"
                  type="text"
                  name="name"
                  value={personalDetails.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="personal-age">Age:</label>
                <input
                  id="personal-age"
                  type="number"
                  name="age"
                  value={personalDetails.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="personal-occupation">Occupation:</label>
                <input
                  id="personal-occupation"
                  type="text"
                  name="occupation"
                  value={personalDetails.occupation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="personal-goals">Goals:</label>
                <textarea
                  id="personal-goals"
                  name="goals"
                  value={personalDetails.goals}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Save Details</button>
            </form>
          )}
        </div>
      )}

      {showAchievements && (
        <div className="achievements-container dashboard-modern-card">
          <h3 className="dashboard-heading">Achievements & Badges</h3>
          <div className="achievements-grid">
            <div className="achievement-card">
              <h4>First Milestone</h4>
              <p className="dashboard-subtext">Completed your first goal</p>
              <span className="badge">🏆</span>
            </div>
            <div className="achievement-card">
              <h4>Consistency</h4>
              <p className="dashboard-subtext">Logged in for 7 days straight</p>
              <span className="badge">🔥</span>
            </div>
            <div className="achievement-card">
              <h4>Goal Master</h4>
              <p className="dashboard-subtext">Completed 5 goals</p>
              <span className="badge">⭐</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 