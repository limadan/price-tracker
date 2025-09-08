import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { ProductUrl } from './ProductUrl';

interface ProductAttributes {
  id?: number;
  name: string;
  targetPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product
  extends Model<ProductAttributes>
  implements ProductAttributes
{
  public id?: number;
  public name!: string;
  public targetPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly productUrls?: any[];
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
);
