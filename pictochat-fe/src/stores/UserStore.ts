import { observable, computed, action, ObservableMap, runInAction } from 'mobx';
import { User, IUser } from '../models/User';
import UserService from '../services/UserService';
import UnauthenticatedUser from '../models/UnauthenticatedUser';

/**
 * Stores the currently logged in user */
export default class UserStore {
  @observable currentUser: User = new User();
  @observable isLoading: boolean = true;
  @observable isLoggedIn: boolean = false;

  constructor() {
    this.init().catch(error => {
      console.error('Error encountered during user store initialization: ', error);
    });
  }

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
      runInAction(() => {
        this.isLoading = false;
      });
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
      runInAction(() => {
        this.isLoading = false;
      });
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
      this.isLoading = false;
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
      this.isLoading = false;
    }
  }

  @action.bound
  private setCurrentUser(user: User) {
    this.currentUser.replace(user);
  }
}
