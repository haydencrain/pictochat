import { observable, action } from 'mobx';

export interface IUser {
  /**
   * The username of the user
   */
  username: string;
  /**
   * The email of the user
   */
  email: string;
  /**
   * The id of the user
   */
  userId: string;
  /**
   * The URI of the user's avatar
   */
  userAvatarURI: string;
  /**
   * If true, the user has been  banned, and will be unable to log into the account
   */
  isDisabled?: boolean;
  /**
   * If true, this user is an administrator
   */
  hasAdminRole: boolean;
}

/**
 * Creates an mobx ovservable instance of a User, and provides extra methods for
 * handling CRUD updates.
 * @class
 */
export class User implements IUser {
  @observable username: string;
  @observable email: string;
  @observable userId: string;
  @observable userAvatarURI: string;
  @observable isDisabled: boolean = false;
  @observable hasAdminRole: boolean = false;

  constructor(data?: IUser) {
    if (data) {
      this.username = data.username;
      this.email = data.email;
      this.userId = data.userId;
      this.userAvatarURI = data.userAvatarURI;
      this.isDisabled = data.isDisabled || false;
      this.hasAdminRole = data.hasAdminRole;
    }
  }

  /**
   * Disables this user, and prevents them from logging in
   * @function
   */
  @action.bound
  disable() {
    this.isDisabled = true;
  }

  /**
   * Replaces this instance's user with another instance of a user
   * @function
   * @param { User } other - The post to replace this instance with
   */
  @action.bound
  replace(other: User) {
    this.username = other.username;
    this.email = other.email;
    this.userId = other.userId;
    this.userAvatarURI = other.userAvatarURI;
    this.isDisabled = other.isDisabled;
    this.hasAdminRole = other.hasAdminRole;
  }

  /**
   * Replaces this instance's post with an empty user
   * @function
   */
  @action.bound
  clear() {
    this.replace(new User());
  }
}

export default User;
