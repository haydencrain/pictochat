import { observable, action, runInAction } from 'mobx';
import { User } from '../models/store/User';
import UserService from '../services/UserService';
import UnauthenticatedUser from '../models/UnauthenticatedUser';

interface IAuthStore {
  /**
   * The currently logged in users
   */
  currentUser: User;
  /**
   * Set to true if the current user is in the process of logging in or logging out
   */
  isLoading: boolean;
  /**
   * Whether the current user is logged in successfully (aka whether a current user is present within the store)
   */
  isLoggedIn: boolean;
}

/**
 * Creates a new observable instance, which stores and coordinates updates for the currently logged in user
 * @class
 */
export default class AuthStore implements IAuthStore {
  @observable currentUser: User = new User();
  @observable isLoading: boolean = true;
  @observable isLoggedIn: boolean = false;

  constructor() {
    this.init().catch(error => {
      console.error('Error encountered during user store initialization: ', error);
    });
  }

  /**
   * Automatically fetches the current user if one is already logged in
   * @function
   */
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

  /**
   * Handles registration of a new user, and logs them in as the current user
   * @function
   * @param userJson - The registration data
   */
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

  /**
   * Handles authentication and logging in of a user
   * @param userCredentials - The login details of the user to authenticate
   */
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

  /**
   * Removes the current user (logs out)
   * @function
   */
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

  /**
   * Sets the current user
   * @param user - The new user to set
   */
  @action.bound
  private setCurrentUser(user: User) {
    this.currentUser.replace(user);
  }
}
