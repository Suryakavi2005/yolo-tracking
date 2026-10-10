// server.js - Express application entry point
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const usersRouter     = require('./routes/users');
const locationsRouter = require('./routes/locations');
const dashboardRouter = require('./routes/dashboard');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET'],
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/users',           usersRouter);
app.use('/api/locations',       locationsRouter);
app.use('/api/dashboard',       dashboardRouter);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
