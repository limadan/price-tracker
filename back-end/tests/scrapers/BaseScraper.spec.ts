import { BaseScrapper } from '../../src/scrapers/BaseScraper';

import { ProductUrl, PriceHistory, Store } from '../../src/database/models';
import { StrategyInterface } from '../../src/scrapers/strategies/StrategyInterface';

jest.mock('../../src/database/models', () => ({
  ProductUrl: {
    findAll: jest.fn(),
  },
  PriceHistory: {
    create: jest.fn(),
  },
  Store: {
    findAll: jest.fn(),
  },
}));

describe('BaseScrapper', () => {
  let scrapper: BaseScrapper;
  let mockScrapingStrategies: Record<string, StrategyInterface>;
  let mockAmazonStrategy: StrategyInterface;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAmazonStrategy = {
      scrape: jest.fn(),
    };

    mockScrapingStrategies = {
      amazon: mockAmazonStrategy,
    };

    scrapper = new BaseScrapper(mockScrapingStrategies);
  });

  describe('initializeStores', () => {
    it('should fetch and populate stores successfully', async () => {
      const mockStores = [{ id: 1, name: 'Amazon' }] as Store[];
      (Store.findAll as jest.Mock).mockResolvedValue(mockStores);

      await scrapper.initializeStores();

      expect(scrapper.stores).toEqual(mockStores);
      expect(Store.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when fetching stores and set the list to empty', async () => {
      const error = new Error('Database error');
      (Store.findAll as jest.Mock).mockRejectedValue(error);

      await scrapper.initializeStores();

      expect(scrapper.stores).toEqual([]);
    });
  });

  describe('getProductUrls', () => {
    it('should return a list of product URLs', async () => {
      const mockUrls = [
        { id: 1, url: 'http://amazon.com/product1' },
      ] as ProductUrl[];
      (ProductUrl.findAll as jest.Mock).mockResolvedValue(mockUrls);

      const result = await scrapper.getProductUrls();

      expect(result).toEqual(mockUrls);
      expect(ProductUrl.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('insertPriceHistory', () => {
    it('should create a new price history record with the correct data', async () => {
      const productUrlId = 1;
      const price = 99.99;

      const todayDate = new Date();
      todayDate.setSeconds(0, 0);

      await scrapper.insertPriceHistory(productUrlId, price);

      expect(PriceHistory.create).toHaveBeenCalledWith({
        productUrlId,
        price,
        date: todayDate,
      });
      expect(PriceHistory.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('scrapeAllUrls', () => {
    const mockStores = [{ id: 1, name: 'Amazon' }] as Store[];
    const mockUrls = [
      {
        id: 1,
        productId: 101,
        storeId: 1,
        url: 'http://amazon.com/product1',
      },
    ] as ProductUrl[];

    it('should scrape all URLs and insert the price history successfully', async () => {
      (Store.findAll as jest.Mock).mockResolvedValue(mockStores);
      (ProductUrl.findAll as jest.Mock).mockResolvedValue(mockUrls);
      (mockAmazonStrategy.scrape as jest.Mock).mockResolvedValue(123.45);

      await scrapper.scrapeAllUrls();

      expect(Store.findAll).toHaveBeenCalledTimes(1);
      expect(ProductUrl.findAll).toHaveBeenCalledTimes(1);
      expect(mockAmazonStrategy.scrape).toHaveBeenCalledWith(mockUrls[0].url);
      expect(PriceHistory.create).toHaveBeenCalledWith({
        productUrlId: mockUrls[0].id,
        price: 123.45,
        date: expect.any(Date),
      });
    });

    it('should not call initializeStores if stores are already loaded', async () => {
      scrapper.stores = mockStores;

      (ProductUrl.findAll as jest.Mock).mockResolvedValue(mockUrls);
      (mockAmazonStrategy.scrape as jest.Mock).mockResolvedValue(123.45);

      await scrapper.scrapeAllUrls();

      expect(Store.findAll).not.toHaveBeenCalled();
      expect(ProductUrl.findAll).toHaveBeenCalledTimes(1);
    });

    it('should log an error if the store for a URL is not found', async () => {
      const urlsWithInvalidStore = [
        {
          id: 2,
          productId: 102,
          storeId: 99,
          url: 'http://invalid.com/product2',
        },
      ];
      (Store.findAll as jest.Mock).mockResolvedValue(mockStores);
      (ProductUrl.findAll as jest.Mock).mockResolvedValue(urlsWithInvalidStore);

      await scrapper.scrapeAllUrls();

      expect(mockAmazonStrategy.scrape).not.toHaveBeenCalled();
    });

    it('should log an error if the strategy for a store is not found', async () => {
      const storesWithoutStrategy = [
        { id: 2, name: 'UnknownStore' },
      ] as Store[];
      const urlsForUnknownStore = [
        {
          id: 3,
          productId: 103,
          storeId: 2,
          url: 'http://unknown.com/product3',
        },
      ];
      (Store.findAll as jest.Mock).mockResolvedValue(storesWithoutStrategy);
      (ProductUrl.findAll as jest.Mock).mockResolvedValue(urlsForUnknownStore);

      await scrapper.scrapeAllUrls();

      expect(mockAmazonStrategy.scrape).not.toHaveBeenCalled();
    });

    it("should log an error if the strategy's scrape method fails", async () => {
      const scrapeError = new Error('Failed to fetch page');
      (Store.findAll as jest.Mock).mockResolvedValue(mockStores);
      (ProductUrl.findAll as jest.Mock).mockResolvedValue(mockUrls);
      (mockAmazonStrategy.scrape as jest.Mock).mockRejectedValue(scrapeError);

      await scrapper.scrapeAllUrls();

      expect(PriceHistory.create).not.toHaveBeenCalled();
    });
  });
});
