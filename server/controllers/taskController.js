
const Task = require('../models/Task');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @route   GET /api/tasks
// @desc    Get all tasks for the current user or all tasks for admin
// @access  Private
const getTasks = async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin') {
      // Admins see all tasks
      tasks = await Task.find()
        .populate('assignedTo', 'name email avatar')
        .populate('createdBy', 'name email avatar')
        .sort({ createdAt: -1 });
    } else {
      // Regular users see only tasks assigned to them or created by them
      tasks = await Task.find({
        $or: [
          { assignedTo: req.user._id },
          { createdBy: req.user._id }
        ]
      })
        .populate('assignedTo', 'name email avatar')
        .populate('createdBy', 'name email avatar')
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startDate, endDate, assignedTo } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      startDate,
      endDate,
      assignedTo,
      createdBy: req.user._id
    });

    const task = await newTask.save();
    
    // Populate user details
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, status, startDate, endDate, assignedTo } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check user authorization
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (startDate) task.startDate = startDate;
    if (endDate) task.endDate = endDate;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();
    
    // Return updated task with populated fields
    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check user authorization
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await task.remove();

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/tasks/users
// @desc    Get all users for task assignment
// @access  Private
const getUsers = async (req, res) => {
  try {
    // Only fetch basic user information needed for assignment
    const users = await User.find().select('name email avatar role');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/tasks/:id/status
// @desc    Update task status (in progress, completed)
// @access  Private
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Only assignee can update status to in_progress
    if (status === 'in_progress' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Only assignee can mark as in progress' });
    }

    task.status = status;
    await task.save();
    
    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUsers,
  updateTaskStatus
};
