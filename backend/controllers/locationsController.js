// controllers/locationsController.js
const pool = require('../db');

// GET /api/locations — all 500 records with place_name & productivity
async function getAllLocations(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT
        l.id          AS location_id,
        u.id          AS employee_id,
        u.name        AS employee_name,
        l.latitude,
        l.longitude,
        l.recorded_at,
        l.place_name,
        l.productivity
      FROM locations l
      JOIN users u ON l.user_id = u.id
      ORDER BY u.id, l.recorded_at
    `);
    res.json(rows);
  } catch (err) {
    console.error('getAllLocations error:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
}

// GET /api/locations/latest — most recent record per employee
async function getLatestLocations(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT
        u.id   AS employee_id,
        u.name AS employee_name,
        l.latitude,
        l.longitude,
        l.recorded_at,
        l.place_name,
        l.productivity
      FROM users u
      JOIN (
        SELECT user_id, latitude, longitude, recorded_at,
               place_name, productivity,
               ROW_NUMBER() OVER (
                 PARTITION BY user_id
                 ORDER BY recorded_at DESC, id DESC
               ) AS rn
        FROM locations
      ) l ON u.id = l.user_id AND l.rn = 1
      ORDER BY u.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('getLatestLocations error:', err);
    res.status(500).json({ error: 'Failed to fetch latest locations' });
  }
}

// GET /api/locations/stats/:userId — productivity counts for one employee
async function getUserLocationStats(req, res) {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }
  try {
    const [userRows] = await pool.query(
      'SELECT id, name FROM users WHERE id = ?', [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ error: `Employee ${userId} not found.` });
    }
    const [[s]] = await pool.query(`
      SELECT
        COUNT(*)                            AS total,
        SUM(productivity = 'Productive')     AS productive,
        SUM(productivity = 'Non-Productive') AS non_productive
      FROM locations
      WHERE user_id = ?
    `, [userId]);
    res.json({
      employee:      userRows[0],
      total:         parseInt(s.total, 10),
      productive:    parseInt(s.productive, 10),
      non_productive:parseInt(s.non_productive, 10),
    });
  } catch (err) {
    console.error('getUserLocationStats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

// GET /api/locations/:userId — full history for one employee
async function getUserLocations(req, res) {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user ID. Must be a positive integer.' });
  }
  try {
    const [userRows] = await pool.query(
      'SELECT id, name FROM users WHERE id = ?', [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ error: `Employee with ID ${userId} not found.` });
    }
    const [locationRows] = await pool.query(`
      SELECT
        l.id          AS location_id,
        l.user_id     AS employee_id,
        l.latitude,
        l.longitude,
        l.recorded_at,
        l.place_name,
        l.productivity
      FROM locations l
      WHERE l.user_id = ?
      ORDER BY l.recorded_at ASC
    `, [userId]);
    res.json({ employee: userRows[0], locations: locationRows });
  } catch (err) {
    console.error('getUserLocations error:', err);
    res.status(500).json({ error: 'Failed to fetch user locations' });
  }
}

module.exports = { getAllLocations, getLatestLocations, getUserLocations, getUserLocationStats };
