import { UserService } from '../services/user-service';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import config from './config';

export async function createAdminUser() {
  const sequelize = SequelizeConnectionService.getInstance();
  await sequelize.transaction(async transaction => {
    let admin = await UserService.createUser(config.ADMIN_USER, config.ADMIN_PASSWORD);
    admin.hasAdminRole = true;
    // FIXME: Figure out if email actually needs to be set
    admin.email = 'admin@example.com';
    await admin.save();
  });
}
