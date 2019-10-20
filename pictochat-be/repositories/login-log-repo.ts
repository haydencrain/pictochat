import { LoginLog, ILoginLog } from '../models/login-log';
import { User } from '../models/user';

export class LoginLogRepo {
  static async logUserAccess(user: User, deviceId: string, loginTimestamp?: Date): Promise<LoginLog> {
    loginTimestamp = loginTimestamp || new Date();
    return await LoginLog.create({ userId: user.userId, deviceId, loginTimestamp });
  }
}
