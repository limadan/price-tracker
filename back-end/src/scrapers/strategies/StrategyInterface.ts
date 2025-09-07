export interface StrategyInterface {
    scrape(url: string): Promise<number>;
}