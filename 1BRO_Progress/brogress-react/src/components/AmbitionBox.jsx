import React, { useState } from 'react';

const difficultyPoints = {
  Hard: 7,
  Medium: 5,
  Easy: 3,
};

const timePeriods = [
  'In 1 Week',
  'In 2 Weeks',
  'In 1 Month',
  'In 3 Months',
  'In 6 Months',
  'In 1 Year',
];

const allCategories = ['Work', 'Personal', 'Urgent', 'Health', 'Learning'];
const priorityColors = { High: '#e53935', Medium: '#fbc02d', Low: '#43a047' };

const initialGoalState = {
  attribute: '',
  description: '',
  timePeriod: timePeriods[2],
  targetDate: '',
  difficulty: 'Medium',
  completed: false,
  dueDate: '',
  categories: [],
  priority: 'Medium',
};

const AmbitionBox = ({ attributes }) => {
  const [goal, setGoal] = useState(initialGoalState);
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const attributeNames = Object.keys(attributes.levels).sort();

  // Open modal for new goal
  const handleBigPlus = () => {
    setGoal(initialGoalState);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  // Open modal for attribute quick add
  const handleOpen = (attr) => {
    setGoal({ ...initialGoalState, attribute: attr });
    setEditIndex(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (idx) => {
    setGoal(goals[idx]);
    setEditIndex(idx);
    setIsModalOpen(true);
  };

  // Open confirm for delete
  const handleDelete = (idx) => {
    setDeleteIndex(idx);
  };

  // Confirm delete
  const confirmDelete = () => {
    setGoals(goals.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
  };

  // Cancel delete
  const cancelDelete = () => setDeleteIndex(null);

  // Form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'categories') {
      const val = value;
      setGoal((prev) => ({
        ...prev,
        categories: prev.categories.includes(val)
          ? prev.categories.filter((c) => c !== val)
          : [...prev.categories, val],
      }));
    } else if (type === 'checkbox') {
      setGoal((prev) => ({ ...prev, [name]: checked }));
    } else {
      setGoal((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Save goal (add or edit)
  const handleSave = (e) => {
    e.preventDefault();
    if (!goal.attribute) return;
    if (editIndex !== null) {
      setGoals(goals.map((g, i) => (i === editIndex ? goal : g)));
    } else {
      setGoals([...goals, goal]);
    }
    setIsModalOpen(false);
    setEditIndex(null);
    setGoal(initialGoalState);
  };

  // Cancel modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditIndex(null);
    setGoal(initialGoalState);
  };

  // Toggle completion
  const toggleComplete = (idx) => {
    setGoals(goals.map((g, i) => (i === idx ? { ...g, completed: !g.completed } : g)));
  };

  // Filtering and searching
  const todayStr = new Date().toISOString().slice(0, 10);
  const filteredGoals = goals.filter((g) => {
    if (filter === 'completed' && !g.completed) return false;
    if (filter === 'pending' && g.completed) return false;
    if (filter === 'today' && g.dueDate !== todayStr) return false;
    if (search && !g.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    // Sort by priority: High > Medium > Low
    const pOrder = { High: 0, Medium: 1, Low: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  // Overdue check
  const isOverdue = (g) => g.dueDate && !g.completed && g.dueDate < todayStr;

  return (
    <div className="ambition-box">
      <div className="ambition-header">
        <h2>Ambition / Goal</h2>
        <button className="ambition-big-plus" onClick={handleBigPlus}>+</button>
        <span className="ambition-add">(++)</span>
      </div>
      <ul className="ambition-attr-list">
        {attributeNames.map((attr) => (
          <li key={attr} className="ambition-attr-item">
            <span>{attr}</span>
            <button className="ambition-plus" onClick={() => handleOpen(attr)}>+</button>
          </li>
        ))}
      </ul>

      {/* Filter & Search */}
      <div className="ambition-filters">
        <button onClick={() => setFilter('all')} className={filter==='all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('completed')} className={filter==='completed' ? 'active' : ''}>Completed</button>
        <button onClick={() => setFilter('pending')} className={filter==='pending' ? 'active' : ''}>Pending</button>
        <button onClick={() => setFilter('today')} className={filter==='today' ? 'active' : ''}>Today</button>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{marginLeft:'1rem',padding:'0.3rem 0.7rem',borderRadius:6,border:'1px solid #ccc'}}
        />
      </div>

      {/* List of goals/tasks */}
      {filteredGoals.length > 0 && (
        <div className="ambition-goal-list">
          <h3 style={{marginTop:'2rem', color:'#bb86fc'}}>Your Goals</h3>
          <ul>
            {filteredGoals.map((g, idx) => (
              <li
                key={idx}
                className={`ambition-goal-item${g.completed ? ' completed' : ''}${isOverdue(g) ? ' overdue' : ''}`}
              >
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <input type="checkbox" checked={g.completed} onChange={() => toggleComplete(goals.indexOf(g))} />
                  <div>
                    <b>{g.description}</b> <span style={{color:'#888'}}>({g.attribute})</span>
                    {g.priority && (
                      <span className={`priority-badge${g.priority === 'High' ? ' high' : ''}`}>{g.priority}</span>
                    )}
                    {g.categories && g.categories.map(cat => (
                      <span key={cat} style={{background:'#222',color:'#fff',borderRadius:4,padding:'0.1rem 0.5rem',marginLeft:6,fontSize:'0.85em',backgroundColor:'#444'}}>{cat}</span>
                    ))}
                    {isOverdue(g) && <span style={{color:'#e53935',marginLeft:8,fontWeight:'bold'}}>Overdue!</span>}
                    <br/>
                    <small>Time: {g.timePeriod}, Target: {g.targetDate}, Due: {g.dueDate || 'N/A'}, Difficulty: {g.difficulty} ({difficultyPoints[g.difficulty]} pts)</small>
                  </div>
                </div>
                <div className="ambition-goal-actions">
                  <button onClick={() => handleEdit(goals.indexOf(g))} title="Edit">✏️</button>
                  <button onClick={() => handleDelete(goals.indexOf(g))} title="Delete">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for add/edit */}
      {isModalOpen && (
        <div className="ambition-modal">
          <form className="ambition-form" onSubmit={handleSave}>
            <h3>{editIndex !== null ? 'Edit Goal' : 'Set a New Goal'}</h3>
            <label htmlFor="goal-attribute">Attribute</label>
            <select id="goal-attribute" name="attribute" value={goal.attribute} onChange={handleChange} required>
              <option value="" disabled>Select Attribute</option>
              {attributeNames.map((attr) => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </select>
            <label htmlFor="goal-description">Goal Description</label>
            <textarea
              id="goal-description"
              name="description"
              value={goal.description}
              onChange={handleChange}
              placeholder="e.g., Run a marathon, Learn a new language, Read 12 books"
              required
            />
            <div className="ambition-form-row">
              <div>
                <label htmlFor="goal-timePeriod">Time Period</label>
                <select id="goal-timePeriod" name="timePeriod" value={goal.timePeriod} onChange={handleChange}>
                  {timePeriods.map((tp) => (
                    <option key={tp} value={tp}>{tp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="goal-targetDate">Target Date</label>
                <input type="date" id="goal-targetDate" name="targetDate" value={goal.targetDate} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="goal-dueDate">Due Date (optional)</label>
                <input type="date" id="goal-dueDate" name="dueDate" value={goal.dueDate} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="goal-difficulty">Difficulty Level</label>
                <select id="goal-difficulty" name="difficulty" value={goal.difficulty} onChange={handleChange}>
                  <option value="Hard">Hard</option>
                  <option value="Medium">Medium</option>
                  <option value="Easy">Easy</option>
                </select>
                <div className="ambition-points">Points: <b>{difficultyPoints[goal.difficulty]}</b></div>
              </div>
              <div>
                <label htmlFor="goal-priority">Priority</label>
                <select id="goal-priority" name="priority" value={goal.priority} onChange={handleChange}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label>Categories</label>
                <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                  {allCategories.map(cat => (
                    <label key={cat} style={{display:'flex',alignItems:'center',gap:2}}>
                      <input
                        type="checkbox"
                        name="categories"
                        value={cat}
                        checked={goal.categories.includes(cat)}
                        onChange={handleChange}
                        id={`goal-category-${cat}`}
                      />
                      <span style={{background:'#444',color:'#fff',borderRadius:4,padding:'0.1rem 0.5rem',fontSize:'0.9em'}}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="ambition-form-actions">
              <button type="submit" className="ambition-save">{editIndex !== null ? 'Save Changes' : 'Save Goal'}</button>
              <button type="button" className="ambition-cancel" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm delete modal */}
      {deleteIndex !== null && (
        <div className="ambition-modal">
          <div className="ambition-form" style={{textAlign:'center'}}>
            <h3>Delete Goal?</h3>
            <p>Are you sure you want to delete this goal?</p>
            <div className="ambition-form-actions" style={{justifyContent:'center'}}>
              <button className="ambition-save" onClick={confirmDelete}>Yes, Delete</button>
              <button className="ambition-cancel" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbitionBox; 