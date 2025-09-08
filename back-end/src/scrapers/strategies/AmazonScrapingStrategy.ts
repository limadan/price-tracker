import { StrategyInterface } from './StrategyInterface';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class AmazonScrapingStrategy implements StrategyInterface {
  public async scrape(url: string): Promise<number> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data);

      const wholePart = $('.a-price-whole')
        .first()
        .text()
        .trim()
        .replace(/[,.]/g, '');
      const fractionPart = $('.a-price-fraction').first().text().trim();

      if (!wholePart && !fractionPart) {
        throw new Error('Price elements not found on the page');
      }

      const price = Number(`${wholePart}.${fractionPart}`);

      if (isNaN(price)) {
        throw new Error('Invalid price format');
      }

      return price;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to access Amazon URL: ${error.message}`);
      }
      throw error;
    }
  }
}
