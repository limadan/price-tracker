import { BaseNotifier } from '../../src/notifiers/BaseNotifier';
import { ProductUrl } from '../../src/database/models';
import { NotifierInterface } from '../../src/notifiers/strategies/NotifierInterface';
import { Op } from 'sequelize';

jest.mock('../../src/database/models');

const mockNotifier: NotifierInterface = {
  notify: jest.fn().mockResolvedValue(undefined),
};

const createMockAlert = (
  id: number,
  latestPrice: number,
  targetPrice: number,
  notifiedAt: Date | null
) => {
  return {
    id,
    url: `http://test.com/product/${id}`,
    notifiedAt,
    product: {
      name: `Product ${id}`,
      targetPrice,
    },
    store: {
      name: 'Test Store',
    },
    priceHistories: [{ price: latestPrice, date: new Date() }],
    update: jest.fn().mockResolvedValue(undefined),
  };
};

describe('BaseNotifier', () => {
  let baseNotifier: BaseNotifier;

  const mockedProductUrlFindAll = ProductUrl.findAll as jest.Mock;
  const mockedProductUrlUpdate = ProductUrl.update as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    baseNotifier = new BaseNotifier([mockNotifier]);
  });

  it('should send a notification for a new price drop', async () => {
    const alert = createMockAlert(1, 90, 100, null);
    mockedProductUrlFindAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([alert]);

    await baseNotifier.processNotifications();

    expect(mockNotifier.notify).toHaveBeenCalledTimes(1);
    expect(mockNotifier.notify).toHaveBeenCalledWith({
      productName: 'Product 1',
      storeName: 'Test Store',
      targetPrice: 100,
      currentPrice: 90,
      url: 'http://test.com/product/1',
    });
    expect(alert.update).toHaveBeenCalledWith({ notifiedAt: expect.any(Date) });
  });

  it('should do nothing if no products meet the alert criteria', async () => {
    mockedProductUrlFindAll.mockResolvedValue([]);

    await baseNotifier.processNotifications();

    expect(mockNotifier.notify).not.toHaveBeenCalled();
    expect(mockedProductUrlUpdate).not.toHaveBeenCalled();
  });

  it('should reset a notification if the price increased above target', async () => {
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const alertToReset = createMockAlert(2, 110, 100, eightDaysAgo);
    mockedProductUrlFindAll
      .mockResolvedValueOnce([alertToReset])
      .mockResolvedValueOnce([]);

    await baseNotifier.processNotifications();

    expect(mockedProductUrlUpdate).toHaveBeenCalledTimes(1);
    expect(mockedProductUrlUpdate).toHaveBeenCalledWith(
      { notifiedAt: null },
      { where: { id: { [Op.in]: [2] } } }
    );
    expect(mockNotifier.notify).not.toHaveBeenCalled();
  });

  it('should reset a notification if it was sent more than 7 days ago', async () => {
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const alertToReset = createMockAlert(3, 95, 100, eightDaysAgo);
    mockedProductUrlFindAll
      .mockResolvedValueOnce([alertToReset])
      .mockResolvedValueOnce([]);

    await baseNotifier.processNotifications();

    expect(mockedProductUrlUpdate).toHaveBeenCalledTimes(1);
    expect(mockedProductUrlUpdate).toHaveBeenCalledWith(
      { notifiedAt: null },
      { where: { id: { [Op.in]: [3] } } }
    );
    expect(mockNotifier.notify).not.toHaveBeenCalled();
  });

  it('should not notify for an alert that was already sent recently', async () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const alreadyNotifiedAlert = createMockAlert(4, 98, 100, oneDayAgo);
    mockedProductUrlFindAll
      .mockResolvedValueOnce([alreadyNotifiedAlert])
      .mockResolvedValueOnce([]);

    await baseNotifier.processNotifications();

    expect(mockedProductUrlUpdate).not.toHaveBeenCalled();
    expect(mockNotifier.notify).not.toHaveBeenCalled();
  });

  it('should not update the alert status if ALL notifiers fail', async () => {
    const alert = createMockAlert(5, 45, 50, null);
    mockedProductUrlFindAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([alert]);

    (mockNotifier.notify as jest.Mock).mockRejectedValue(
      new Error('SMTP Error')
    );

    await baseNotifier.processNotifications();

    expect(mockNotifier.notify).toHaveBeenCalledTimes(1);
    expect(alert.update).not.toHaveBeenCalled();
  });

  it('should UPDATE the alert status if at least one notifier succeeds', async () => {
    const failingNotifier: NotifierInterface = {
      notify: jest.fn().mockRejectedValue(new Error('Notifier 1 failed')),
    };
    const succeedingNotifier: NotifierInterface = {
      notify: jest.fn().mockResolvedValue(undefined),
    };

    const multiNotifier = new BaseNotifier([
      failingNotifier,
      succeedingNotifier,
    ]);

    const alert = createMockAlert(6, 19, 20, null);
    mockedProductUrlFindAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([alert]);

    await multiNotifier.processNotifications();

    expect(failingNotifier.notify).toHaveBeenCalledTimes(1);
    expect(succeedingNotifier.notify).toHaveBeenCalledTimes(1);

    expect(alert.update).toHaveBeenCalledTimes(1);
    expect(alert.update).toHaveBeenCalledWith({ notifiedAt: expect.any(Date) });
  });
});
