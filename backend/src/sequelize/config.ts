import { Dialect } from 'sequelize';

interface ISequelizeConfig {
  [key: string]: {
    dialect: Dialect;
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
  };
}

const config: ISequelizeConfig = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 8083,
    username: process.env.DB_USER || 'samuel',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'hrplatform',
  },
  test: {
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 8083,
    database: process.env.DB_NAME,
  },
  production: {
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 8083,

    database: process.env.DB_NAME,
  },
};

export = config;
