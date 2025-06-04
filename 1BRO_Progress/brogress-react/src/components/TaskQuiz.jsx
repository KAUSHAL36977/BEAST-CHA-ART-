import React, { useState } from 'react';
import styled from '@emotion/styled';

const TaskQuiz = ({ attributes }) => {
  const [selectedAttribute, setSelectedAttribute] = useState(attributes.labels[0]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ attribute: '', level: 0 });

  // Calculate completion statistics
  const getCompletionStats = (attribute) => {
    const tasks = attributes.levels[attribute].tasks;
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const successRate = (completed / total) * 100;
    
    return {
      total,
      completed,
      successRate
    };
  };

  // Get recent activity
  const getRecentActivity = (attribute) => {
    return attributes.levels[attribute].tasks
      .filter(task => task.completed)
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 5);
  };

  const handleTaskComplete = (taskId) => {
    const attributeData = attributes.levels[selectedAttribute];
    const task = attributeData.tasks.find(t => t.id === taskId);
    
    if (!task.completed) {
      task.completed = true;
      attributeData.xp += task.points;
      
      if (attributeData.xp >= attributeData.nextLevel) {
        attributeData.level++;
        attributeData.xp -= attributeData.nextLevel;
        attributeData.nextLevel = Math.floor(attributeData.nextLevel * 1.5);
        
        setLevelUpInfo({
          attribute: selectedAttribute,
          level: attributeData.level
        });
        setShowLevelUp(true);
        
        setTimeout(() => {
          setShowLevelUp(false);
        }, 3000);
      }
    }
  };

  return (
    <QuizContainer>
      <AttributeSelector>
        {attributes.labels.map(label => (
          <AttributeButton
            key={label}
            active={selectedAttribute === label}
            onClick={() => setSelectedAttribute(label)}
          >
            {label} (Level {attributes.levels[label].level})
          </AttributeButton>
        ))}
      </AttributeSelector>

      <TaskDisplay>
        <AttributeHeader>
          <h3>{selectedAttribute} Progress</h3>
          <LevelInfo>
            <span>Level {attributes.levels[selectedAttribute].level}</span>
            <XpBar>
              <XpProgress
                width={(attributes.levels[selectedAttribute].xp / attributes.levels[selectedAttribute].nextLevel) * 100}
              />
            </XpBar>
            <span>{attributes.levels[selectedAttribute].xp}/{attributes.levels[selectedAttribute].nextLevel} XP</span>
          </LevelInfo>
        </AttributeHeader>

        <StatsSection>
          <StatItem>
            <StatLabel>Tasks Completed</StatLabel>
            <StatValue>
              {getCompletionStats(selectedAttribute).completed} / {getCompletionStats(selectedAttribute).total}
            </StatValue>
            <StatProgress
              width={getCompletionStats(selectedAttribute).successRate}
            />
          </StatItem>
        </StatsSection>

        <TaskList>
          <h4>Recent Activity</h4>
          {getRecentActivity(selectedAttribute).map(task => (
            <TaskItem key={task.id} completed={task.completed}>
              <TaskContent>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskPoints positive={task.points > 0}>
                  {task.points > 0 ? '+' : ''}{task.points}
                </TaskPoints>
              </TaskContent>
              <TaskStatus>
                <CompletedBadge>Completed</CompletedBadge>
              </TaskStatus>
            </TaskItem>
          ))}
        </TaskList>
      </TaskDisplay>

      {showLevelUp && (
        <LevelUpAnimation>
          <LevelUpContent>
            <h2>Level Up!</h2>
            <p>{levelUpInfo.attribute} is now level {levelUpInfo.level}</p>
          </LevelUpContent>
        </LevelUpAnimation>
      )}
    </QuizContainer>
  );
};

// Styled Components
const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AttributeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
`;

const AttributeButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? '#6200EA' : 'white'};
  color: ${props => props.active ? 'white' : '#2C2C2C'};
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #6200EA;
    color: white;
    border-color: #6200EA;
  }
`;

const TaskDisplay = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const AttributeHeader = styled.div`
  padding: 1rem;
  background-color: #6200EA;
  color: white;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
  }
`;

const LevelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const XpBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  overflow: hidden;
`;

const XpProgress = styled.div`
  height: 100%;
  background-color: #1DE9B6;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

const StatsSection = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: #666666;
`;

const StatValue = styled.span`
  font-weight: 500;
  color: #2C2C2C;
`;

const StatProgress = styled.div`
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 999px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.width}%;
    background-color: #6200EA;
    transition: width 0.3s ease;
  }
`;

const TaskList = styled.div`
  padding: 1rem;

  h4 {
    color: #2C2C2C;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
`;

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.completed ? 'rgba(29, 233, 182, 0.1)' : '#f5f5f5'};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.completed ? '#1DE9B6' : '#e0e0e0'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const TaskContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const TaskTitle = styled.span`
  font-weight: 500;
`;

const TaskPoints = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: ${props => props.positive ? 'rgba(29, 233, 182, 0.1)' : 'rgba(255, 82, 82, 0.1)'};
  color: ${props => props.positive ? '#1DE9B6' : '#FF5252'};
`;

const TaskStatus = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CompletedBadge = styled.span`
  padding: 2px 8px;
  background-color: #1DE9B6;
  color: white;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const LevelUpAnimation = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #6200EA;
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: levelUp 3s ease-in-out;
  z-index: 1000;

  @keyframes levelUp {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
    20% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 1;
    }
    80% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
  }
`;

const LevelUpContent = styled.div`
  text-align: center;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

export default TaskQuiz; 