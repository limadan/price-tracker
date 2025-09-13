import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  HourlyPriceReport,
  DailyPriceReport,
  MonthlyPriceReport,
} from '../../../src/database/models';
import { ReportController } from '../../../src/dashboard-api/controllers/ReportController';
import { Logger } from '../../../src/utils/Logger';

// Mock the Report models
jest.mock('../../../src/database/models', () => ({
  HourlyPriceReport: { findAll: jest.fn() },
  DailyPriceReport: { findAll: jest.fn() },
  MonthlyPriceReport: { findAll: jest.fn() },
}));

// Mock the Logger utility
jest.mock('../../../src/utils/Logger', () => ({
  Logger: {
    error: jest.fn(),
  },
}));

const mockRequest = (query = {}, params = {}, body = {}) =>
  ({
    query,
    params,
    body,
    method: 'TEST',
    path: '/test',
  } as unknown as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockReportData = [
  {
    id: 1,
    productId: 10,
    storeId: 100,
    averagePrice: '123.45',
    hour: new Date('2025-09-08T10:00:00.000Z'),
    day: new Date('2025-09-08T00:00:00.000Z'),
    month: new Date('2025-09-01T00:00:00.000Z'),
    product: { name: 'Sample Product' },
    store: { name: 'Sample Store' },
  },
];

describe('ReportController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  // Tests for getHourlyReports
  describe('getHourlyReports', () => {
    it('should return hourly reports successfully', async () => {
      req = mockRequest();
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue(
        mockReportData
      );

      await ReportController.getHourlyReports(req, res);

      expect(HourlyPriceReport.findAll).toHaveBeenCalledWith({
        where: {},
        include: ['product', 'store'],
      });
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          productId: 10,
          storeId: 100,
          averagePrice: 123.45,
          date: mockReportData[0].hour,
          product: { name: 'Sample Product' },
          store: { name: 'Sample Store' },
        },
      ]);
    });

    it('should filter hourly reports by date range', async () => {
      const startDate = '2025-09-08T00:00:00.000Z';
      const endDate = '2025-09-08T12:00:00.000Z';
      req = mockRequest({ startDate, endDate });
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue([]);

      await ReportController.getHourlyReports(req, res);

      expect(HourlyPriceReport.findAll).toHaveBeenCalledWith({
        where: {
          hour: {
            [Op.gte]: new Date(startDate),
            [Op.lte]: new Date(endDate),
          },
        },
        include: ['product', 'store'],
      });
    });

    it('should filter hourly reports by productId only', async () => {
      const productId = '10';
      req = mockRequest({ productId });
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue(
        mockReportData
      );

      await ReportController.getHourlyReports(req, res);

      expect(HourlyPriceReport.findAll).toHaveBeenCalledWith({
        where: { productId: parseInt(productId) },
        include: ['product', 'store'],
      });
    });

    it('should filter hourly reports by storeId only', async () => {
      const storeId = '100';
      req = mockRequest({ storeId });
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue(
        mockReportData
      );

      await ReportController.getHourlyReports(req, res);

      expect(HourlyPriceReport.findAll).toHaveBeenCalledWith({
        where: { storeId: parseInt(storeId) },
        include: ['product', 'store'],
      });
    });

    it('should filter hourly reports by productId and storeId', async () => {
      const productId = '10';
      const storeId = '100';
      req = mockRequest({ productId, storeId });
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue(
        mockReportData
      );

      await ReportController.getHourlyReports(req, res);

      expect(HourlyPriceReport.findAll).toHaveBeenCalledWith({
        where: { productId: parseInt(productId), storeId: parseInt(storeId) },
        include: ['product', 'store'],
      });
    });

    it('should return empty array if no matching hourly reports', async () => {
      req = mockRequest({ productId: '9999' });
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue([]);

      await ReportController.getHourlyReports(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle invalid productId gracefully', async () => {
      req = mockRequest({ productId: 'invalid' });
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue([]);

      await ReportController.getHourlyReports(req, res);

      expect(HourlyPriceReport.findAll).toHaveBeenCalledWith({
        where: { productId: NaN },
        include: ['product', 'store'],
      });
    });

    it('should handle internal server errors', async () => {
      req = mockRequest();
      const error = new Error('DB Failure');
      (HourlyPriceReport.findAll as jest.Mock).mockRejectedValue(error);

      await ReportController.getHourlyReports(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  // Tests for getDailyReports
  describe('getDailyReports', () => {
    it('should return daily reports successfully', async () => {
      req = mockRequest();
      (DailyPriceReport.findAll as jest.Mock).mockResolvedValue(mockReportData);

      await ReportController.getDailyReports(req, res);

      expect(DailyPriceReport.findAll).toHaveBeenCalledWith({
        where: {},
        include: ['product', 'store'],
      });
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          productId: 10,
          storeId: 100,
          averagePrice: 123.45,
          date: mockReportData[0].day,
          product: { name: 'Sample Product' },
          store: { name: 'Sample Store' },
        },
      ]);
    });

    it('should filter daily reports by date range', async () => {
      const startDate = '2025-09-01T00:00:00.000Z';
      const endDate = '2025-09-08T23:59:59.000Z';
      req = mockRequest({ startDate, endDate });
      (DailyPriceReport.findAll as jest.Mock).mockResolvedValue([]);

      await ReportController.getDailyReports(req, res);

      expect(DailyPriceReport.findAll).toHaveBeenCalledWith({
        where: {
          day: {
            [Op.gte]: new Date(startDate),
            [Op.lte]: new Date(endDate),
          },
        },
        include: ['product', 'store'],
      });
    });
  });

  // Tests for getMonthlyReports
  describe('getMonthlyReports', () => {
    it('should return monthly reports successfully', async () => {
      req = mockRequest();
      (MonthlyPriceReport.findAll as jest.Mock).mockResolvedValue(
        mockReportData
      );

      await ReportController.getMonthlyReports(req, res);

      expect(MonthlyPriceReport.findAll).toHaveBeenCalledWith({
        where: {},
        include: ['product', 'store'],
      });
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          productId: 10,
          storeId: 100,
          averagePrice: 123.45,
          date: mockReportData[0].month,
          product: { name: 'Sample Product' },
          store: { name: 'Sample Store' },
        },
      ]);
    });

    it('should filter monthly reports by date range', async () => {
      const startDate = '2025-01-01T00:00:00.000Z';
      const endDate = '2025-12-31T23:59:59.000Z';
      req = mockRequest({ startDate, endDate });
      (MonthlyPriceReport.findAll as jest.Mock).mockResolvedValue([]);

      await ReportController.getMonthlyReports(req, res);

      expect(MonthlyPriceReport.findAll).toHaveBeenCalledWith({
        where: {
          month: {
            [Op.gte]: new Date(startDate),
            [Op.lte]: new Date(endDate),
          },
        },
        include: ['product', 'store'],
      });
    });
  });
});
