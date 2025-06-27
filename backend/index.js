const express = require('express');
const cors = require('cors');
require('dotenv').config();

const nasaRoutes = require('./routes/nasaRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use('/api/nasa', nasaRoutes);

// ✅ Listen on the port for Render to detect
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
