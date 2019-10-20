import { observable, action, ObservableMap, runInAction, flow } from 'mobx';
import { User } from '../models/store/User';
import UserService from '../services/UserService';
import { computedFn } from 'mobx-utils';

interface IUserStore {
  /**
   * Set to true if the store is currently loading or updating users
   */
  isLoading: boolean;
  /**
   * This is used a generic cache if any UI elements need to incorporate data about users other than the one currently logged in
   */
  userMap: ObservableMap<any, User>;
}

export default class UserStore implements IUserStore {
  @observable isLoading: boolean = true;
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
      runInAction(() => {
        this.isLoading = false;
      });
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
      yield UserService.disableUser(user);
      user.disable();
    } catch (error) {
      throw error;
    }
  });
}
