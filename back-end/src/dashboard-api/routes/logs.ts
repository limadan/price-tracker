import { Router } from 'express';
import { LogController } from '../controllers/LogController';

const router = Router();

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Retrieve application logs
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for log filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for log filtering
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *         description: Filter logs by severity level (e.g., info, error)
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter logs related to a specific product ID
 *     responses:
 *       200:
 *         description: A list of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LogResponse'
 *   delete:
 *     summary: Delete all application logs
 *     tags: [Logs]
 *     responses:
 *       204:
 *         description: Logs deleted successfully
 */

// GET /api/logs
router.get('/', LogController.getLogs);
// DELETE /api/logs
router.delete('/', LogController.deleteAllLogs);

export { router as logRoutes };
