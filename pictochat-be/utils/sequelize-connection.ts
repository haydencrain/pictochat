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

  static getInstance(params: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    databaseName?: string;
    dialect?: Dialect;
    url: string;
  }): Sequelize {
    const defaultParams = {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      databaseName: DB_NAME,
      dialect: DB_DIALECT,
      url: config.DB_URL
    };

    params = { ...defaultParams, ...params };

    if (SequelizeConnection.instance === null) {
      console.log('Creating Sequelize instance');
      // Setting the CLS makes transactions automatically apply to all queries within
      // a sequelize.transaction(...) callback
      const namespace = createNamespace('default');
      Sequelize.useCLS(namespace);

      if (params.url === undefined) {
        const { databaseName, user, password, dialect, host, port } = params;
        SequelizeConnection.instance = new Sequelize(databaseName, user, password, {
          dialect: dialect,
          host: host,
          port: port
        });
      } else {
        SequelizeConnection.instance = new Sequelize(params.url);
      }
    }

    return SequelizeConnection.instance;
  }
}
