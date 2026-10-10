// routes/locations.js
const express = require('express');
const router  = express.Router();
const {
  getAllLocations,
  getLatestLocations,
  getUserLocationStats,
  getUserLocations,
} = require('../controllers/locationsController');

// NOTE: specific routes must come BEFORE /:userId to avoid conflicts
router.get('/',              getAllLocations);       // GET /api/locations
router.get('/latest',        getLatestLocations);    // GET /api/locations/latest
router.get('/stats/:userId', getUserLocationStats);  // GET /api/locations/stats/1
router.get('/:userId',       getUserLocations);      // GET /api/locations/1

module.exports = router;
