// Initialize Chart.js
let chart;
const ctx = document.getElementById('progressChart').getContext('2d');

// Initialize attributes
const attributes = {
  strength: 0,
  cardio: 0,
  flexibility: 0,
  nutrition: 0,
  sleep: 0,
  stress: 0
};

// Initialize tasks array
let tasks = [];

// Load saved data from localStorage
function loadSavedData() {
  const savedAttributes = localStorage.getItem('attributes');
  const savedTasks = localStorage.getItem('tasks');
  
  if (savedAttributes) {
    Object.assign(attributes, JSON.parse(savedAttributes));
    updateAllSliders();
  }
  
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
  
  updateChart();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('attributes', JSON.stringify(attributes));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update slider value and save
function updateSlider(attribute, value) {
  attributes[attribute] = value;
  document.querySelector(`#${attribute}-value`).textContent = value;
  saveData();
  updateChart();
}

// Update all sliders based on saved values
function updateAllSliders() {
  for (const [attribute, value] of Object.entries(attributes)) {
    const slider = document.querySelector(`#${attribute}-slider`);
    const valueDisplay = document.querySelector(`#${attribute}-value`);
    if (slider && valueDisplay) {
      slider.value = value;
      valueDisplay.textContent = value;
    }
  }
}

// Calculate and update average score
function updateAverageScore() {
  const values = Object.values(attributes);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  document.querySelector('.score-value').textContent = Math.round(average);
}

// Initialize and update the chart
function updateChart() {
  if (chart) {
    chart.destroy();
  }

  const data = {
    labels: Object.keys(attributes).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [{
      label: 'Progress',
      data: Object.values(attributes),
      backgroundColor: 'rgba(98, 0, 234, 0.2)',
      borderColor: '#6200EA',
      borderWidth: 2,
      pointBackgroundColor: '#00E5FF',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#00E5FF'
    }]
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      scales: {
        r: {
          angleLines: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          pointLabels: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)',
            backdropColor: 'transparent'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  };

  chart = new Chart(ctx, config);
  updateAverageScore();
}

// Add new task
function addTask() {
  const taskInput = document.querySelector('#taskInput');
  const taskText = taskInput.value.trim();
  
  if (taskText) {
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false
    };
    
    tasks.push(task);
    taskInput.value = '';
    renderTasks();
    saveData();
  }
}

// Delete task
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
  saveData();
}

// Toggle task completion
function toggleTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
    saveData();
  }
}

// Render tasks in the task list
function renderTasks() {
  const taskList = document.querySelector('.task-list');
  taskList.innerHTML = '';
  
  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.innerHTML = `
      <span class="task-text ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">
        ${task.text}
      </span>
      <button class="delete-task" onclick="deleteTask(${task.id})">×</button>
    `;
    taskList.appendChild(taskElement);
  });
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load saved data
  loadSavedData();
  
  // Add task button event listener
  document.querySelector('#addTaskBtn').addEventListener('click', addTask);
  
  // Add task input enter key event listener
  document.querySelector('#taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  
  // Add slider event listeners
  for (const attribute of Object.keys(attributes)) {
    const slider = document.querySelector(`#${attribute}-slider`);
    if (slider) {
      slider.addEventListener('input', (e) => {
        updateSlider(attribute, parseInt(e.target.value));
      });
    }
  }
}); 