const express = require('express');
const router = express.Router();
const Attribute = require('../models/Attribute');
const auth = require('../middleware/auth');

// Get user attributes
router.get('/', auth, async (req, res) => {
  try {
    const attributes = await Attribute.findOne({
      where: { userId: req.user.id }
    });

    if (!attributes) {
      return res.status(404).json({ error: 'Attributes not found' });
    }

    res.json(attributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update user attributes
router.post('/', auth, async (req, res) => {
  try {
    const {
      physical,
      mental,
      intellect,
      ambition,
      discipline,
      relationship
    } = req.body;

    const [attributes, created] = await Attribute.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        physical,
        mental,
        intellect,
        ambition,
        discipline,
        relationship,
        lastUpdated: new Date()
      }
    });

    if (!created) {
      attributes.physical = physical;
      attributes.mental = mental;
      attributes.intellect = intellect;
      attributes.ambition = ambition;
      attributes.discipline = discipline;
      attributes.relationship = relationship;
      attributes.lastUpdated = new Date();
      await attributes.save();
    }

    res.status(created ? 201 : 200).json(attributes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update specific attribute
router.patch('/:attribute', auth, async (req, res) => {
  const attribute = req.params.attribute;
  const allowedAttributes = ['physical', 'mental', 'intellect', 'ambition', 'discipline', 'relationship'];

  if (!allowedAttributes.includes(attribute)) {
    return res.status(400).json({ error: 'Invalid attribute' });
  }

  try {
    const userAttributes = await Attribute.findOne({
      where: { userId: req.user.id }
    });

    if (!userAttributes) {
      return res.status(404).json({ error: 'Attributes not found' });
    }

    userAttributes[attribute] = req.body.value;
    userAttributes.lastUpdated = new Date();
    await userAttributes.save();

    res.json(userAttributes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 