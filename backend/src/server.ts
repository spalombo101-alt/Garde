import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './db/connect.js';
import authRoutes from './routes/auth.js';
import closetRoutes from './routes/closet.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = (process.env.CORS_ORIGIN || 'http://localhost:19000').split(',');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/closet', closetRoutes);
app.use('/users', usersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

async function start() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`\n✓ Garde API server running on http://localhost:${PORT}`);
      console.log(`✓ Database connected`);
      console.log(`✓ CORS enabled for: ${CORS_ORIGIN.join(', ')}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
