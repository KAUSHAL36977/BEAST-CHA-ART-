// Main App Entry Point
import Chart from '/src/components/Chart.js';
import Slider from '/src/components/Slider.js';
import Log from '/src/components/Log.js';
import { GamificationSystem } from '/src/utils/gamification.js';
import { CheckIn } from '/src/components/CheckIn.js';
// import { api, connectWebSocket } from '/src/utils/api.js';
// import { helpers } from '/src/utils/helpers.js';

const attributeIcons = {
  physical: '/src/assets/icons/physical.svg',
  mental: '/src/assets/icons/mental.svg',
  intellect: '/src/assets/icons/intellect.svg',
  ambition: '/src/assets/icons/ambition.svg',
  discipline: '/src/assets/icons/discipline.svg',
  relationship: '/src/assets/icons/relationship.svg'
};

const attributes = [
  { id: 'physical', label: 'Physical', color: '#ff6384', icon: attributeIcons.physical },
  { id: 'mental', label: 'Mental', color: '#36a2eb', icon: attributeIcons.mental },
  { id: 'intellect', label: 'Intellect', color: '#ffce56', icon: attributeIcons.intellect },
  { id: 'ambition', label: 'Ambition', color: '#4bc0c0', icon: attributeIcons.ambition },
  { id: 'discipline', label: 'Discipline', color: '#9966ff', icon: attributeIcons.discipline },
  { id: 'relationship', label: 'Relationship', color: '#ff9f40', icon: attributeIcons.relationship }
];

// Initialize gamification system
const gamification = new GamificationSystem();
const checkIn = new CheckIn(gamification);

// Mount root app
const appRoot = document.getElementById('app');

// Example: Render a simple header and main layout
appRoot.innerHTML = `
  <div class="header glass">
    <div class="logo">B <span>Bro's Tracker</span></div>
    <div class="header-actions">
      <button id="themeToggle" class="theme-toggle" title="Toggle Theme">🌙</button>
      <button id="startCheckIn" class="button">Start Daily Check-in</button>
    </div>
  </div>
  <main class="main-content">
    <section class="section card">
      <div class="section-header">
        <h2>Attribute Radar</h2>
        <button id="toggleChartBtn" class="button">Chart</button>
      </div>
      <div class="chart-container glass">
        <canvas id="radarChart" width="400" height="400"></canvas>
      </div>
    </section>
    <section class="section card">
      <div class="section-header">
        <h2>Attributes</h2>
      </div>
      <div class="attributes-container">
        ${attributes.map(attr => `
          <div class="attribute-card glass" data-attribute="${attr.id}">
            <div class="attribute-header">
              <img src="${attr.icon}" alt="${attr.label} icon" class="attr-icon">
              <h3>${attr.label}</h3>
            </div>
            <div class="level-display">
              <span class="level">Level ${gamification.attributes[attr.id].level}</span>
              <div class="xp-bar">
                <div class="xp-progress" style="width: ${(gamification.attributes[attr.id].xp / gamification.getXpForNextLevel(gamification.attributes[attr.id].level)) * 100}%"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    <section class="section card">
      <div class="section-header">
        <h2>Progress Log</h2>
        <button id="clearLogBtn" class="button button-secondary">Clear</button>
      </div>
      <div class="log-container"></div>
      <textarea id="logInput" placeholder="Log your achievements..." aria-label="Log your achievements"></textarea>
      <button id="addLogBtn" class="button">Add Log</button>
    </section>
    <section class="section card">
      <div class="section-header">
        <h2>Personality Type</h2>
      </div>
      <div class="personality-card glass">
        <h3>${gamification.calculatePersonalityType().name}</h3>
        <p>${gamification.calculatePersonalityType().description}</p>
      </div>
    </section>
  </main>
  <div id="checkInModal" class="modal">
    <div class="modal-content glass">
      <div class="modal-header">
        <h2>Daily Check-in</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <div id="checkInTasks"></div>
      </div>
      <div class="modal-footer">
        <button id="submitCheckIn" class="button">Submit</button>
      </div>
    </div>
  </div>
`;

// Initialize Chart with new attribute labels
// const chart = new Chart('radarChart');
// chart.chart.data.labels = attributes.map(a => a.label);
// chart.chart.data.datasets[0].data = attributes.map(a => gamification.attributes[a.id].level * 10);
// chart.chart.data.datasets[0].backgroundColor = attributes.map(a => a.color + '33');
// chart.chart.data.datasets[0].borderColor = attributes.map(a => a.color);
// chart.chart.update();

// Initialize Log
const log = new Log();

// Check-in Modal Logic
const modal = document.getElementById('checkInModal');
const startCheckInBtn = document.getElementById('startCheckIn');
const closeModalBtn = document.querySelector('.close-modal');
const submitCheckInBtn = document.getElementById('submitCheckIn');
const checkInTasksContainer = document.getElementById('checkInTasks');

startCheckInBtn.onclick = () => {
  const dailyTasks = checkIn.getRandomTasks();
  checkInTasksContainer.innerHTML = Object.entries(dailyTasks)
    .map(([attribute, tasks]) => `
      <div class="attribute-tasks" data-attribute="${attribute}">
        <h3>${attributes.find(a => a.id === attribute).label}</h3>
        ${tasks.map(task => `
          <div class="task-item">
            <label>
              <input type="checkbox" data-xp="${task.xp}">
              ${task.text}
            </label>
          </div>
        `).join('')}
      </div>
    `).join('');
  modal.style.display = 'block';
};

closeModalBtn.onclick = () => {
  modal.style.display = 'none';
};

submitCheckInBtn.onclick = () => {
  const answers = {};
  document.querySelectorAll('.attribute-tasks').forEach(attrTasks => {
    const attribute = attrTasks.dataset.attribute;
    answers[attribute] = Array.from(attrTasks.querySelectorAll('input[type="checkbox"]'))
      .map(checkbox => ({
        completed: checkbox.checked,
        xp: parseInt(checkbox.dataset.xp)
      }));
  });

  const results = checkIn.submitAnswers(answers);
  
  // Update UI with results
  attributes.forEach(attr => {
    const card = document.querySelector(`[data-attribute="${attr.id}"]`);
    const levelDisplay = card.querySelector('.level');
    const xpProgress = card.querySelector('.xp-progress');
    
    levelDisplay.textContent = `Level ${gamification.attributes[attr.id].level}`;
    xpProgress.style.width = `${(gamification.attributes[attr.id].xp / gamification.getXpForNextLevel(gamification.attributes[attr.id].level)) * 100}%`;
    
    if (results.leveledUp[attr.id]) {
      // Show level up animation
      card.classList.add('level-up');
      setTimeout(() => card.classList.remove('level-up'), 2000);
    }
  });

  // Update chart
  // chart.chart.data.datasets[0].data = attributes.map(a => gamification.attributes[a.id].level * 10);
  // chart.chart.update();

  // Update personality type
  const personalityType = gamification.calculatePersonalityType();
  const personalityCard = document.querySelector('.personality-card');
  personalityCard.querySelector('h3').textContent = personalityType.name;
  personalityCard.querySelector('p').textContent = personalityType.description;

  // Add log entry
  log.addEntry(`Completed daily check-in! Gained ${results.totalXpGained} XP total.`);

  // Close modal
  modal.style.display = 'none';
};

document.getElementById('addLogBtn').onclick = () => {
  const input = document.getElementById('logInput');
  if (input.value.trim()) {
    log.addEntry(input.value.trim());
    input.value = '';
  }
};

document.getElementById('clearLogBtn').onclick = () => {
  log.clearLog();
};

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
}; 