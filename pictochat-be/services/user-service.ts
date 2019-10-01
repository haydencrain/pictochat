import { User } from '../models/user';
import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 12;

interface UpdateUserData {
  username?: string;
  email?: string;
}

export class UserService {
  static async getUserByUsername(username: string): Promise<User> {
    return await User.getUserByUsername(username);
  }

  static async getUser(userId: number): Promise<User> {
    return await User.getUser(userId);
  }

  static async getUsers(): Promise<User[]> {
    return await User.getUsers();
  }

  static async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    return await User.createUser(username, hashedPassword);
  }

  static async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    let user = await User.getUser(userId);
    user.email = data.email;
    user.username = data.username;
    return await user.save();
  }

  static async assertPasswordMatch(userToCheck: User, password): Promise<boolean> {
    return await bcrypt.compare(password, userToCheck.password);
  }
}
