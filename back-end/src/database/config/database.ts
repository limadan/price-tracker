import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL || 'database.sqlite',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      'Connection to the SQLite database has been established successfully.'
    );
  })
  .catch((error) => {
    console.error('Unable to connect to the SQLite database:', error);
  });

export default sequelize;
