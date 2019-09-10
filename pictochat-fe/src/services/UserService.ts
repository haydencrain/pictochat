import { User } from '../models/User';
import ApiService from './ApiService';

class UserService {
  static async getUser(userId: string): Promise<User> {
    return await ApiService.get(`/user /${userId}`);
  }

  /* authUser(email: String, password: string) {
    let body = {
      email,
      password
    }
  } */
  static async authUser(user: User): Promise<User> {
    return await ApiService.post('/user/auth', user);
  }

  static async addUser(user: User): Promise<User> {
    return await ApiService.post('/user/add-user', user);
  }
}

export default UserService;
