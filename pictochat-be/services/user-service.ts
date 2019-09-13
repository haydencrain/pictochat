import { User } from '../models/user';
import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 12;

interface UpdateUserData {
  username?: string;
  email?: string;
}

export class UserService {
  static async getUserByUsername(username: string): Promise<User> {
    let user: User = await User.getUserByUsername(username);
    return user;
  }

  static async getUser(userId: number): Promise<User> {
    let user: User = await User.getUser(userId);
    return user;
  }

  static async getUsers(): Promise<User[]> {
    let user: User[] = await User.getUsers();
    return user;
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
    const result: boolean = await bcrypt.compare(password, userToCheck.password);
    return result;
  }
}
