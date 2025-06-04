import React, { useState } from 'react';

const TaskLog = () => {
  const [logs, setLogs] = useState([
    { text: 'Completed 5-mile run', date: 'Today, 9:45 AM' },
    { text: 'Read 50 pages of "Atomic Habits"', date: 'Yesterday, 7:30 PM' }
  ]);
  const [newLog, setNewLog] = useState('');

  const handleSaveLog = () => {
    if (newLog.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString([], { weekday: 'long' });
      
      setLogs([
        { text: newLog, date: `${dateString}, ${timeString}` },
        ...logs
      ]);
      setNewLog('');
    }
  };

  const handleClearLog = () => {
    setNewLog('');
  };

  return (
    <div className="task-log">
      <h3>Track Your Progress</h3>
      <textarea
        value={newLog}
        onChange={(e) => setNewLog(e.target.value)}
        placeholder="Log your achievements or tasks here..."
      />
      <div className="buttons-row">
        <button className="button" onClick={handleSaveLog}>Save Log</button>
        <button className="button button-secondary" onClick={handleClearLog}>Clear</button>
      </div>
      
      <div className="recent-logs">
        {logs.map((log, index) => (
          <div key={index} className="log-item">
            <div className="log-text">{log.text}</div>
            <div className="log-date">{log.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskLog; 