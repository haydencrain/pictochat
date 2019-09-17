import { User } from '../models/User';
import ApiService from './ApiService';
import * as cookies from 'js-cookie';

interface LoginResult {
  auth: boolean;
  token: string;
  message: string;
}

class UserService {
  static async getUser(username: string): Promise<User> {
    return await ApiService.get(`/user?username=${username}`);
  }

  static async authUser(user: User): Promise<string> {
    const data = {
      username: user.email,
      password: user.password
    };
    const res: LoginResult = await ApiService.post('/user/login', data);
    if (res.auth) {
      cookies.set('pictochatJWT', res.token);
      return res.message;
    } else {
      throw new Error(res.message);
    }
  }

  static async addUser(user: User): Promise<{ message: string; user?: User }> {
    return await ApiService.post('/user', user);
  }
}

export default UserService;
