// routes/users.js
const express = require('express');
const router  = express.Router();
const { getAllUsers } = require('../controllers/usersController');

// GET /api/users  - return all employees
router.get('/', getAllUsers);

module.exports = router;
