import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Chart from './components/Chart';
import TaskQuiz from './components/TaskQuiz';
import DailyCheckIn from './components/DailyCheckIn';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import AmbitionBox from './components/AmbitionBox';
import initialData from './data/initialData.json';
import './components/Dashboard.css';
import './components/AmbitionBox.css';
import Squares from './components/Squares.jsx';

// Metallic black and chrome palette
const METALLIC_BLACK = 'linear-gradient(135deg, #181818 80%, #232323 100%)';
const CHROME_TEXT = 'linear-gradient(90deg, #f3f3f3 0%, #e0e0e0 50%, #bfc1c2 100%)';

const App = () => {
  const [attributes, setAttributes] = useState(initialData.attributes);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    document.body.style.backgroundColor = isDarkTheme ? '#1a1a1a' : '#f5f5f5';
  }, [isDarkTheme]);

  const handleTaskComplete = (attribute, taskId, points) => {
    setAttributes(prevAttributes => {
      // Deep copy levels and tasks to ensure immutability
      const newLevels = { ...prevAttributes.levels };
      const attributeData = { ...newLevels[attribute] };
      const newTasks = attributeData.tasks.map(task => {
        if (task.id === taskId) {
          // Toggle completed
          if (task.completed) {
            return { ...task, completed: false };
          } else {
            return { ...task, completed: true, completedAt: Date.now() };
          }
        }
        return task;
      });
      // Calculate new XP
      let newXP = attributeData.xp;
      const toggledTask = attributeData.tasks.find(t => t.id === taskId);
      if (toggledTask && toggledTask.completed) {
        // Undo completion
        newXP = Math.max(0, newXP - points);
      } else {
        // Mark as completed
        newXP += points;
      }
      // Level up if needed
      let newLevel = attributeData.level;
      let newNextLevel = attributeData.nextLevel;
      if (newXP >= newNextLevel) {
        newLevel += 1;
        newXP -= newNextLevel;
        newNextLevel = Math.floor(newNextLevel * 1.5);
      }
      newLevels[attribute] = {
        ...attributeData,
        tasks: newTasks,
        xp: newXP,
        level: newLevel,
        nextLevel: newNextLevel,
      };
      return {
        ...prevAttributes,
        levels: newLevels,
      };
    });
  };

  return (
    <AppContainer isDark={isDarkTheme}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          hoverFillColor='#222'
          isDark={isDarkTheme}
        />
      </div>
      <div style={{position: 'relative', zIndex: 1}}>
        <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
        <Header>
          <h1>Brogress</h1>
          <p>Track your personal growth journey</p>
        </Header>
        <MainContent>
          <FullWidthSection>
            <Dashboard isDark={isDarkTheme} />
          </FullWidthSection>
          <FullWidthSection>
            <h2>Attribute Progress</h2>
            <ChartContainer>
              <Chart attributes={attributes} />
            </ChartContainer>
          </FullWidthSection>
          <FullWidthSection>
            <AmbitionBox attributes={attributes} isDark={isDarkTheme} />
          </FullWidthSection>
          <Section>
            <h2>Daily Check-In</h2>
            <DailyCheckIn 
              attributes={attributes} 
              onTaskComplete={handleTaskComplete}
              isDark={isDarkTheme}
            />
          </Section>
          <Section>
            <h2>Task History</h2>
            <TaskQuiz attributes={attributes} isDark={isDarkTheme} />
          </Section>
        </MainContent>
      </div>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background: #11100E;
  padding: 2rem;
  transition: all 0.3s ease;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    background: ${CHROME_TEXT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: #f3f3f3;
    margin-bottom: 0.5rem;
    font-weight: 800;
    letter-spacing: 2px;
  }

  p {
    color: #e0e0e0;
    font-size: 1.1rem;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Section = styled.section`
  background: ${METALLIC_BLACK};
  color: #f3f3f3;
  border-radius: 2rem;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  transition: all 0.3s ease;
  border: 1px solid #232323;
  overflow: hidden;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
    background: ${CHROME_TEXT};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: #f3f3f3;
    letter-spacing: 1px;
  }
`;

const FullWidthSection = styled(Section)`
  grid-column: 1 / -1;
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
  background: ${METALLIC_BLACK};
  border-radius: 1.5rem;
  padding: 1rem;
  border: 1px solid #232323;
`;

export default App;
