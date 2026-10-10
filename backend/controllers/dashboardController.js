// controllers/dashboardController.js
const pool = require('../db');

// GET /api/dashboard/stats
async function getStats(req, res) {
  try {
    const [[{ total_employees }]] = await pool.query(
      'SELECT COUNT(*) AS total_employees FROM users'
    );
    const [[{ total_locations }]] = await pool.query(
      'SELECT COUNT(*) AS total_locations FROM locations'
    );
    const [[{ employees_with_locations }]] = await pool.query(
      'SELECT COUNT(DISTINCT user_id) AS employees_with_locations FROM locations'
    );
    const [[{ total_productive }]] = await pool.query(
      "SELECT SUM(productivity = 'Productive') AS total_productive FROM locations"
    );
    const [[{ total_non_productive }]] = await pool.query(
      "SELECT SUM(productivity = 'Non-Productive') AS total_non_productive FROM locations"
    );
    res.json({
      total_employees:          parseInt(total_employees, 10),
      total_locations:          parseInt(total_locations, 10),
      employees_with_locations: parseInt(employees_with_locations, 10),
      total_productive:         parseInt(total_productive, 10),
      total_non_productive:     parseInt(total_non_productive, 10),
    });
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}

module.exports = { getStats };
