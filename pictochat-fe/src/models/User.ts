import { observable, action } from 'mobx';

export interface User {
  username: string;
  email: string;
  password: string;
}

// TODO: Rename class to User once register and login code is stable
export class UserModel {
  @observable username: string;
  @observable email: string;
  // shouldn't keep a copy of user's password around!
  constructor(data?: { username: string, email: string }) {
    if (data) {
      this.username = data.username;
      this.email = data.email;
    }
  }

  @action.bound
  replace(other: UserModel) {
    this.username = other.username;
    this.email = other.email;
  }
}
