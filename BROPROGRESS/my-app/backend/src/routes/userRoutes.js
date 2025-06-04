const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Get all users (admin only)
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.patch('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

// Get user's workspaces
router.get('/:id/workspaces', userController.getUserWorkspaces);

module.exports = router; 