import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { Product } from '../entities/Product';
import { Store } from '../entities/Store';

interface MonthlyPriceReportAttributes {
  id?: number;
  productId: number;
  storeId: number;
  averagePrice: number;
  month: Date;
}

export class MonthlyPriceReport
  extends Model<MonthlyPriceReportAttributes>
  implements MonthlyPriceReportAttributes
{
  public id?: number;
  public productId!: number;
  public storeId!: number;
  public averagePrice!: number;
  public month!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly product?: Product;
  public readonly store?: Store;
}

MonthlyPriceReport.init(
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
    month: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'monthly_price_reports',
  }
);
