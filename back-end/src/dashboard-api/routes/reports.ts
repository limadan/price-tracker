import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();

// GET /api/reports/hourly
router.get('/hourly', ReportController.getHourlyReports);

// GET /api/reports/daily
router.get('/daily', ReportController.getDailyReports);

// GET /api/reports/monthly
router.get('/monthly', ReportController.getMonthlyReports);

export { router as reportRoutes };
