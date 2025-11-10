import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startCronJobs } from './jobs/cron.js';
import authRoutes from './routes/api/v1/auth.routes.js';
import creditRoutes from './routes/credit.routes.js';
import creditPlanRoutes from './routes/api/v1/creditPlan.routes.js';
import adminCreditPlanRoutes from './routes/admin/v1/creditPlan.routes.js';
import adminExerciseRoutes from './routes/admin/v1/exercise.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MedPalm API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/v1/credit-plans', creditPlanRoutes);

// Admin Routes
app.use('/admin/v1/credit-plans', adminCreditPlanRoutes);
app.use('/admin/v1/exercises', adminExerciseRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Start cron jobs
  startCronJobs();
});
