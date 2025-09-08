import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import { Product } from './Product';
import { Store } from './Store';
import { PriceHistory } from './PriceHistory';

interface ProductUrlAttributes {
  id?: number;
  productId: number;
  storeId: number;
  url: string;
  notifiedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductUrl
  extends Model<ProductUrlAttributes>
  implements ProductUrlAttributes
{
  public id!: number;
  public productId!: number;
  public storeId!: number;
  public url!: string;
  public notifiedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly product?: Product;
  public readonly store?: Store;
  public readonly priceHistories?: PriceHistory[];
}

ProductUrl.init(
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
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    notifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'product_urls',
    indexes: [
      {
        unique: true,
        fields: ['productId', 'storeId'],
      },
    ],
  }
);
