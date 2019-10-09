import { observable, computed, action, ObservableMap, runInAction, flow } from 'mobx';
import { User, IUser } from '../models/store/User';
import UserService from '../services/UserService';
import UnauthenticatedUser from '../models/UnauthenticatedUser';
import { computedFn } from 'mobx-utils';

/**
 * Stores the currently logged in user */
export default class UserStore {
  @observable currentUser: User = new User();
  @observable isLoading: boolean = true;
  @observable isLoggedIn: boolean = false;

  // This is used a generic cache if any UI elements need to incorporate
  // data about users other than the one currently logged in
  @observable userMap: ObservableMap<any, User> = observable.map(undefined, { name: 'users' });

  constructor() {
    this.init().catch(error => {
      console.error('Error encountered during user store initialization: ', error);
    });
  }

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

  // @action.bound
  // async disableUser(user: User) {
  //   try {
  //     console.log('disabled user: ', user);
  //     await UserService.disableUser(user);
  //     console.log('disabled user: ', user);
  //     runInAction(() => user.disable());
  //     // runInAction(() => {});
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  @action.bound
  async init() {
    this.isLoading = true;
    try {
      let hasValidSession = await UserService.hasValidSession();
      // mobx stops watching changes after the first await, justifying the strange use of runInAction below
      if (hasValidSession) {
        let user = new User(await UserService.getCurrentUser());
        this.setCurrentUser(user);
      }
      runInAction(() => {
        this.isLoggedIn = hasValidSession;
      });
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @action.bound
  async createUserAndAuth(userJson: UnauthenticatedUser): Promise<User> {
    this.isLoading = true;
    try {
      this.isLoggedIn = false;
      let user = await UserService.addUser(userJson, /* shouldAuthenticate */ true);
      let realUser: User;
      runInAction(() => {
        realUser = new User(user);
        this.setCurrentUser(realUser);
        this.isLoggedIn = true;
      });
      return realUser;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @action.bound
  async authAndLoadCurrentUser(userCredentials: UnauthenticatedUser) {
    this.isLoading = true;
    try {
      this.isLoggedIn = false;
      await UserService.authUser(userCredentials); // throws an error if auth fails
      let user = new User(await UserService.getCurrentUser());
      runInAction(() => {
        this.setCurrentUser(user);
        this.isLoading = false;
        this.isLoggedIn = true;
      });
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @action.bound
  async logout() {
    this.isLoading = true;
    try {
      this.isLoggedIn = false;
      this.currentUser.clear();
      await UserService.clearSession();
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @action.bound
  private setCurrentUser(user: User) {
    this.currentUser.replace(user);
  }
}
