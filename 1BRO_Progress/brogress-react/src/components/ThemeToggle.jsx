import React from 'react';
import styled from '@emotion/styled';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <ToggleButton onClick={onToggle} isDark={isDark}>
      {isDark ? '☀️' : '🌙'}
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.isDark ? '#2c2c2c' : '#ffffff'};
  color: ${props => props.isDark ? '#ffffff' : '#2c2c2c'};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
  }
`;

export default ThemeToggle; 