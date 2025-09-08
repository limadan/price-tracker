import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  HourlyPriceReport,
  DailyPriceReport,
  MonthlyPriceReport,
} from '../../database/models';
import { ReportResponse } from '../types';
import { Logger } from '../../utils/Logger';

export class ReportController {
  static async getHourlyReports(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      const whereClause: any = {};
      if (startDate || endDate) {
        whereClause.hour = {};
        if (startDate) whereClause.hour[Op.gte] = new Date(startDate as string);
        if (endDate) whereClause.hour[Op.lte] = new Date(endDate as string);
      }

      const reports = await HourlyPriceReport.findAll({
        where: whereClause,
        include: ['product', 'store'],
      });

      const response: ReportResponse[] = reports.map((r) => ({
        id: r.id!,
        productId: r.productId,
        storeId: r.storeId,
        averagePrice: parseFloat(r.averagePrice.toString()),
        date: r.hour,
        product: r.product ? { name: r.product.name } : undefined,
        store: r.store ? { name: r.store.name } : undefined,
      }));

      res.json(response);
    } catch (error) {
      Logger.error(
        'Error retrieving hourly reports',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getDailyReports(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      const whereClause: any = {};
      if (startDate || endDate) {
        whereClause.day = {};
        if (startDate) whereClause.day[Op.gte] = new Date(startDate as string);
        if (endDate) whereClause.day[Op.lte] = new Date(endDate as string);
      }

      const reports = await DailyPriceReport.findAll({
        where: whereClause,
        include: ['product', 'store'],
      });

      const response: ReportResponse[] = reports.map((r) => ({
        id: r.id!,
        productId: r.productId,
        storeId: r.storeId,
        averagePrice: parseFloat(r.averagePrice.toString()),
        date: r.day,
        product: r.product ? { name: r.product.name } : undefined,
        store: r.store ? { name: r.store.name } : undefined,
      }));

      res.json(response);
    } catch (error) {
      Logger.error(
        'Error retrieving daily reports',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMonthlyReports(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      const whereClause: any = {};
      if (startDate || endDate) {
        whereClause.month = {};
        if (startDate)
          whereClause.month[Op.gte] = new Date(startDate as string);
        if (endDate) whereClause.month[Op.lte] = new Date(endDate as string);
      }

      const reports = await MonthlyPriceReport.findAll({
        where: whereClause,
        include: ['product', 'store'],
      });

      const response: ReportResponse[] = reports.map((r) => ({
        id: r.id!,
        productId: r.productId,
        storeId: r.storeId,
        averagePrice: parseFloat(r.averagePrice.toString()),
        date: r.month,
        product: r.product ? { name: r.product.name } : undefined,
        store: r.store ? { name: r.store.name } : undefined,
      }));

      res.json(response);
    } catch (error) {
      Logger.error(
        'Error retrieving monthly reports',
        error instanceof Error ? error.stack : undefined,
        500,
        req.method,
        req.path
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
