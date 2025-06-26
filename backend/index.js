// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const nasaRoutes = require('./routes/nasaRoutes');

const app = express();

app.use(cors());
app.use('/api/nasa', nasaRoutes);

// ❗ DO NOT CALL app.listen()
// Export the app so it can be used in serverless environments
module.exports = app;
