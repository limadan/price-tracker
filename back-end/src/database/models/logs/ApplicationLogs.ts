import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export type Severity = 'info' | 'warning' | 'error';

interface ApplicationLogsAttributes {
  id?: number;
  message: string;
  severity?: Severity;
  stack?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ApplicationLogs
  extends Model<ApplicationLogsAttributes>
  implements ApplicationLogsAttributes
{
  public id?: number;
  public message!: string;
  public severity?: Severity;
  public stack?: string;
  public route?: string;
  public method?: string;
  public statusCode?: number;
  public timestamp?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ApplicationLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    severity: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stack: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    route: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'error_logs',
  }
);
