import { Product } from './entities/Product';
import { Store } from './entities/Store';
import { ProductUrl } from './entities/ProductUrl';
import { PriceHistory } from './entities/PriceHistory';
import { ApplicationLogs } from './logs/ApplicationLogs';
import { HourlyPriceReport } from './reports/HourlyPriceReport';
import { DailyPriceReport } from './reports/DailyPriceReport';
import { MonthlyPriceReport } from './reports/MonthlyPriceReport';

Product.hasMany(ProductUrl, {
  foreignKey: 'productId',
  as: 'productUrls',
});

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

HourlyPriceReport.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

HourlyPriceReport.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store',
});

DailyPriceReport.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

DailyPriceReport.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store',
});

MonthlyPriceReport.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

MonthlyPriceReport.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store',
});

export {
  Product,
  Store,
  ProductUrl,
  PriceHistory,
  ApplicationLogs,
  HourlyPriceReport,
  DailyPriceReport,
  MonthlyPriceReport,
};
