import { StrategyInterface } from './StrategyInterface';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { parseCurrency } from '../utils/parseCurrency';

export class EbayScrapingStrategy implements StrategyInterface {
  public async scrape(url: string): Promise<number> {
    let browser: Browser | null = null;
    try {
      browser = await chromium.launch();

      const context: BrowserContext = await browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      });

      const page: Page = await context.newPage();

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      const approxSelector = '.x-price-approx__price .ux-textspans';
      const primarySelector = '.x-price-primary .ux-textspans';

      let priceLocator = page.locator(approxSelector).first();
      let priceText: string | null = null;

      if (priceLocator) {
        priceText = await priceLocator.textContent();
      }

      if (!priceText) {
        priceLocator = page.locator(primarySelector).first();
        await priceLocator.waitFor({ state: 'visible', timeout: 10000 });
        priceText = await priceLocator.textContent();
      }

      if (!priceText) {
        throw new Error('Price text not found on the page');
      }

      const price = parseCurrency(priceText);

      if (isNaN(price)) {
        throw new Error(`Invalid price format from text: "${priceText}"`);
      }

      console.log(`Scraped eBay price with Playwright: ${price}`);
      return price;
    } catch (error) {
      console.error('Playwright scraping failed:', error);
      throw new Error(
        `Failed to scrape eBay URL: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
