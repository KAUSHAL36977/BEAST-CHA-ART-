const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('height').optional().isFloat({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 }),
  body('age').optional().isInt({ min: 0 }),
  validate
];

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate
];

// User validators
const updateProfileValidator = [
  body('name').optional().trim().notEmpty(),
  body('height').optional().isFloat({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 }),
  body('age').optional().isInt({ min: 0 }),
  body('goals').optional().isString(),
  validate
];

const updatePasswordValidator = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  validate
];

// Goal validators
const goalValidator = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('category').isIn(['Physical', 'Mental', 'Intellect', 'Ambition', 'Discipline', 'Relationship']),
  body('timeframe').isIn(['1 day', '1 week', '1 month', '3 months', '6 months', '1 year', 'Life']),
  body('targetDate').isISO8601(),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
  validate
];

const goalIdValidator = [
  param('id').isUUID(),
  validate
];

// Attribute validators
const attributeValidator = [
  body('physical').isInt({ min: 0, max: 100 }),
  body('mental').isInt({ min: 0, max: 100 }),
  body('intellect').isInt({ min: 0, max: 100 }),
  body('ambition').isInt({ min: 0, max: 100 }),
  body('discipline').isInt({ min: 0, max: 100 }),
  body('relationship').isInt({ min: 0, max: 100 }),
  validate
];

const attributeNameValidator = [
  param('attribute').isIn(['physical', 'mental', 'intellect', 'ambition', 'discipline', 'relationship']),
  body('value').isInt({ min: 0, max: 100 }),
  validate
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  updatePasswordValidator,
  goalValidator,
  goalIdValidator,
  attributeValidator,
  attributeNameValidator
}; 