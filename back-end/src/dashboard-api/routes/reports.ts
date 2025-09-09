import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();

/**
 * @swagger
 * /reports/hourly:
 *   get:
 *     summary: Retrieve hourly price reports
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for report filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for report filtering
 *     responses:
 *       200:
 *         description: A list of hourly reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportResponse'
 */

// GET /api/reports/hourly
router.get('/hourly', ReportController.getHourlyReports);

/**
 * @swagger
 * /reports/daily:
 *   get:
 *     summary: Retrieve daily price reports
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for report filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for report filtering
 *     responses:
 *       200:
 *         description: A list of daily reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportResponse'
 */

// GET /api/reports/daily
router.get('/daily', ReportController.getDailyReports);

/**
 * @swagger
 * /reports/monthly:
 *   get:
 *     summary: Retrieve monthly price reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: A list of monthly reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportResponse'
 */

// GET /api/reports/monthly
router.get('/monthly', ReportController.getMonthlyReports);

export { router as reportRoutes };
