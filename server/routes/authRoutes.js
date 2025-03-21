
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const passport = require('passport');
const authController = require('../controllers/authController');

// Middleware for protecting routes
const protect = passport.authenticate('jwt', { session: false });

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.registerUser
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.loginUser
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, authController.getCurrentUser);

// @route   GET /api/auth/google
// @desc    Auth with Google
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

module.exports = router;
