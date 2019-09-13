import { User } from '../models/user';
import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 12;

interface NewUser {
  username: string;
  password: string;
}

interface UpdatedUser {
  username?: string;
  userEmail?: string;
}

export class UserService {
  static async getUser(username: string): Promise<User> {
    let user: User = await User.getUser(username);
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

  static async updateUser(userId: number, data: UpdatedUser): Promise<User> {
    return await User.updateUser(userId, { ...data } as User);
  }

  static async assertPasswordMatch(userToCheck: User, password): Promise<boolean> {
    const result: boolean = await bcrypt.compare(password, userToCheck.password);
    return result;
  }
}
