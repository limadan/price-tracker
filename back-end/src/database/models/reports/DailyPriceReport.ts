import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { Product } from '../entities/Product';
import { Store } from '../entities/Store';

interface DailyPriceReportAttributes {
  id?: number;
  productId: number;
  storeId: number;
  averagePrice: number;
  day: Date;
}

export class DailyPriceReport
  extends Model<DailyPriceReportAttributes>
  implements DailyPriceReportAttributes
{
  public id?: number;
  public productId!: number;
  public storeId!: number;
  public averagePrice!: number;
  public day!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly product?: Product;
  public readonly store?: Store;
}

DailyPriceReport.init(
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
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'daily_price_reports',
    indexes: [
      {
        unique: true,
        fields: ['productId', 'storeId', 'day'],
      },
    ],
  }
);
