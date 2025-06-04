import React, { useState } from 'react';
import styled from '@emotion/styled';

const attributeIcons = {
  Physical: '🏃‍♂️',
  Mental: '🧠',
  Intellect: '💡',
};

const DailyCheckIn = ({ attributes, onTaskComplete }) => {
  // Track which checkboxes are temporarily disabled
  const [disabledIds, setDisabledIds] = useState([]);

  const handleTaskToggle = (attributeLabel, taskId, points) => {
    setDisabledIds(ids => [...ids, `${attributeLabel}-${taskId}`]);
    onTaskComplete(attributeLabel, taskId, points);
    setTimeout(() => {
      setDisabledIds(ids => ids.filter(id => id !== `${attributeLabel}-${taskId}`));
    }, 300);
  };

  return (
    <CardContainer>
      <Header>
        <h2>Daily Check-in</h2>
        <p>Log your activities & challenges to update your stats.</p>
      </Header>
      <SectionList>
        {attributes.labels.map(label => {
          const attr = attributes.levels[label];
          const xpPercent = Math.min(100, (attr.xp / attr.nextLevel) * 100);
          return (
            <SectionCard key={label}>
              <SectionHeader>
                <span className="section-icon">{attributeIcons[label] || '⭐'}</span>
                <span className="section-title">{label}</span>
              </SectionHeader>
              <XPBarContainer>
                <XPBarBg>
                  <XPBarFill style={{ width: `${xpPercent}%` }} />
                </XPBarBg>
                <XPText>{attr.xp}/{attr.nextLevel} XP</XPText>
              </XPBarContainer>
              <TaskList>
                {attr.tasks.map(task => (
                  <TaskRow key={task.id}>
                    <Checkbox
                      type="checkbox"
                      checked={task.completed}
                      aria-label={task.title}
                      disabled={disabledIds.includes(`${label}-${task.id}`)}
                      onChange={() => handleTaskToggle(label, task.id, task.points)}
                    />
                    <TaskTitle completed={task.completed} negative={task.points < 0}>
                      {task.title}
                    </TaskTitle>
                    <TaskPoints positive={task.points > 0} negative={task.points < 0}>
                      {task.points > 0 ? '✔️ +' : '✖️ '}{task.points} XP
                    </TaskPoints>
                  </TaskRow>
                ))}
              </TaskList>
            </SectionCard>
          );
        })}
      </SectionList>
      <UpdateButton>Update Stats →</UpdateButton>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: var(--ambition-bg, #18181b);
  color: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  margin: 0 auto;
  max-width: 700px;
  width: 100%;
  margin-bottom: 2rem;
  @media (max-width: 800px) {
    padding: 1.2rem 0.5rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h2 {
    font-size: 1.6rem;
    color: #bb86fc;
    margin-bottom: 0.2rem;
  }
  p {
    color: #aaa;
    font-size: 1rem;
    margin: 0;
  }
`;

const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
`;

const SectionCard = styled.div`
  background: rgba(40,40,48,0.95);
  border-radius: 14px;
  padding: 1.2rem 1rem 1rem 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.1rem;
  .section-icon {
    font-size: 1.5rem;
  }
  .section-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: #bb86fc;
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 0.5rem;
  border-radius: 8px;
  background: transparent;
  transition: background 0.2s;
  &:hover {
    background: rgba(187,134,252,0.07);
  }
`;

const Checkbox = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  accent-color: #bb86fc;
  border-radius: 4px;
  border: 2px solid #bb86fc;
  background: #23232b;
  cursor: pointer;
`;

const TaskTitle = styled.span`
  flex: 1;
  color: ${({ completed, negative }) =>
    completed ? '#43a047' : negative ? '#e53935' : '#fff'};
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
  font-weight: 500;
  font-size: 1.05rem;
`;

const TaskPoints = styled.span`
  font-size: 0.98rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.2rem 0.7rem;
  background: ${({ positive, negative }) =>
    positive ? 'rgba(67,160,71,0.13)' : negative ? 'rgba(229,57,53,0.13)' : '#23232b'};
  color: ${({ positive, negative }) =>
    positive ? '#43a047' : negative ? '#e53935' : '#fff'};
  margin-left: 0.5rem;
`;

const UpdateButton = styled.button`
  margin-top: 2.2rem;
  background: linear-gradient(90deg, #7b2cbf, #00c6fb);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  &:hover {
    background: linear-gradient(90deg, #bb86fc, #00c6fb);
    transform: translateY(-2px) scale(1.03);
  }
  &:active {
    transform: scale(0.96);
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }
  &:focus {
    outline: 2px solid #bb86fc;
    outline-offset: 2px;
  }
  @media (hover: none) and (pointer: coarse) {
    &:active {
      background-color: #e0e0e0 !important;
      filter: brightness(0.95);
    }
  }
`;

const XPBarContainer = styled.div`
  margin-bottom: 1.1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const XPBarBg = styled.div`
  flex: 1;
  height: 10px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
`;
const XPBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #7b2cbf, #00c6fb);
  border-radius: 6px;
  transition: width 0.5s cubic-bezier(.4,0,.2,1);
`;
const XPText = styled.span`
  color: #bb86fc;
  font-size: 0.98rem;
  font-weight: 600;
`;

export default DailyCheckIn; 