const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    indexes: [
      {
        fields: ['title']
      }
    ]
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Physical', 'Mental', 'Intellect', 'Ambition', 'Discipline', 'Relationship'),
    allowNull: false,
    indexes: [
      {
        fields: ['category']
      }
    ]
  },
  timeframe: {
    type: DataTypes.ENUM('1 day', '1 week', '1 month', '3 months', '6 months', '1 year', 'Life'),
    allowNull: false,
    indexes: [
      {
        fields: ['timeframe']
      }
    ]
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: false,
    indexes: [
      {
        fields: ['targetDate']
      }
    ]
  },
  status: {
    type: DataTypes.ENUM('In Progress', 'Completed', 'On Hold'),
    defaultValue: 'In Progress',
    indexes: [
      {
        fields: ['status']
      }
    ]
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    allowNull: false,
    indexes: [
      {
        fields: ['difficulty']
      }
    ]
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    indexes: [
      {
        fields: ['userId']
      }
    ]
  }
}, {
  indexes: [
    {
      fields: ['createdAt']
    },
    {
      fields: ['updatedAt']
    },
    {
      fields: ['userId', 'status']
    },
    {
      fields: ['userId', 'category']
    }
  ]
});

module.exports = Goal; 