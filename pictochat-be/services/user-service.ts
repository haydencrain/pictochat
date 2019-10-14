import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { ForbiddenError } from '../exceptions/forbidden-error';
import { SequelizeConnectionService } from './sequelize-connection-service';
import { NotFoundError } from '../exceptions/not-found-error';
import { UserRepo } from '../repositories/user-repo';

const BCRYPT_SALT_ROUNDS = 12;
const sequelize = SequelizeConnectionService.getInstance();

interface UpdateUserData {
  username?: string;
  email?: string;
}

export class UserService {
  static async getUserByUsername(username: string, includeDisabled: boolean = false): Promise<User> {
    return await UserRepo.getUserByUsername(username, includeDisabled);
  }

  static async getUser(userId: number): Promise<User> {
    return await UserRepo.getUser(userId);
  }

  static async getUsers(): Promise<User[]> {
    return await UserRepo.getUsers();
  }

  static async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    return await UserRepo.createUser(username, hashedPassword);
  }

  static async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    let user = await UserRepo.getUser(userId);
    if (user === null || user === undefined) {
      throw new NotFoundError();
    }
    user.email = data.email;
    user.username = data.username;
    return await user.save();
  }

  static async disableUser(userId: number, requestingUserId: number): Promise<void> {
    await sequelize.transaction(async transaction => {
      const requestingUser = await UserRepo.getUser(requestingUserId);
      if (!requestingUser.hasAdminRole || requestingUserId == userId) {
        throw new ForbiddenError();
      }

      const user = await UserRepo.getUser(userId);
      if (user === null || user === undefined) {
        throw new NotFoundError();
      }

      user.disable();
      await user.save();
      // await user.destroy();
    });
  }

  static async assertPasswordMatch(userToCheck: User, password): Promise<boolean> {
    return await bcrypt.compare(password, userToCheck.password);
  }
}
