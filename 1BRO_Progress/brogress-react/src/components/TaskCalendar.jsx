import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TaskCalendar.css';

// Expects props: goals (array of tasks with dueDate, description, etc.)
const TaskCalendar = ({ goals = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date as yyyy-mm-dd
  const formatDate = (date) => date.toISOString().slice(0, 10);

  // Get all dates with tasks
  const taskDates = goals.filter(g => g.dueDate).map(g => g.dueDate);

  // Tasks for selected date
  const selectedTasks = goals.filter(
    g => g.dueDate === formatDate(selectedDate)
  );

  // Highlight days with tasks
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const d = formatDate(date);
      if (taskDates.includes(d)) return 'task-day';
    }
    return null;
  };

  return (
    <div className="task-calendar-card">
      <div className="task-calendar-header">
        <h3>📅 Task Calendar</h3>
        <p>View your tasks by date</p>
      </div>
      <div className="task-calendar-content">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
        />
        <div className="task-calendar-list">
          <h4>Tasks for {formatDate(selectedDate)}</h4>
          {selectedTasks.length === 0 ? (
            <p className="no-tasks">No tasks for this date.</p>
          ) : (
            <ul>
              {selectedTasks.map((task, idx) => (
                <li key={idx} className={`calendar-task-item${task.completed ? ' completed' : ''}`}>
                  <span>{task.description}</span>
                  {task.completed && <span className="calendar-task-status">✔️</span>}
                  {!task.completed && <span className="calendar-task-status pending">⏳</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar; 