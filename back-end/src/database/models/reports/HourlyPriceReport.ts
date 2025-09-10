import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { Product } from '../entities/Product';
import { Store } from '../entities/Store';

interface HourlyPriceReportAttributes {
  id?: number;
  productId: number;
  storeId: number;
  averagePrice: number;
  hour: Date;
}

export class HourlyPriceReport
  extends Model<HourlyPriceReportAttributes>
  implements HourlyPriceReportAttributes
{
  public id?: number;
  public productId!: number;
  public storeId!: number;
  public averagePrice!: number;
  public hour!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly product?: Product;
  public readonly store?: Store;
}

HourlyPriceReport.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Store,
        key: 'id',
      },
    },
    averagePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    hour: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'hourly_price_reports',
  }
);
