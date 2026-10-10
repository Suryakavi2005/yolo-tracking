// controllers/usersController.js
const pool = require('../db');

// GET /api/users
async function getAllUsers(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name FROM users ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

module.exports = { getAllUsers };
