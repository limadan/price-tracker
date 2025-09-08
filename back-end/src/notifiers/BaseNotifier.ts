import { Product, PriceHistory, ProductUrl, Store } from '../database/models';
import { NotifierInterface } from './strategies/NotifierInterface';
import { PriceAlertData } from './PriceAlertDataInterface';
import { Op } from 'sequelize';
import { Logger } from '../utils/Logger';

export class BaseNotifier {
  notifiers: NotifierInterface[];

  constructor(notifiers: NotifierInterface[]) {
    this.notifiers = notifiers;
  }

  private async findAlertsToNotify() {
    const alerts = await ProductUrl.findAll({
      where: {
        notifiedAt: null,
      },
      include: [
        { model: Product, as: 'product', required: true },
        { model: Store, as: 'store', required: true },
        {
          model: PriceHistory,
          as: 'priceHistories',
          order: [['date', 'DESC']],
          limit: 1,
          required: true,
        },
      ],
    });

    return alerts.filter((alert) => {
      const latestPrice = alert.priceHistories?.[0]?.price;
      const targetPrice = alert.product?.targetPrice;
      return (
        latestPrice !== undefined &&
        targetPrice !== undefined &&
        latestPrice <= targetPrice
      );
    });
  }

  private async resetNotifications() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const notifiedUrls = await ProductUrl.findAll({
      where: {
        notifiedAt: { [Op.not]: null },
      },
      include: [
        { model: Product, as: 'product', required: true },
        {
          model: PriceHistory,
          as: 'priceHistories',
          order: [['date', 'DESC']],
          limit: 1,
          required: true,
        },
      ],
    });

    const idsToReset: number[] = [];

    for (const url of notifiedUrls) {
      const latestPrice = (url as any).priceHistories[0].price;
      const targetPrice = url.product!.targetPrice;
      const notifiedAt = url.notifiedAt!;

      const priceIncreased = latestPrice > targetPrice;
      const isOlderThan7Days = notifiedAt < sevenDaysAgo;

      if (priceIncreased || isOlderThan7Days) {
        idsToReset.push(url.id);
      }
    }

    if (idsToReset.length > 0) {
      await ProductUrl.update(
        { notifiedAt: null },
        {
          where: {
            id: { [Op.in]: idsToReset },
          },
        }
      );

      Logger.info(
        `Reseted notification for ${
          idsToReset.length
        } alert(s). IDs: ${idsToReset.join(', ')} `
      );
    }
  }

  async processNotifications() {
    await this.resetNotifications();

    const alertsToSend = await this.findAlertsToNotify();

    if (alertsToSend.length === 0) {
      return;
    }

    for (const alert of alertsToSend) {
      const alertData: PriceAlertData = {
        productName: alert.product!.name,
        storeName: alert.store!.name,
        targetPrice: alert.product!.targetPrice,
        currentPrice: alert.priceHistories![0].price,
        url: alert.url,
      };

      let atLeastOneNotifierSucceeded = false;

      console.log(
        `Sending notification for "${alertData.productName}" at "${alertData.storeName}"`
      );
      for (const notifier of this.notifiers) {
        try {
          await notifier.notify(alertData);
          atLeastOneNotifierSucceeded = true;
        } catch (error) {
          continue;
        }
      }

      if (atLeastOneNotifierSucceeded) {
        await alert.update({ notifiedAt: new Date() });
        Logger.info(`Notification sent for "${alertData.productName}"`);
      }
    }
  }
}
