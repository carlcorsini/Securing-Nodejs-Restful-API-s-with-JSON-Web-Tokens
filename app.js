const express = require('express');
const app = express();
const db = require('./db');

const AuthController = require('./auth/AuthController');

app.get('/api', (req, res) => {
  res.status(200).send('Api works');
})

app.use('/api/auth', AuthController);

module.exports = app;
