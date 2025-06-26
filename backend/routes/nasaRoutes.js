const express = require('express');
const axios = require('axios');
const router = express.Router();

const NASA_API_KEY = process.env.NASA_API_KEY;

router.get('/apod', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch APOD data' });
  }
});

router.get('/mars-photos', async (req, res) => {
  try {
    const { rover, camera, earth_date } = req.query;

    const params = {
      earth_date,
      api_key: NASA_API_KEY,
    };

    if (camera && camera !== '') {
      params.camera = camera;
    }

    const response = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
      { params }
    );

    res.json(response.data);
  } catch (error) {
    console.error('[Error fetching Mars photos]', error.message);
    res.status(500).json({ error: 'Failed to fetch Mars photos' });
  }
});

router.get('/neo-feed', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
      params: {
        start_date,
        end_date,
        api_key: NASA_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('[Error fetching NEO data]', error.message);
    res.status(500).json({ error: 'Failed to fetch NEO data' });
  }
});

module.exports = router;
