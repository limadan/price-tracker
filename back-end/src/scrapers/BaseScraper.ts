import { ProductUrl, PriceHistory, Store } from '../database/models';
import { StrategyInterface } from './strategies/StrategyInterface';

export class BaseScrapper {
  stores: Store[] = [];
  scrappingStrategies: Record<string, StrategyInterface>;

  constructor(scrapingStrategies: Record<string, StrategyInterface>) {
    this.scrappingStrategies = scrapingStrategies;
  }

  public async initializeStores(): Promise<void> {
    try {
      this.stores = await Store.findAll();
    } catch (error) {
      console.error('Error fetching stores:', error);
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
    console.log(
      `Inserting price history for url ${productUrlId} with price ${price}`
    );

    const currentDate = new Date();
    currentDate.setSeconds(0, 0);

    await PriceHistory.create({
      productUrlId,
      price,
      date: currentDate,
    });
  }

  public async scrapeAllUrls(): Promise<void> {
    if (this.stores.length === 0) {
      await this.initializeStores();
    }
    const urls = await this.getProductUrls();

    const scrapePromises = urls.map((productUrl) => {
      return new Promise<void>((resolve, reject) => {
        const store = this.stores.find((s) => s.id === productUrl.storeId);
        if (!store) {
          console.error(`Store not found for ID ${productUrl.storeId}`);
          resolve();
          return;
        }

        const strategy: StrategyInterface =
          this.scrappingStrategies[store.name.toLowerCase()];
        if (!strategy) {
          console.error(`No strategy found for store ${store.name}`);
          resolve();
          return;
        }

        strategy
          .scrape(productUrl.url)
          .then((price) => this.insertPriceHistory(productUrl.id, price))
          .then(() => resolve())
          .catch((error) => {
            console.error(`Error scraping URL ${productUrl.url}:`, error);
            resolve();
          });
      });
    });

    await Promise.all(scrapePromises)
      .then(() => {
        console.log('Completed scraping all URLs.');
      })
      .catch((error) => {
        console.error('Error during scraping process:', error);
      });
  }
}
