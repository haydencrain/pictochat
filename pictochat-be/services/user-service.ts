import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { ForbiddenError } from '../exceptions/forbidden-error';
import { SequelizeConnection } from '../utils/sequelize-connection';
import { NotFoundError } from '../exceptions/not-found-error';
import { UserRepo } from '../repositories/user-repo';
import config from '../utils/config';

const BCRYPT_SALT_ROUNDS = config.BCRYPT_SALT_ROUNDS;
const sequelize = SequelizeConnection.getInstance();

interface UpdateUserData {
  username?: string;
  email?: string;
}

/** Implements User related domain logic */
export class UserService {
  /**
   * @param username
   * @param includeDisabled Whether to return the specified user if disabled
   */
  static async getUserByUsername(username: string, includeDisabled: boolean = false): Promise<User> {
    return await UserRepo.getUserByUsername(username, includeDisabled);
  }

  /**
   * Get user by userId
   * @param userId
   */
  static async getUser(userId: number): Promise<User> {
    return await UserRepo.getUser(userId);
  }

  /**
   * Returns an array of all users
   */
  static async getUsers(): Promise<User[]> {
    return await UserRepo.getUsers();
  }

  /**
   * Creates a user
   * @param username
   * @param password
   */
  static async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    return await UserRepo.createUser(username, hashedPassword);
  }

  /**
   * Updates a user based on provided data
   * @param userId
   * @param data
   */
  static async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    let user = await UserRepo.getUser(userId);
    if (user === null || user === undefined) {
      throw new NotFoundError();
    }

    /** Overwrites and saves credentials */
    user.email = data.email;
    user.username = data.username;
    return await user.save();
  }

  /**
   * Disables a user
   * @param userId userId of the user to be disabled
   * @param requestingUserId userId of the user who initiated the disable user action
   */
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
    });
  }

  /**
   * Checks if the password in the database matches the inputted password
   * @param userToCheck
   * @param password
   */
  static async assertPasswordMatch(userToCheck: User, password): Promise<boolean> {
    return await bcrypt.compare(password, userToCheck.password);
  }
}
