import { Product } from './Product';
import { Store } from './Store';
import { ProductUrl } from './ProductUrl';
import { PriceHistory } from './PriceHistory';

// Set up associations
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

// Export all models
export { Product, Store, ProductUrl, PriceHistory };
