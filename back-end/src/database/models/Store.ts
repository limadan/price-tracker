import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface StoreAttributes {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Store extends Model<StoreAttributes> implements StoreAttributes {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Store.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  },
  {
    sequelize,
    tableName: 'stores',
  }
);