import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { Op } from 'sequelize';
import { ReportGenerator } from '../../src/report-service/ReportGenerator';

import {
  PriceHistory,
  HourlyPriceReport,
  DailyPriceReport,
  MonthlyPriceReport,
} from '../../src/database/models';

jest.mock('../../src/database/models', () => ({
  PriceHistory: {
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
  HourlyPriceReport: {
    findAll: jest.fn(),
    bulkCreate: jest.fn(),
  },
  DailyPriceReport: {
    findAll: jest.fn(),
    bulkCreate: jest.fn(),
  },
  MonthlyPriceReport: {
    bulkCreate: jest.fn(),
  },
}));

describe('ReportGenerator', () => {
  beforeEach(() => {
    (PriceHistory.findAll as jest.Mock).mockClear();
    (PriceHistory.destroy as jest.Mock).mockClear();
    (HourlyPriceReport.findAll as jest.Mock).mockClear();
    (HourlyPriceReport.bulkCreate as jest.Mock).mockClear();
    (DailyPriceReport.findAll as jest.Mock).mockClear();
    (DailyPriceReport.bulkCreate as jest.Mock).mockClear();
    (MonthlyPriceReport.bulkCreate as jest.Mock).mockClear();
  });

  describe('generateHourlyReport', () => {
    it('should generate hourly reports and delete processed price histories', async () => {
      const hour = new Date();
      hour.setMinutes(0, 0, 0);

      const mockPriceHistories = [
        { id: 1, price: 10.0, productUrl: { productId: 1, storeId: 1 } },
        { id: 2, price: 12.0, productUrl: { productId: 1, storeId: 1 } },
        { id: 3, price: 15.0, productUrl: { productId: 1, storeId: 1 } },
      ];
      (PriceHistory.findAll as jest.Mock).mockResolvedValue(mockPriceHistories);

      await ReportGenerator.generateHourlyReport();

      const expectedReport = [
        {
          productId: 1,
          storeId: 1,
          averagePrice: 12.33, // (10 + 12 + 15) / 3
          hour,
        },
      ];
      expect(HourlyPriceReport.bulkCreate).toHaveBeenCalledTimes(1);
      expect(HourlyPriceReport.bulkCreate).toHaveBeenCalledWith(expectedReport);

      const expectedIdsToDelete = [1, 2, 3];
      expect(PriceHistory.destroy).toHaveBeenCalledTimes(1);
      expect(PriceHistory.destroy).toHaveBeenCalledWith({
        where: { id: { [Op.in]: expectedIdsToDelete } },
      });
    });

    it('should not generate a report if no price history is found', async () => {
      (PriceHistory.findAll as jest.Mock).mockResolvedValue([]);

      await ReportGenerator.generateHourlyReport();

      expect(HourlyPriceReport.bulkCreate).not.toHaveBeenCalled();
      expect(PriceHistory.destroy).not.toHaveBeenCalled();
    });
  });

  describe('generateDailyReport', () => {
    it('should generate daily reports from hourly reports', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mockHourlyReports = [
        { productId: 1, storeId: 1, averagePrice: 10.0 },
        { productId: 1, storeId: 1, averagePrice: 12.0 },
      ];
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue(
        mockHourlyReports
      );

      await ReportGenerator.generateDailyReport();

      const expectedReport = [
        {
          productId: 1,
          storeId: 1,
          averagePrice: 11.0, // (10 + 12) / 2
          day: today,
        },
      ];
      expect(DailyPriceReport.bulkCreate).toHaveBeenCalledTimes(1);
      expect(DailyPriceReport.bulkCreate).toHaveBeenCalledWith(expectedReport);
    });

    it('should not generate a report if no hourly data is found', async () => {
      (HourlyPriceReport.findAll as jest.Mock).mockResolvedValue([]);

      await ReportGenerator.generateDailyReport();

      expect(DailyPriceReport.bulkCreate).not.toHaveBeenCalled();
    });
  });

  describe('generateMonthlyReport', () => {
    it('should generate monthly reports from daily reports', async () => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const month = new Date(firstDayOfMonth);

      const mockDailyReports = [
        { productId: 1, storeId: 1, averagePrice: 15.5 },
        { productId: 1, storeId: 1, averagePrice: 16.5 },
        { productId: 2, storeId: 1, averagePrice: 100.0 }, // Outro produto para testar o agrupamento
      ];
      (DailyPriceReport.findAll as jest.Mock).mockResolvedValue(
        mockDailyReports
      );

      await ReportGenerator.generateMonthlyReport();

      const expectedReports = [
        {
          productId: 1,
          storeId: 1,
          averagePrice: 16.0, // (15.5 + 16.5) / 2
          month: month,
        },
        {
          productId: 2,
          storeId: 1,
          averagePrice: 100.0,
          month: month,
        },
      ];
      expect(MonthlyPriceReport.bulkCreate).toHaveBeenCalledTimes(1);
      expect(MonthlyPriceReport.bulkCreate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(expectedReports[0]),
          expect.objectContaining(expectedReports[1]),
        ])
      );
    });

    it('should not generate a report if no daily data is found', async () => {
      (DailyPriceReport.findAll as jest.Mock).mockResolvedValue([]);

      await ReportGenerator.generateMonthlyReport();

      expect(MonthlyPriceReport.bulkCreate).not.toHaveBeenCalled();
    });
  });
});
