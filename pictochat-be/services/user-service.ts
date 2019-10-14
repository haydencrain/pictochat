import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { ForbiddenError } from '../exceptions/forbidden-error';
import { SequelizeConnectionService } from './sequelize-connection-service';
import { NotFoundError } from '../exceptions/not-found-error';

//Number of salt rounds used to encrypt the password
const BCRYPT_SALT_ROUNDS = 12;
const sequelize = SequelizeConnectionService.getInstance(); 

interface UpdateUserData {
  username?: string;
  email?: string;
}
/** Implements User related CRUD */
export class UserService {
  /**
   * Returns the user by its username
   * @param username 
   * @param includeDisabled 
   */
  static async getUserByUsername(username: string, includeDisabled: boolean = false): Promise<User> {
    return await User.getUserByUsername(username, includeDisabled);
  }
  /**
   * Reutrns the user by its userId
   * @param userId 
   */
  static async getUser(userId: number): Promise<User> {
    return await User.getUser(userId);
  }
  /**
   * Returns an array of all users
   */
  static async getUsers(): Promise<User[]> {
    return await User.getUsers();
  }
  /**
   * Creates a user
   * @param username 
   * @param password 
   */
  static async createUser(username: string, password: string): Promise<User> {
    /** Hashes the password by providing a password and the number of salt rounds 
     to bycrpt.hash*/
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    return await User.createUser(username, hashedPassword);
  }
  /**
   * Updates a user based on provided data
   * @param userId 
   * @param data 
   */
  static async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    let user = await User.getUser(userId);
    /** Checks if the user exists */
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
   * @param userId 
   * @param requestingUserId 
   */
  static async disableUser(userId: number, requestingUserId: number): Promise<void> {
    await sequelize.transaction(async transaction => {
      /** Checks if the user exists or has an admin role */
      const requestingUser = await User.getUser(requestingUserId);
      if (!requestingUser.hasAdminRole || requestingUserId == userId) {
        throw new ForbiddenError();
      }

      const user = await User.getUser(userId);
      if (user === null || user === undefined) {
        throw new NotFoundError();
      }

      user.disable();
      await user.save();
      // await user.destroy();
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
