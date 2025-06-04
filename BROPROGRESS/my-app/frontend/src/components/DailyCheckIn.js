import React, { useState } from 'react';

const DailyCheckIn = ({ attributes, onTaskComplete }) => {
  const [currentAttribute, setCurrentAttribute] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const startCheckIn = () => {
    const attributeKeys = Object.keys(attributes);
    const randomAttribute = attributeKeys[Math.floor(Math.random() * attributeKeys.length)];
    const tasks = attributes[randomAttribute].tasks;
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    
    setCurrentAttribute(randomAttribute);
    setCurrentTask(randomTask);
    setShowResults(false);
  };

  const handleAnswer = (completed) => {
    const points = completed ? currentTask.points : 0;
    onTaskComplete(currentAttribute, points);
    setShowResults(true);
  };

  if (!currentAttribute || !currentTask) {
    return (
      <div className="daily-check-in">
        <h3>Daily Check-In</h3>
        <button className="button" onClick={startCheckIn}>
          Start Daily Check-In
        </button>
      </div>
    );
  }

  return (
    <div className="daily-check-in">
      <h3>Daily Check-In</h3>
      {!showResults ? (
        <>
          <div className="task-question">
            <h4>{attributes[currentAttribute].name}</h4>
            <p>{currentTask.text}</p>
            <div className="buttons-row">
              <button 
                className="button" 
                onClick={() => handleAnswer(true)}
              >
                Done
              </button>
              <button 
                className="button button-secondary" 
                onClick={() => handleAnswer(false)}
              >
                Not Done
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="task-result">
          <h4>Task Completed!</h4>
          <p>You earned {currentTask.points} XP in {attributes[currentAttribute].name}</p>
          <button className="button" onClick={startCheckIn}>
            Next Task
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyCheckIn; 