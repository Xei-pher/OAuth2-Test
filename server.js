// server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const path = require('path');

const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./config/passport')(passport);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index'); // Home page
});

app.get('/login', (req, res) => {
  res.render('login'); // Login page
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    // Redirect to confirmation page
    res.redirect(`/confirm?email=${encodeURIComponent(req.user.emails[0].value)}`);
  });

app.get('/confirm', (req, res) => {
  const email = req.query.email;
  res.render('confirm', { email });
});

app.post('/confirm', (req, res) => {
  const { action } = req.body;
  if (action === 'signup') {
    // Handle signup
    // Save user to the database
  } else if (action === 'login') {
    // Handle login
    // Start a session
  }
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
