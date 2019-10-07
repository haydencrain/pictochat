import { observable, action } from 'mobx';

export interface IUser {
  username: string;
  email: string;
  userId: string;
  userAvatarURI: string;
  isDisabled?: boolean;
  hasAdminRole: boolean;
}

// TODO: Rename class to User once register and login code is stable
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

  @action.bound
  disable() {
    this.isDisabled = true;
  }

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
   * Sets all properties to undefind. */
  @action.bound
  clear() {
    this.replace(new User());
  }
}

export default User;
