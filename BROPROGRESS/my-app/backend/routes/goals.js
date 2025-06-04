const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const { goalValidator, goalIdValidator } = require('../middleware/validators');
const { goalCreationLimiter } = require('../middleware/rateLimiter');

// Create new goal
router.post('/', auth, goalCreationLimiter, goalValidator, async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all goals for user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get goal by ID
router.get('/:id', auth, goalIdValidator, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update goal
router.patch('/:id', auth, goalIdValidator, goalValidator, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'category', 'timeframe', 'targetDate', 'status', 'difficulty'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    updates.forEach(update => goal[update] = req.body[update]);
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete goal
router.delete('/:id', auth, goalIdValidator, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await goal.destroy();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 