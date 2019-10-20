import { createNamespace } from 'continuation-local-storage';
import { Sequelize, Dialect } from 'sequelize';
import config from './config';

// Config
const DB_HOST = config.DB_HOST;
const DB_PORT = config.DB_PORT;
const DB_USER = config.DB_USER;
const DB_PASSWORD = config.DB_PASSWORD;
const DB_NAME = config.DB_NAME;
const DB_DIALECT = config.DB_DIALECT as Dialect;

/**
 * This class maintains a singleton sequelize connection to the pictochat database
 */
export class SequelizeConnection {
  private static instance: Sequelize = null;

  static getInstance(
    host: string = DB_HOST,
    port: number = DB_PORT,
    user: string = DB_USER,
    password: string = DB_PASSWORD,
    databaseName: string = DB_NAME,
    dialect: Dialect = DB_DIALECT
  ): Sequelize {
    if (SequelizeConnection.instance === null) {
      console.log('Creating Sequelize instance');
      // Setting the CLS makes transactions automatically apply to all queries within
      // a sequelize.transaction(...) callback
      const namespace = createNamespace('default');
      Sequelize.useCLS(namespace);

      SequelizeConnection.instance = new Sequelize(databaseName, user, password, {
        dialect: dialect,
        host: host,
        port: port
      });
    }

    return SequelizeConnection.instance;
  }
}
