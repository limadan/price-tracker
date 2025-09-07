import { PriceAlertData } from '../PriceAlertDataInterface';

export interface NotifierInterface {
  notify(product: PriceAlertData): Promise<void>;
}
