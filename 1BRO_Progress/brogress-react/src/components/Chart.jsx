import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import styled from '@emotion/styled';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Chart = ({ attributes }) => {
  const data = {
    labels: attributes.labels,
    datasets: [
      {
        label: 'Attribute Levels',
        data: attributes.labels.map(label => attributes.levels[label].level),
        backgroundColor: 'rgba(98, 0, 234, 0.2)',
        borderColor: '#6200EA',
        borderWidth: 2,
        pointBackgroundColor: '#6200EA',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6200EA'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: '#e0e0e0'
        },
        grid: {
          color: '#e0e0e0'
        },
        pointLabels: {
          color: '#2C2C2C',
          font: {
            size: 14,
            weight: '500'
          }
        },
        ticks: {
          color: '#666666',
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(98, 0, 234, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  return (
    <ChartContainer>
      <Radar data={data} options={options} />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Chart; 