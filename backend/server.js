'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDatabase } = require('./db');
const router = require('./routes');

dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// ── Wire up routes immediately so Vercel can find them ────────────────────────
// DB connection is handled lazily inside each db.* call
connectDatabase(); // fire-and-forget; idempotent — mongoose caches the connection

app.use('/api', router);

// Root route — useful for Vercel preview
app.get('/', (req, res) => {
  res.json({
    status: '✅ Nezvi Hussain Portfolio API is running',
    endpoints: {
      profile:  'GET /api/profile',
      skills:   'GET /api/skills',
      projects: 'GET /api/projects',
      contact:  'POST /api/messages',
      health:   'GET /health',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ── Local dev: start the HTTP server only when run directly ───────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio backend running on port ${PORT}`);
  });
}

// Export for Vercel serverless runtime
module.exports = app;
