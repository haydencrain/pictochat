import { observable, action } from 'mobx';

export interface IUser {
  username: string;
  email: string;
  userId: string;
}

// TODO: Rename class to User once register and login code is stable
export class User implements IUser {
  @observable username: string;
  @observable email: string;
  @observable userId: string;
  constructor(data?: { username: string; email: string; userId: string }) {
    if (data) {
      this.username = data.username;
      this.email = data.email;
      this.userId = data.userId;
    }
  }

  @action.bound
  replace(other: User) {
    this.username = other.username;
    this.email = other.email;
    this.userId = other.userId;
  }

  /**
   * Sets all properties to undefind. */
  @action.bound
  clear() {
    this.replace(new User());
  }
}

export default User;
