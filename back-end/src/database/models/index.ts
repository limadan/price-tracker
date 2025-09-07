import { Product } from './Product';
import { Store } from './Store';
import { ProductUrl } from './ProductUrl';
import { PriceHistory } from './PriceHistory';
import { ApplicationLogs } from './ApplicationLogs';

ProductUrl.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

ProductUrl.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store',
});

ProductUrl.hasMany(PriceHistory, {
  foreignKey: 'productUrlId',
  as: 'priceHistories',
});

PriceHistory.belongsTo(ProductUrl, {
  foreignKey: 'productUrlId',
  as: 'productUrl',
});

export { Product, Store, ProductUrl, PriceHistory, ApplicationLogs };
