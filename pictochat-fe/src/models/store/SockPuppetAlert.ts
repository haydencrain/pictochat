import User, { IUser } from './User';
import { observable, action } from 'mobx';

export interface ISockPuppetAlert {
  deviceId: string;
  users: IUser[];
}

export class SockPuppetAlert {
  @observable deviceId: string;
  @observable users: User[];
  constructor(data?: { deviceId: string; users: User[] }) {
    if (data) {
      this.deviceId = data.deviceId;
      this.users = data.users;
    }
  }

  @action.bound
  replace(other: SockPuppetAlert) {
    this.deviceId = other.deviceId;
    this.users = other.users;
  }
}
