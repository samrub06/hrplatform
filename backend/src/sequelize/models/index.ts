import fs from 'fs';
import path from 'path';
import { DataTypes, Sequelize } from 'sequelize';
import config from '../../config';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const db: { [key: string]: any } = {};

let sequelize: Sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig,
  );
}

const modelsPath = path.join(__dirname, '../../models');

fs.readdirSync(modelsPath)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== 'index.ts' && file.slice(-3) === '.ts'
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const model = require(path.join(modelsPath, file)).default(
      sequelize,
      DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
