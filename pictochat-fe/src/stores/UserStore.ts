import { observable, action, ObservableMap, runInAction, flow } from 'mobx';
import { User } from '../models/store/User';
import UserService from '../services/UserService';
import UnauthenticatedUser from '../models/UnauthenticatedUser';
import { computedFn } from 'mobx-utils';

/**
 * Stores the currently logged in user */
export default class UserStore {
  @observable isLoading: boolean = true;

  // This is used a generic cache if any UI elements need to incorporate
  // data about users other than the one currently logged in
  @observable userMap: ObservableMap<any, User> = observable.map(undefined, { name: 'users' });

  constructor() {}

  /**
   * WARNING: Converting this into an arrow function will break computedFn
   * As noted: https://mobx.js.org/refguide/computed-decorator.html */
  hasUser = computedFn(function hasUser(username: string) {
    return this.userMap.has(username);
  });

  @action.bound
  async fetchUser(username: string) {
    try {
      this.isLoading = true;
      const userJson = await UserService.getUser(username);
      runInAction(() => {
        this.putInUserMap(new User(userJson));
      });
    } finally {
      this.isLoading = false;
    }
  }

  @action.bound
  putInUserMap(user: User): User {
    if (this.userMap.has(user.username)) {
      this.userMap.get(user.username).replace(user);
    } else {
      this.userMap.set(user.username, user);
    }
    return this.userMap.get(user.username);
  }

  disableUser = flow(function*(user: User) {
    try {
      // console.log('disabled user: ', user);
      yield UserService.disableUser(user);
      console.log('disabled user: ', user);
      user.disable();
      // runInAction(() => {});
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
}
