import { Op } from 'sequelize';
import {
  PriceHistory,
  ProductUrl,
  HourlyPriceReport,
  DailyPriceReport,
  MonthlyPriceReport,
} from '../database/models';

export class ReportGenerator {
  static async generateHourlyReport(): Promise<void> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const priceHistories = await PriceHistory.findAll({
        where: {
          date: {
            [Op.gte]: oneHourAgo,
          },
        },
        include: [
          {
            model: ProductUrl,
            as: 'productUrl',
            include: ['product', 'store'],
          },
        ],
      });

      if (priceHistories.length === 0) {
        return;
      }

      const grouped: {
        [key: string]: { prices: number[]; productId: number; storeId: number };
      } = {};

      priceHistories.forEach((ph) => {
        const productUrl = (ph as any).productUrl;
        const productId = productUrl.productId;
        const storeId = productUrl.storeId;
        const key = `${productId}-${storeId}`;

        if (!grouped[key]) {
          grouped[key] = { prices: [], productId, storeId };
        }
        grouped[key].prices.push(parseFloat(ph.price.toString()));
      });

      const hour = new Date();
      hour.setHours(hour.getHours() - 1);
      hour.setMinutes(0, 0, 0);

      const reports = Object.values(grouped).map((g) => {
        const averagePrice =
          g.prices.reduce((a, b) => a + b, 0) / g.prices.length;
        return {
          productId: g.productId,
          storeId: g.storeId,
          averagePrice: parseFloat(averagePrice.toFixed(2)),
          hour,
        };
      });

      await HourlyPriceReport.bulkCreate(reports);

      const idsToDelete = priceHistories
        .map((ph) => ph.id)
        .filter((id) => id !== undefined) as number[];
      await PriceHistory.destroy({
        where: { id: { [Op.in]: idsToDelete } },
      });
    } catch (error) {
      throw error;
    }
  }

  static async generateDailyReport(): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const hourlyReports = await HourlyPriceReport.findAll({
        where: {
          hour: {
            [Op.gte]: yesterday,
            [Op.lt]: today,
          },
        },
        include: ['product', 'store'],
      });

      if (hourlyReports.length === 0) {
        return;
      }

      const grouped: {
        [key: string]: { prices: number[]; productId: number; storeId: number };
      } = {};

      hourlyReports.forEach((hr) => {
        const key = `${hr.productId}-${hr.storeId}`;
        if (!grouped[key]) {
          grouped[key] = {
            prices: [],
            productId: hr.productId,
            storeId: hr.storeId,
          };
        }
        grouped[key].prices.push(hr.averagePrice);
      });

      const day = new Date(yesterday);

      const reports = Object.values(grouped).map((g) => {
        const averagePrice =
          g.prices.reduce((a, b) => a + b, 0) / g.prices.length;
        return {
          productId: g.productId,
          storeId: g.storeId,
          averagePrice: parseFloat(averagePrice.toFixed(2)),
          day,
        };
      });

      await DailyPriceReport.bulkCreate(reports);
    } catch (error) {
      throw error;
    }
  }

  static async generateMonthlyReport(): Promise<void> {
    try {
      const now = new Date();
      const firstDayOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      const firstDayOfPreviousMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const dailyReports = await DailyPriceReport.findAll({
        where: {
          day: {
            [Op.gte]: firstDayOfPreviousMonth,
            [Op.lt]: firstDayOfCurrentMonth,
          },
        },
        include: ['product', 'store'],
      });

      if (dailyReports.length === 0) {
        return;
      }

      const grouped: {
        [key: string]: { prices: number[]; productId: number; storeId: number };
      } = {};

      dailyReports.forEach((dr) => {
        const key = `${dr.productId}-${dr.storeId}`;
        if (!grouped[key]) {
          grouped[key] = {
            prices: [],
            productId: dr.productId,
            storeId: dr.storeId,
          };
        }
        grouped[key].prices.push(dr.averagePrice);
      });

      const month = new Date(firstDayOfPreviousMonth);

      const reports = Object.values(grouped).map((g) => {
        const averagePrice =
          g.prices.reduce((a, b) => a + b, 0) / g.prices.length;
        return {
          productId: g.productId,
          storeId: g.storeId,
          averagePrice: parseFloat(averagePrice.toFixed(2)),
          month,
        };
      });

      await MonthlyPriceReport.bulkCreate(reports);
    } catch (error) {
      throw error;
    }
  }
}
