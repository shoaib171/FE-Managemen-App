
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Initialize middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Passport middleware
app.use(passport.initialize());
require('./config/passport')();

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
