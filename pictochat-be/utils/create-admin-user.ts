import { User } from '../models/user';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import config from './config';

export async function createAdminUser() {
  const sequelize = SequelizeConnectionService.getInstance();
  await sequelize.transaction(async transaction => {
    let admin = await User.createUser(config.ADMIN_USER, config.ADMIN_PASSWORD);
    admin.hasAdminRole = true;
    await admin.save();
  });
}
