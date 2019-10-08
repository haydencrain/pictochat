import { createNamespace } from 'continuation-local-storage';
import { Sequelize, Dialect } from 'sequelize';

// Config
const DB_HOST = process.env.PICTOCHAT_DB_HOST || '192.168.99.100';
const DB_PORT = parseInt(process.env.PICTOCHAT_DB_PORT) || 5432;
const DB_USER = process.env.PICTOCHAT_DB_USER || 'postgres';
const DB_PASSWORD = process.env.PICTOCHAT_DB_PASSWORD || 'postgres';
const DB_NAME = process.env.PICTOCHAT_DB_NAME || 'pictochat';
const DB_DIALECT = 'postgres';

const DB_URL = process.env.DATABASE_URL;

/**
 * This class maintains a single instanced sequelize connection to the pictochat database
 */
export class SequelizeConnectionService {
  private static instance: Sequelize = null;

  static getInstance(
    host: string = DB_HOST,
    port: number = DB_PORT,
    user: string = DB_USER,
    password: string = DB_PASSWORD,
    databaseName: string = DB_NAME,
    dialect: Dialect = DB_DIALECT
  ): Sequelize {
    if (SequelizeConnectionService.instance === null) {
      console.log('Creating Sequelize instance');
      // Setting the CLS allows transactions to auto passed through to all queries within
      // a sequelize.transaction(...) callback
      const namespace = createNamespace('pictochat');
      Sequelize.useCLS(namespace);

      if (DB_URL === undefined) {
        SequelizeConnectionService.instance = new Sequelize(databaseName, user, password, {
          dialect: dialect,
          host: host,
          port: port
        });
      } else {
        SequelizeConnectionService.instance = new Sequelize(DB_URL);
      }
      return SequelizeConnectionService.instance;
    }
  }
