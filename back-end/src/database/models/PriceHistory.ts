import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ProductUrl } from './ProductUrl';

interface PriceHistoryAttributes {
  id?: number;
  price: number;
  date: Date;
  productUrlId: number;
}

export class PriceHistory
  extends Model<PriceHistoryAttributes>
  implements PriceHistoryAttributes
{
  public id?: number;
  public price!: number;
  public date!: Date;
  public productUrlId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PriceHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    productUrlId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductUrl,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'price_histories',
  }
);
