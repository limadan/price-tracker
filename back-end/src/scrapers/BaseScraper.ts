import { ProductUrl, PriceHistory, Store } from '../database/models';
import { Logger } from '../utils/Logger';
import { StrategyInterface } from './strategies/StrategyInterface';

export class BaseScraper {
  stores: Store[] = [];
  scrappingStrategies: Record<string, StrategyInterface>;

  constructor(scrapingStrategies: Record<string, StrategyInterface>) {
    this.scrappingStrategies = scrapingStrategies;
  }

  public async initializeStores(): Promise<void> {
    try {
      this.stores = await Store.findAll();
    } catch (error) {
      Logger.error(
        `Error fetching stores : ${
          error instanceof Error ? `${error.name} - ${error.message}` : ''
        }`,
        error instanceof Error ? error.stack : undefined
      );
      this.stores = [];
    }
  }

  public async getProductUrls(): Promise<ProductUrl[]> {
    return await ProductUrl.findAll();
  }

  public async insertPriceHistory(
    productUrlId: number,
    price: number
  ): Promise<void> {
    const currentDate = new Date();
    currentDate.setSeconds(0, 0);

    await PriceHistory.create({
      productUrlId,
      price,
      date: currentDate,
    });
  }

  public async scrapeAllUrls(): Promise<void> {
    console.log('Starting scraping process...');
    if (this.stores.length === 0) {
      await this.initializeStores();
    }
    const urls = await this.getProductUrls();

    const scrapePromises = urls.map((productUrl) => {
      return new Promise<void>((resolve, reject) => {
        const store = this.stores.find((s) => s.id === productUrl.storeId);
        if (!store) {
          Logger.warning(`Store not found for ID ${productUrl.storeId}`);
          resolve();
          return;
        }

        const strategy: StrategyInterface =
          this.scrappingStrategies[store.name.toLowerCase()];
        if (!strategy) {
          Logger.warning(`No scraper found for store ${store.name}`);
          resolve();
          return;
        }

        strategy
          .scrape(productUrl.url)
          .then((price) => this.insertPriceHistory(productUrl.id, price))
          .then(() => resolve())
          .catch((error) => {
            Logger.error(
              `Error scraping URL from store ${productUrl.storeId} for product ${productUrl.productId}: ${error.message}`,
              error instanceof Error ? error.stack : undefined
            );
            resolve();
          });
      });
    });

    await Promise.all(scrapePromises)
      .then(() => {
        console.log('Completed scraping all URLs.');
      })
      .catch((error) => {
        Logger.error(
          `Error during scraping process : ${
            error instanceof Error ? `${error.name} - ${error.message}` : ''
          }`,
          error instanceof Error ? error.stack : undefined
        );
      });
  }
}
