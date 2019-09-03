import { Users } from '../models/users';

export class UserService {
  static async getUser(userId: number): Promise<Users> {
    const user: User = await Users.getUser(userId);
    if(userId !== null){
      return user;
    }
  }

  static async getUsers(): Promise<Users[]> {
    const user: Users = await Users.getUsers();
    return user;
  }
}
