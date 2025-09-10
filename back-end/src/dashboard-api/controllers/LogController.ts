import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { ApplicationLogs } from '../../database/models';
import { LogResponse } from '../types';
import { Logger } from '../../utils/Logger';

export class LogController {
  static async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, severity, productId } = req.query;

      const whereClause: any = {};
      if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate)
          whereClause.timestamp[Op.gte] = new Date(startDate as string);
        if (endDate)
          whereClause.timestamp[Op.lte] = new Date(endDate as string);
      }
      if (severity) {
        whereClause.severity = severity;
      }
      if (productId) {
        whereClause.route = { [Op.like]: `%${productId}%` };
      }

      const logs = await ApplicationLogs.findAll({
        where: whereClause,
        order: [['timestamp', 'DESC']],
      });

      const response: LogResponse[] = logs.map((log) => ({
        id: log.id!,
        message: log.message,
        severity: log.severity || 'info',
        timestamp: log.timestamp || new Date(),
        stack: log.stack || '',
        route: log.route,
        method: log.method,
        statusCode: log.statusCode,
      }));

      res.json(response);
    } catch (error) {
      Logger.error(
        `Error retrieving logs: ${
          error instanceof Error ? `${error.name} - ${error.message}` : ''
        }`,
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteAllLogs(req: Request, res: Response): Promise<void> {
    try {
      await ApplicationLogs.destroy({ where: {} });
      res.status(204).send();
    } catch (error) {
      Logger.error(
        `Error deleting logs : ${
          error instanceof Error ? `${error.name} - ${error.message}` : ''
        }`,
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
