import User, { IUser } from './User';
import { observable, action } from 'mobx';

export interface ISockPuppetAlert {
  /**
   * The device id of the suspicious device
   */
  deviceId: string;
  /**
   * The users who have used the suspicious device
   */
  users: IUser[];
}

/**
 * Creates an observable instance of SockPuppetAlert
 * @class
 */
export class SockPuppetAlert {
  @observable deviceId: string;
  @observable users: User[];

  constructor(data?: { deviceId: string; users: User[] }) {
    if (data) {
      this.deviceId = data.deviceId;
      this.users = data.users;
    }
  }

  /**
   * Replaces the current instance of a Sock puppet with another instance
   * @param { SockPuppetAlert } other - The other instance to replace this Sock Puppet with
   */
  @action.bound
  replace(other: SockPuppetAlert) {
    this.deviceId = other.deviceId;
    this.users = other.users;
  }
}
