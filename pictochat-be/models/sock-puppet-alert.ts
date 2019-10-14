import { User } from './user';

export class SockPuppetAlert {
  deviceId: string;
  users: User[];

  constructor(deviceId: string, users?: User[]) {
    this.deviceId = deviceId;
    this.users = users || [];
  }

  toJSON() {
    return {
      deviceId: this.deviceId,
      users: this.users.map(user => user.getPublicJSON())
    };
  }
}
