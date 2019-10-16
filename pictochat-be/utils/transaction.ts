import { SequelizeConnection } from './sequelize-connection';
import { Transaction } from 'sequelize';

/**
 * Wrapper for ORM's (Sequelize) transaction interface.
 * This function will (hopefully!)  make it easier for us to swap out ORMs in
 * future with minimal changes to the services or routes.
 */
export async function transaction<R>(actionCB: () => Promise<R>): Promise<R> {
  const sequelize = SequelizeConnection.getInstance();
  return await sequelize.transaction(async (transaction: Transaction) => await actionCB());
}
