import * as cookies from 'js-cookie';
import ApiService from './ApiService';
import { IUser } from '../models/store/User';
import UnauthenticatedUser from '../models/UnauthenticatedUser';
import LoginResult from '../models/LoginResult';

/**
 * Implements HTTP Requests for the `'/user'` API endpoint
 * @class
 * @static
 */
class UserService {
  static getUserUrl(username: string): string {
    return `/user/${username}`;
  }

  static async getUser(username: string): Promise<IUser> {
    return await ApiService.get(`/user/${username}`);
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
      username: user.username,
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

  static async disableUser(user: IUser): Promise<void> {
    return await ApiService.sendDelete(`/user/${user.userId}`);
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
