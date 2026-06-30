import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, db } from './db.js';
import router from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Vercel edge, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // permissive for portfolio; tighten if needed
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Initialise DB and wire up routes
let isReady = false;
const initPromise = connectDatabase().then(() => {
  isReady = true;

  // Routes
  app.use('/api', router);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      database: db.isMock() ? 'Local JSON File DB Fallback' : 'MongoDB',
    });
  });
}).catch(err => {
  console.error('Failed to initialize database connection:', err);
});

// ── Local dev: start the HTTP server only when run directly ──────────────────
// Vercel imports this file as a module, so `process.argv[1]` check prevents
// listen() from being called in the serverless environment.
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  initPromise.then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Portfolio backend server running on port ${PORT}`);
    });
  });
}

// Export for Vercel serverless runtime
export default app;
