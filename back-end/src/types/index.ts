export interface Product {
    id: number;
    name: string;
    currentPrice: number;
    url: string;
}

export interface PriceHistory {
    productId: number;
    price: number;
    date: Date;
}

export interface PriceTrackerConfig {
    targetPrice: number;
    notificationMethod: 'email' | 'telegram';
}

export interface Scraper {
    scrapeProductData(url: string): Promise<Product>;
}