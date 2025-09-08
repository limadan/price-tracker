import * as cron from 'node-cron';
import { BaseScraper } from '../scrapers/BaseScraper';
import { BaseNotifier } from '../notifiers/BaseNotifier';
import { ReportGenerator } from '../report-service/ReportGenerator';
import { AmazonScrapingStrategy } from '../scrapers/strategies/AmazonScrapingStrategy';
import { EbayScrapingStrategy } from '../scrapers/strategies/EbayScrapingStrategy';
import { EmailNotifier } from '../notifiers/strategies/EmailNotifier';
import { Logger } from '../utils/Logger';

const scrapingStrategies = {
  amazon: new AmazonScrapingStrategy(),
  ebay: new EbayScrapingStrategy(),
};

const notifiers = [new EmailNotifier()];

const baseScraper = new BaseScraper(scrapingStrategies);
const baseNotifier = new BaseNotifier(notifiers);

function start() {
  Logger.info('Starting scheduler...');

  // Schedule scraper and notifier every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      await baseScraper.scrapeAllUrls();
      Logger.info('Scraper completed successfully.');
    } catch (error) {
      Logger.error(
        'Error running scraper:',
        error instanceof Error ? error.stack : undefined
      );
    }

    try {
      await baseNotifier.processNotifications();
      Logger.info('Notifier completed successfully.');
    } catch (error) {
      Logger.error(
        'Error running notifier:',
        error instanceof Error ? error.stack : undefined
      );
    }
  });

  // Schedule hourly report generation
  cron.schedule('0 * * * *', async () => {
    try {
      await ReportGenerator.generateHourlyReport();
      Logger.info('Hourly report generated successfully.');
    } catch (error) {
      Logger.error(
        'Error generating hourly report:',
        error instanceof Error ? error.stack : undefined
      );
    }
  });

  // Schedule daily report generation at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      await ReportGenerator.generateDailyReport();
      Logger.info('Daily report generated successfully.');
    } catch (error) {
      Logger.error(
        'Error generating daily report:',
        error instanceof Error ? error.stack : undefined
      );
    }
  });

  // Schedule monthly report generation on the 1st of each month
  cron.schedule('0 0 1 * *', async () => {
    try {
      await ReportGenerator.generateMonthlyReport();
      Logger.info('Monthly report generated successfully.');
    } catch (error) {
      Logger.error(
        'Error generating monthly report:',
        error instanceof Error ? error.stack : undefined
      );
    }
  });

  Logger.info('Scheduler started successfully.');
}

start();
