const express = require('express');
const app = express();
const authRoutes = require('./auth');
const songRoutes = require('./songs');

// ...existing middleware and route registrations...

app.use('/api', authRoutes);
app.use('/api', songRoutes);

// ...existing error handling and server start logic...

module.exports = app;