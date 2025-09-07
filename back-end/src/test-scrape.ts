import { AmazonScrapingStrategy } from './scrapers/strategies/AmazonScrapingStrategy';
import { EbayScrapingStrategy } from './scrapers/strategies/EbayScrapingStrategy';
import { WalmartScrapingStrategy } from './scrapers/strategies/WalmartScrapingStrategy';

const ebayStrategy = new WalmartScrapingStrategy();
const testUrl =
  'https://www.walmart.com/ip/PlayStation-5-Digital-Console-Slim/5113183757?classType=REGULAR&athbdg=L1102&adsRedirect=true';
ebayStrategy
  .scrape(testUrl)
  .then((price) => {
    console.log(`Test scraped eBay price: ${price}`);
  })
  .catch((error) => {
    console.error('Error during test scrape:', error);
  });
