import { BaseScrapper } from './BaseScraper';
import { AmazonScrapingStrategy } from './strategies/AmazonScrapingStrategy';
import { EbayScrapingStrategy } from './strategies/EbayScrapingStrategy';
import { StrategyInterface } from './strategies/StrategyInterface';

const WAIT_TIME_MS = 5 * 60 * 1000; // 5 minutes
const scrapingStrategies: Record<string, StrategyInterface> = {
  amazon: new AmazonScrapingStrategy(),
  ebay: new EbayScrapingStrategy(),
};

async function startScrapingSchedule() {
  const scrapper = new BaseScrapper(scrapingStrategies);

  while (true) {
    try {
      console.log('Starting scraping cycle...');
      await scrapper.scrapeAllUrls();
      console.log(
        'Scraping cycle completed. Waiting 5 minutes before next cycle...'
      );

      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME_MS));
    } catch (error) {
      console.error('Error in scraping cycle:', error);
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME_MS));
    }
  }
}

startScrapingSchedule().catch((error) => {
  console.error('Fatal error in scheduler:', error);
  process.exit(1);
});
