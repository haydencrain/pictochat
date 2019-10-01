import * as cookies from 'js-cookie';
import ApiService from './ApiService';
import { IUser } from '../models/User';
import UnauthenticatedUser from '../models/UnauthenticatedUser';

interface LoginResult {
  auth: boolean;
  token: string;
  message: string;
}

class UserService {
  static async getUser(username: string): Promise<IUser> {
    const query = {
      username
    };
    return await ApiService.get('/user', query);
  }

  static async getCurrentUser(): Promise<IUser> {
    return await ApiService.get(`/user/authed`);
  }

  static async hasValidSession(): Promise<boolean> {
    try {
      let user = await UserService.getCurrentUser();
      // If we can get the current user without a 401 ApiException,
      // we must have a valid session token
      return !!user;
    } catch (error) {
      if (!!error.status && error.status === 401) {
        return false;
      }
      throw error;
    }
  }

  static async authUser(user: UnauthenticatedUser): Promise<string> {
    const data = {
      username: user.email,
      password: user.password
    };
    const res: LoginResult = await ApiService.post('/user/login', data);
    if (res.auth) {
      UserService.maybeSetSessionToken(res);
      return res.message;
    } else {
      throw new Error(res.message);
    }
  }

  static async clearSession() {
    cookies.remove('pictochatJWT');
  }

  static async addUser(user: UnauthenticatedUser, shouldAuthenticate: boolean = false): Promise<IUser> {
    let res = await ApiService.post('/user', user); // throws an error if creation fails
    if (shouldAuthenticate) {
      UserService.maybeSetSessionToken(res);
    }
    return res.user;
  }

  private static maybeSetSessionToken(response: any) {
    if (response.auth && response.token) {
      cookies.set('pictochatJWT', response.token);
      return true;
    }
    return false;
  }
}

export default UserService;
