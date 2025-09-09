import express from 'express';
import cors from 'cors';
import { productRoutes } from './routes/products';
import { reportRoutes } from './routes/reports';
import { logRoutes } from './routes/logs';
import { Logger } from '../utils/Logger';
import sequelize from '../database/config/database';
import '../database/models'; // Import all models to register them with Sequelize

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/logs', logRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    Logger.error(
      'Unhandled error',
      err instanceof Error ? err.stack : undefined,
      500,
      req.method,
      req.path
    );
    res.status(500).json({ error: 'Something went wrong!' });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    console.log('Database synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Dashboard API listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to sync database:', error);
  });

export default app;
