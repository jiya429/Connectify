const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (simulating a database)
let users = [];
let posts = [];
let messages = [];
let notifications = [];
let friendRequests = [];
let reels = [];

// Logging middleware to show activity in terminal
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  console.log('✓ Server health check');
  res.json({ message: 'Connectify Backend is running!' });
});

// User routes
app.post('/api/users/register', (req, res) => {
  console.log('📝 New user registration:', req.body.username);
  users.push(req.body);
  res.json({ success: true, message: 'User registered successfully' });
});

app.post('/api/users/login', (req, res) => {
  console.log('🔐 User login attempt:', req.body.username);
  const user = users.find(u => u.username === req.body.username);
  res.json({ success: !!user, user });
});

// Post routes
app.post('/api/posts', (req, res) => {
  console.log('📸 New post created by:', req.body.username);
  posts.push(req.body);
  res.json({ success: true, post: req.body });
});

app.get('/api/posts', (req, res) => {
  console.log('📋 Fetching all posts');
  res.json({ posts });
});

// Reel routes
app.post('/api/reels', (req, res) => {
  console.log('🎬 New reel posted by:', req.body.username);
  reels.push(req.body);
  res.json({ success: true, reel: req.body });
});

// Message routes
app.post('/api/messages', (req, res) => {
  console.log('💬 Message sent from', req.body.from, 'to', req.body.to);
  messages.push(req.body);
  res.json({ success: true, message: req.body });
});

// Friend request routes
app.post('/api/friend-requests', (req, res) => {
  console.log('👥 Friend request:', req.body.fromUsername, '→', req.body.toUsername);
  friendRequests.push(req.body);
  res.json({ success: true, request: req.body });
});

// Notification routes
app.post('/api/notifications', (req, res) => {
  console.log('🔔 Notification sent to:', req.body.toUsername);
  notifications.push(req.body);
  res.json({ success: true, notification: req.body });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 CONNECTIFY BACKEND SERVER STARTED');
  console.log('='.repeat(50));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50) + '\n');
  console.log('📊 Activity Log:');
  console.log('-'.repeat(50));
});