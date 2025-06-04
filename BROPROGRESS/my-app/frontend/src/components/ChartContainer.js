import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartContainer = ({ attributes }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.values(attributes).map(attr => attr.name),
        datasets: [{
          label: 'Level',
          data: Object.values(attributes).map(attr => attr.level),
          backgroundColor: 'rgba(98, 0, 234, 0.2)',
          borderColor: '#6200EA',
          pointBackgroundColor: '#00E5FF',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#00E5FF'
        }]
      },
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
              backdropColor: 'transparent',
              max: 100,
              min: 0
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [attributes]);

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="score-display">
        <div className="score-label">Overall Level</div>
        <div className="score-value">
          {Math.round(
            Object.values(attributes).reduce((sum, attr) => sum + attr.level, 0) / 
            Object.keys(attributes).length
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartContainer; 