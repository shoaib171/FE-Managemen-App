
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const passport = require('passport');
const taskController = require('../controllers/taskController');

// Middleware for protecting routes
const protect = passport.authenticate('jwt', { session: false });

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', protect, taskController.getTasks);

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  taskController.createTask
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, taskController.updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, taskController.deleteTask);

// @route   GET /api/tasks/users
// @desc    Get all users for task assignment
// @access  Private
router.get('/users', protect, taskController.getUsers);

// @route   PUT /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.put('/:id/status', protect, taskController.updateTaskStatus);

module.exports = router;
