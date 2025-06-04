import React, { useState } from 'react';

const InputsContainer = ({ onAttributeChange }) => {
  const [attributes, setAttributes] = useState({
    strength: 50,
    cardio: 50,
    flexibility: 50,
    balance: 50,
    endurance: 50
  });

  const handleSliderChange = (attribute, value) => {
    const newAttributes = {
      ...attributes,
      [attribute]: parseInt(value)
    };
    setAttributes(newAttributes);
    onAttributeChange(newAttributes);
  };

  return (
    <div className="inputs-container">
      {Object.entries(attributes).map(([key, value]) => (
        <div key={key} className="attribute-slider">
          <div className="slider-header">
            <div className="slider-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div className="slider-value">{value}</div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleSliderChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default InputsContainer; 