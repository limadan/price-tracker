import { Router } from 'express';
import { LogController } from '../controllers/LogController';

const router = Router();

// GET /api/logs
router.get('/', LogController.getLogs);
// DELETE /api/logs
router.delete('/', LogController.deleteAllLogs);

export { router as logRoutes };
