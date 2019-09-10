import { Users } from '../models/users';
import { Transaction } from 'sequelize/types';


export class UserService {
  static async getUser(userId: number): Promise<Users> {
    let user: Users = await Users.getUser(userId);
    if (userId !== null) {
      return user;
    }
  }

  static async getUsers(): Promise<Users[]> {
    let user: Users[] = await Users.getUsers();
    return user;
  }

  static async saveUser(newUser: Users, transaction?: Transaction): Promise<Users> {
    let user: Users = Users.addUser(newUser);
    return user.save({ transaction });
  }
}

